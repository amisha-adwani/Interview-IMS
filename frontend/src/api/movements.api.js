import client from './client';

export const listMovements = (params) => client.get('/movements', { params });
export const createMovement = (data) => client.post('/movements', data);
