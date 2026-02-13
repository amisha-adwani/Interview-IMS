import mongoose from 'mongoose';
import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';

const err404 = (msg = 'Product not found') => {
  const e = new Error(msg);
  e.statusCode = 404;
  return e;
};
const err400 = (msg) => {
  const e = new Error(msg);
  e.statusCode = 400;
  return e;
};

export const createMovement = async (productId, type, quantity, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await Product.findById(productId).session(session);
    if (!product) throw err404();

    if (type === 'OUT') {
      if (product.quantity < quantity) throw err400('Insufficient stock');
      product.quantity -= quantity;
    } else {
      product.quantity += quantity;
    }

    await product.save({ session });

    const movement = await StockMovement.create(
      [{ product: productId, type, quantity, createdBy: userId }],
      { session }
    );

    await session.commitTransaction();
    const populated = await StockMovement.findById(movement[0]._id)
      .populate('product', 'name sku')
      .lean();
    return populated;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const listMovements = async ({ page = 1, limit = 20, product: productId }) => {
  const cappedLimit = Math.min(Math.max(limit, 1), 100);
  const skip = (Math.max(page, 1) - 1) * cappedLimit;

  const filter = {};
  if (productId) filter.product = productId;

  const [items, total] = await Promise.all([
    StockMovement.find(filter)
      .populate('product', 'name sku')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(cappedLimit)
      .lean(),
    StockMovement.countDocuments(filter),
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
