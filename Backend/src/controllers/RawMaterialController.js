const service = require('../Services/RawMaterialService');

const create = async (req, res, next) => {
  try {
    const mat = await service.create(req.body);
    res.status(201).json(mat);
  } catch (e) { next(e); }
};

const findAll = async (req, res, next) => {
  try {
    res.json(await service.findAll());
  } catch (e) { next(e); }
};

const findById = async (req, res, next) => {
  try {
    res.json(await service.findById(req.params.id));
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    res.json(await service.update(req.params.id, req.body));
  } catch (e) { next(e); }
};

const findAlerts = async (req, res, next) => {
  try {
    res.json(await service.findAlerts());
  } catch (e) { next(e); }
};

module.exports = { create, findAll, findById, update, findAlerts };
