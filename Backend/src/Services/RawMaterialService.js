const repo = require('../Repository/RawMaterialRepository');

const create = async (data) => {
  const exists = await repo.findByRef(data.reference);
  if (exists) throw { status: 409, message: 'Reference already exists' };
  return repo.create(data);
};

const findAll  = () => repo.findAll();
const findAlerts = () => repo.findAlerts();

const findById = async (id) => {
  const mat = await repo.findById(id);
  if (!mat) throw { status: 404, message: 'Raw material not found' };
  return mat;
};

const update = async (id, data) => {
  if (data.reference) {
    const exists = await repo.findByRef(data.reference);
    if (exists && exists._id.toString() !== id)
      throw { status: 409, message: 'Reference already exists' };
  }
  const mat = await repo.updateById(id, data);
  if (!mat) throw { status: 404, message: 'Raw material not found' };
  return mat;
};

module.exports = { create, findAll, findById, update, findAlerts };
