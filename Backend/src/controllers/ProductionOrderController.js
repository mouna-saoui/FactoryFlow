const service = require('../Services/ProductionOrderService');

const create = async (req, res, next) => {
  try {
    res.status(201).json(await service.create(req.body));
  } catch (error) { next(error); }
};

const listOrders = async (req, res, next) => {
  try {
    res.json(await service.listOrders(req.query));
  } catch (error) { next(error); }
};

const myOrders = async (req, res, next) => {
  try {
    res.json(await service.myOrders(req.user.id, req.query));
  } catch (error) { next(error); }
};

const findById = async (req, res, next) => {
  try {
    res.json(await service.findById(req.params.id, req.user));
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    res.json(await service.update(req.params.id, req.body));
  } catch (error) { next(error); }
};

const cancel = async (req, res, next) => {
  try {
    res.json(await service.cancel(req.params.id));
  } catch (error) { next(error); }
};

const start = async (req, res, next) => {
  try {
    res.json(await service.start(req.params.id, req.user.id));
  } catch (error) { next(error); }
};

const finish = async (req, res, next) => {
  try {
    res.json(await service.finish(req.params.id, req.user.id));
  } catch (error) { next(error); }
};

module.exports = { create, listOrders, myOrders, findById, update, cancel, start, finish };