const User = require('../Models/UserModel');

const findByEmail = (email) => User.findOne({ email });
const findById   = (id)    => User.findById(id);
const create     = (data)  => User.create(data);
const findAll    = ()      => User.find({}, '-password');

module.exports = { findByEmail, findById, create, findAll };
