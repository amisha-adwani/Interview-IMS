import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (email, password, role = 'viewer') => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create({
    email: email.toLowerCase(),
    password,
    role: role === 'admin' ? 'admin' : 'viewer',
  });

  const token = generateToken(user._id, user.role);
  return {
    user: { id: user._id, email: user.email, role: user.role },
    token,
  };
};

export const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user._id, user.role);
  return {
    user: { id: user._id, email: user.email, role: user.role },
    token,
  };
};

function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}
