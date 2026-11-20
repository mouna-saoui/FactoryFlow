const service = require('../Services/StockMovementService');

const create = async (req, res, next) => {
  try {
    res.status(201).json(await service.create(req.body, req.user.id));
  } catch (error) { next(error); }
};

const findAll = async (req, res, next) => {
  try {
    res.json(await service.findAll(req.query));
  } catch (error) { next(error); }
};

module.exports = { create, findAll };