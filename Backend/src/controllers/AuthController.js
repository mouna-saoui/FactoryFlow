const service = require('../Services/AuthService');

const login = async (req, res) => {
  try {
    const result = await service.login(req.body.email, req.body.password);
    res.json(result);
  } catch (e) {
    return res.status(e.status).json({message: e.message})
  }
};

const profile = async (req, res) => {
  try {
    const user = await service.getProfile(req.user.id);
   return res.status(200).json(user);
  
  } catch (e) { 
    return res.status(e.status).json({message: e.message});
  }
};

const createUser = async (req, res) => {
  try {
    const user = await service.createUser(req.body);
    res.status(201).json(user);
  } catch (e) { 
    return res.status(e.status).json({message: e.message})
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await service.listUsers();
    res.json(users);
  } catch (e) { 
    return res.status(e.status).json({message: e.message})
  }
};

module.exports = { login, profile, createUser, listUsers };
