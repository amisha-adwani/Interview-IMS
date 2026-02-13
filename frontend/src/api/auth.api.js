import client from './client';

export const login = (email, password) =>
  client.post('/auth/login', { email, password });

export const register = (email, password, role = 'viewer') =>
  client.post('/auth/register', { email, password, role });
