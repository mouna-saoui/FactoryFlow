const router      = require('express').Router();
const auth        = require('../controllers/AuthController');
const rawMaterial = require('../controllers/RawMaterialController');
const product     = require('../controllers/ProductController');
const { authenticate, requireRole } = require('../Middlewares/AuthMiddleware');

// Public
router.post('/auth/login', auth.login);

// Authenticated
router.get('/auth/profile', authenticate, auth.profile);

// Admin only
router.post('/users', authenticate, requireRole('ADMIN'), auth.createUser);
router.get('/users',  authenticate, requireRole('ADMIN'), auth.listUsers);

// Raw materials — Admin only
router.get('/raw-materials/alerts',  authenticate, requireRole('ADMIN'), rawMaterial.findAlerts);
router.post('/raw-materials',        authenticate, requireRole('ADMIN'), rawMaterial.create);
router.get('/raw-materials',         authenticate, requireRole('ADMIN'), rawMaterial.findAll);
router.get('/raw-materials/:id',     authenticate, requireRole('ADMIN'), rawMaterial.findById);
router.patch('/raw-materials/:id',   authenticate, requireRole('ADMIN'), rawMaterial.update);

// Products — Admin only
router.post('/products',       authenticate, requireRole('ADMIN'), product.create);
router.get('/products',        authenticate, requireRole('ADMIN'), product.findAll);
router.get('/products/:id',    authenticate, requireRole('ADMIN'), product.findById);
router.patch('/products/:id',  authenticate, requireRole('ADMIN'), product.update);

module.exports = router;
