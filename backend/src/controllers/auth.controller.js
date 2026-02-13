import * as authService from '../services/auth.service.js';

export const register = async (req, res) => {
  const { email, password, role } = req.body;
  const result = await authService.register(email, password, role);
  res.status(201).json({ success: true, ...result });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json({ success: true, ...result });
};
