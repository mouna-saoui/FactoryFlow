const ProductionOrder = require('../Models/ProductionOrderModel');
const Product = require('../Models/ProductModel');
const RawMaterial = require('../Models/RawMaterialModel');
const StockMovement = require('../Models/StockMovementModel');
const User = require('../Models/UserModel');

const orderPopulation = [
  { path: 'product', select: 'reference name' },
  { path: 'operator', select: 'name email role' },
  { path: 'compositionSnapshot.material', select: 'reference name unit' },
];

const findProductById = (id) => Product.findById(id).populate('composition.material', 'reference name unit');
const findOperatorById = (id) => User.findOne({ _id: id, role: 'OPERATOR', isActive: true });
const create = (data, session) => ProductionOrder.create([data], { session }).then(([order]) => order);
const findById = (id, session) => ProductionOrder.findById(id).session(session || null).populate(orderPopulation);
const findAll = ({ query, skip, limit }) => ProductionOrder.find(query)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate(orderPopulation);
const count = (query) => ProductionOrder.countDocuments(query);
const updatePlanned = (id, data) => ProductionOrder.findOneAndUpdate(
  { _id: id, status: 'PLANIFIE' },
  data,
  { new: true, runValidators: true }
).populate(orderPopulation);
const findForOperator = (id, operatorId, session) => ProductionOrder.findOne({ _id: id, operator: operatorId })
  .session(session || null);
const findForOperatorList = (operatorId, { query, skip, limit }) => ProductionOrder.find({ ...query, operator: operatorId })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate(orderPopulation);
const decrementMaterial = (id, quantity, session) => RawMaterial.findOneAndUpdate(
  { _id: id, quantity: { $gte: quantity } },
  { $inc: { quantity: -quantity } },
  { new: true, session }
);
const createMovements = (movements, session) => StockMovement.create(movements, { session });
const updateStatus = (id, status, fields, session) => ProductionOrder.findOneAndUpdate(
  { _id: id, status },
  { $set: fields },
  { new: true, session }
).populate(orderPopulation);
const finishForOperator = (id, operatorId, session) => ProductionOrder.findOneAndUpdate(
  { _id: id, operator: operatorId, status: 'EN_COURS' },
  { $set: { status: 'TERMINE', finishedAt: new Date() } },
  { new: true, session }
).populate(orderPopulation);

module.exports = {
  create,
  findAll,
  findById,
  findForOperator,
  findForOperatorList,
  findOperatorById,
  findProductById,
  count,
  updatePlanned,
  decrementMaterial,
  createMovements,
  updateStatus,
  finishForOperator,
};