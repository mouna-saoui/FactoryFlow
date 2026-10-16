const argon2  = require('argon2');
const jwt     = require('jsonwebtoken');
const repo    = require('../Repository/AuthRepository');

const login = async (email, password) => {
  const user = await repo.findByEmail(email);
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const valid = await argon2.verify(user.password, password);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
  return { message: 'Login successful', token };
};

const getProfile = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw { status: 404, message: 'User not found' };
  const { password: _, ...profile } = user.toObject();
  return profile;
};


const createUser = async ({ name, email, password, role }) => {
  const exists = await repo.findByEmail(email);
  if (exists) throw { status: 409, message: 'Email already in use' };

  const hashed = await argon2.hash(password);
  const user   = await repo.create({ name, email, password: hashed, role });
  const { password: _, ...result } = user.toObject();
  return result;
};

const listUsers = () => repo.findAll();

module.exports = { login, getProfile, createUser, listUsers };
