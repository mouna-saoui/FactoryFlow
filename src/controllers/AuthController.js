const service = require('../Services/AuthService');

const login = async (req, res, next) => {
  try {
    const result = await service.login(req.body.email, req.body.password);
    res.json(result);
  } catch (e) { next(e); }
};

const profile = async (req, res, next) => {
  try {
    const user = await service.getProfile(req.user.id);
    res.json(user);
  } catch (e) { next(e); }
};

const createUser = async (req, res, next) => {
  try {
    const user = await service.createUser(req.body);
    res.status(201).json(user);
  } catch (e) { next(e); }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await service.listUsers();
    res.json(users);
  } catch (e) { next(e); }
};

module.exports = { login, profile, createUser, listUsers };
