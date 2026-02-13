import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const fail = (next, code, message) => {
  const err = new Error(message);
  err.statusCode = code;
  next(err);
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) return fail(next, 401, 'Authentication required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('_id email role');

    if (!user) return fail(next, 401, 'User not found');

    req.user = { id: user._id, email: user.email, role: user.role };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') return fail(next, 401, 'Invalid token');
    if (error.name === 'TokenExpiredError') return fail(next, 401, 'Token expired');
    next(error);
  }
};

export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return fail(next, 401, 'Authentication required');
    if (!allowedRoles.includes(req.user.role)) return fail(next, 403, 'Insufficient permissions');
    next();
  };
};
