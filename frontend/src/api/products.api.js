import client from './client';

export const listProducts = (params) => client.get('/products', { params });
export const getProduct = (id) => client.get(`/products/${id}`);
export const createProduct = (data) => client.post('/products', data);
export const bulkCreateProducts = (products) => client.post('/products/bulk', { products });
export const updateProduct = (id, data) => client.patch(`/products/${id}`, data);
export const deleteProduct = (id) => client.delete(`/products/${id}`);
