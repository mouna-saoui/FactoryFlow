require('dotenv').config();
const argon2    = require('argon2');
const connectDB = require('./src/Config/Database');
const User      = require('./src/Models/UserModel');

(async () => {
  await connectDB();

  const exists = await User.findOne({ role: 'ADMIN' });
  if (exists) {
    console.log('Admin already exists:', exists.email);
    process.exit(0);
  }

  const password = await argon2.hash('Admin123!');
  const admin = await User.create({
    name:     'Admin FactoryFlow',
    email:    'admin@factoryflow.com',
    password,
    role:     'ADMIN',
  });

  console.log('Admin created:', admin.email);
  process.exit(0);
})();
