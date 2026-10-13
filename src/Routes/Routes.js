const router = require('express').Router();
const auth   = require('../controllers/AuthController');
const { authenticate, requireRole } = require('../Middlewares/AuthMiddleware');

// Public
router.post('/auth/login', auth.login);

// Authenticated
router.get('/auth/profile', authenticate, auth.profile);

// Admin only
router.post('/users', authenticate, requireRole('ADMIN'), auth.createUser);
router.get('/users',  authenticate, requireRole('ADMIN'), auth.listUsers);

module.exports = router;
