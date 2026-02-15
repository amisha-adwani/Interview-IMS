import * as productService from '../services/product.service.js';

export const create = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data: product });
};

export const bulkCreate = async (req, res) => {
  const { products } = req.body;
  const results = await productService.bulkCreateProducts(products);
  res.status(201).json({ success: true, data: results });
};

export const update = async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.json({ success: true, data: product });
};

export const remove = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.json({ success: true, message: 'Product deleted' });
};

export const getById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json({ success: true, data: product });
};

export const list = async (req, res) => {
  const result = await productService.listProducts(req.query);
  res.json({ success: true, ...result });
};
