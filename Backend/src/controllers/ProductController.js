const service = require('../Services/ProductService');

const create = async (req, res, next) => {
  try {
    res.status(201).json(await service.create(req.body));
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

module.exports = { create, findAll, findById, update };
