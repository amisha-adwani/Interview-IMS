import Product from '../models/Product.js';

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const createProduct = async (data) => {
  const product = await Product.create({
    ...data,
    sku: data.sku?.toUpperCase(),
  });
  return product;
};

export const bulkCreateProducts = async (products) => {
  const results = {
    success: [],
    errors: []
  };

  for (const productData of products) {
    try {
      const product = await Product.create({
        ...productData,
        sku: productData.sku?.toUpperCase(),
      });
      results.success.push(product);
    } catch (error) {
      results.errors.push({
        data: productData,
        error: error.message
      });
    }
  }

  return results;
};

export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { ...data, ...(data.sku && { sku: data.sku.toUpperCase() }) },
    { new: true, runValidators: true }
  );
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

export const listProducts = async ({ page = 1, limit = 20, search, category, lowStock }) => {
  const cappedLimit = Math.min(Math.max(limit, 1), 100);
  const skip = (Math.max(page, 1) - 1) * cappedLimit;

  const filter = {};

  if (search && search.trim()) {
    const escaped = escapeRegex(search.trim());
    filter.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { sku: { $regex: escaped, $options: 'i' } },
      { category: { $regex: escaped, $options: 'i' } },
    ];
  }

  if (category) filter.category = category;
  if (lowStock === 'true' || lowStock === true) {
    filter.$expr = { $lte: ['$quantity', '$lowStockThreshold'] };
  }

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(cappedLimit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    data: items,
    pagination: {
      page: Math.max(page, 1),
      limit: cappedLimit,
      total,
      totalPages: Math.ceil(total / cappedLimit),
    },
  };
};
