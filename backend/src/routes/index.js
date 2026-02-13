import { Router } from 'express';
import { body, param } from 'express-validator';
import { validationResult } from 'express-validator';
import * as authController from '../controllers/auth.controller.js';
import * as productController from '../controllers/product.controller.js';
import * as movementController from '../controllers/movement.controller.js';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';

const router = Router();

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error(errors.array().map((e) => e.msg).join('. '));
    err.statusCode = 400;
    return next(err);
  }
  next();
};

// Auth
router.post(
  '/auth/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'viewer']).withMessage('Role must be admin or viewer'),
  ],
  validate,
  wrap(authController.register)
);
router.post(
  '/auth/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  wrap(authController.login)
);

// Products (all require auth)
router.get('/products', authenticate, wrap(productController.list));
router.get(
  '/products/:id',
  authenticate,
  [param('id').isMongoId().withMessage('Invalid product ID')],
  validate,
  wrap(productController.getById)
);
router.post(
  '/products',
  authenticate,
  requireRoles('admin'),
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('sku').trim().notEmpty().withMessage('SKU required'),
    body('category').trim().notEmpty().withMessage('Category required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
    body('quantity').optional().isInt({ min: 0 }),
    body('lowStockThreshold').optional().isInt({ min: 0 }),
  ],
  validate,
  wrap(productController.create)
);
router.patch(
  '/products/:id',
  authenticate,
  requireRoles('admin'),
  [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('name').optional().trim().notEmpty(),
    body('sku').optional().trim().notEmpty(),
    body('category').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('quantity').optional().isInt({ min: 0 }),
    body('lowStockThreshold').optional().isInt({ min: 0 }),
  ],
  validate,
  wrap(productController.update)
);
router.delete(
  '/products/:id',
  authenticate,
  requireRoles('admin'),
  [param('id').isMongoId().withMessage('Invalid product ID')],
  validate,
  wrap(productController.remove)
);

// Movements
router.get('/movements', authenticate, wrap(movementController.list));
router.post(
  '/movements',
  authenticate,
  requireRoles('admin'),
  [
    body('productId').isMongoId().withMessage('Valid product ID required'),
    body('type').isIn(['IN', 'OUT']).withMessage('Type must be IN or OUT'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validate,
  wrap(movementController.create)
);

// Dashboard
router.get('/dashboard', authenticate, wrap(dashboardController.getStats));

export default router;
