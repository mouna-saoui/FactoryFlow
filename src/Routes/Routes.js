const router      = require('express').Router();
const auth        = require('../controllers/AuthController');
const rawMaterial = require('../controllers/RawMaterialController');
const product     = require('../controllers/ProductController');
const productionOrder = require('../controllers/ProductionOrderController');
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

// Production orders
router.post('/production-orders', authenticate, requireRole('ADMIN'), productionOrder.create);
router.get('/production-orders', authenticate, requireRole('ADMIN'), productionOrder.listOrders);
router.get('/production-orders/my-orders', authenticate, requireRole('OPERATOR'), productionOrder.myOrders);
router.post('/production-orders/:id/start', authenticate, requireRole('OPERATOR'), productionOrder.start);
router.post('/production-orders/:id/finish', authenticate, requireRole('OPERATOR'), productionOrder.finish);
router.get('/production-orders/:id', authenticate, requireRole('ADMIN', 'OPERATOR'), productionOrder.findById);
router.patch('/production-orders/:id', authenticate, requireRole('ADMIN'), productionOrder.update);
router.patch('/production-orders/:id/cancel', authenticate, requireRole('ADMIN'), productionOrder.cancel);

module.exports = router;
