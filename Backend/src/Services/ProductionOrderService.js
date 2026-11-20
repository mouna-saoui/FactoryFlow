const mongoose = require('mongoose');
const repo = require('../Repository/ProductionOrderRepository');

const validateId = (id, field) => {
  if (!mongoose.isValidObjectId(id))
    throw { status: 422, message: `Invalid ${field} id` };
};

const buildSnapshot = (product) => product.composition.map(({ material, quantity }) => ({
  material: material._id,
  materialReference: material.reference,
  quantity,
}));

const validateOrderData = async ({ product: productId, quantity, operator: operatorId }) => {
  if (!Number.isInteger(quantity) || quantity < 1)
    throw { status: 422, message: 'Quantity must be a positive integer' };
  validateId(productId, 'product');
  validateId(operatorId, 'operator');

  const [product, operator] = await Promise.all([
    repo.findProductById(productId),
    repo.findOperatorById(operatorId),
  ]);
  if (!product) throw { status: 404, message: 'Product not found' };
  if (!operator) throw { status: 404, message: 'Active operator not found' };
  if (!product.composition.length)
    throw { status: 422, message: 'Product must have at least one material' };
  return { product, operator };
};

const create = async (data) => {
  const { product } = await validateOrderData(data);
  return repo.create({
    product: product._id,
    quantity: data.quantity,
    operator: data.operator,
    compositionSnapshot: buildSnapshot(product),
  });
};

const makeFilter = ({ status, product, startDate, endDate }) => {
  const query = {};
  if (status) {
    if (!['PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE'].includes(status))
      throw { status: 422, message: 'Invalid order status' };
    query.status = status;
  }
  if (product) {
    validateId(product, 'product');
    query.product = product;
  }
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
    if (Object.values(query.createdAt).some((date) => !Number.isFinite(date.getTime())))
      throw { status: 422, message: 'Invalid date filter' };
  }
  return query;
};

const makePagination = ({ page = 1, limit = 10 }) => {
  const currentPage = Number(page);
  const pageSize = Number(limit);
  if (!Number.isInteger(currentPage) || currentPage < 1 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100)
    throw { status: 422, message: 'Page must be positive and limit must be between 1 and 100' };
  return { page: currentPage, limit: pageSize, skip: (currentPage - 1) * pageSize };
};

const listOrders = async (filters) => {
  const query = makeFilter(filters);
  const pagination = makePagination(filters);
  const [orders, total] = await Promise.all([
    repo.findAll({ query, ...pagination }),
    repo.count(query),
  ]);
  return { orders, page: pagination.page, limit: pagination.limit, total };
};

const myOrders = async (operatorId, filters) => {
  const query = makeFilter(filters);
  const pagination = makePagination(filters);
  const [orders, total] = await Promise.all([
    repo.findForOperatorList(operatorId, { query, ...pagination }),
    repo.count({ ...query, operator: operatorId }),
  ]);
  return { orders, page: pagination.page, limit: pagination.limit, total };
};

const findById = async (id, user) => {
  validateId(id, 'production order');
  const order = user.role === 'ADMIN'
    ? await repo.findById(id)
    : await repo.findForOperator(id, user.id).then((found) => found?.populate([
      { path: 'product', select: 'reference name' },
      { path: 'operator', select: 'name email role' },
      { path: 'compositionSnapshot.material', select: 'reference name unit' },
    ]));
  if (!order) throw { status: 404, message: 'Production order not found' };
  return order;
};

const update = async (id, data) => {
  validateId(id, 'production order');
  const current = await repo.findById(id);
  if (!current) throw { status: 404, message: 'Production order not found' };
  if (current.status !== 'PLANIFIE')
    throw { status: 409, message: 'Only planned orders can be modified' };

  const next = {
    product: data.product || current.product._id,
    quantity: data.quantity ?? current.quantity,
    operator: data.operator || current.operator._id,
  };
  const { product } = await validateOrderData(next);
  const order = await repo.updatePlanned(id, {
    ...next,
    compositionSnapshot: buildSnapshot(product),
  });
  if (!order) throw { status: 409, message: 'Production order is no longer planned' };
  return order;
};

const cancel = async (id) => {
  validateId(id, 'production order');
  const current = await repo.findById(id);
  if (!current) throw { status: 404, message: 'Production order not found' };
  const order = await repo.updateStatus(id, 'PLANIFIE', { status: 'ANNULE' });
  if (!order) throw { status: 409, message: 'Only planned orders can be cancelled' };
  return order;
};

const start = async (id, operatorId) => {
  validateId(id, 'production order');
  validateId(operatorId, 'operator');
  const session = await mongoose.startSession();
  let startedOrder;
  try {
    await session.withTransaction(async () => {
      const order = await repo.findForOperator(id, operatorId, session);
      if (!order) throw { status: 404, message: 'Assigned production order not found' };
      if (order.status !== 'PLANIFIE')
        throw { status: 409, message: 'Only planned orders can be started' };

      const movements = [];
      for (const item of order.compositionSnapshot) {
        const needed = item.quantity * order.quantity;
        const material = await repo.decrementMaterial(item.material, needed, session);
        if (!material)
          throw { status: 409, message: `Insufficient stock for material ${item.materialReference}` };
        movements.push({
          material: item.material,
          type: 'OUT',
          quantity: needed,
          user: operatorId,
          productionOrder: order._id,
        });
      }

      await repo.createMovements(movements, session);
      startedOrder = await repo.updateStatus(id, 'PLANIFIE', {
        status: 'EN_COURS',
        startedAt: new Date(),
      }, session);
      if (!startedOrder) throw { status: 409, message: 'Production order is no longer planned' };
    });
  } finally {
    await session.endSession();
  }
  return startedOrder;
};

const finish = async (id, operatorId) => {
  validateId(id, 'production order');
  validateId(operatorId, 'operator');
  const order = await repo.finishForOperator(id, operatorId);
  if (!order) {
    const assigned = await repo.findForOperator(id, operatorId);
    if (!assigned) throw { status: 404, message: 'Assigned production order not found' };
    throw { status: 409, message: 'Only in-progress orders can be finished' };
  }
  return order;
};

module.exports = { create, listOrders, myOrders, findById, update, cancel, start, finish };