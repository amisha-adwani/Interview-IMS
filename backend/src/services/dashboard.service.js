import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';

export const getDashboardStats = async () => {
  const [totalProducts, lowStockProducts, recentMovements] = await Promise.all([
    Product.countDocuments(),
    Product.find({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] } })
      .select('name sku quantity lowStockThreshold category')
      .limit(10)
      .lean(),
    StockMovement.find()
      .populate('product', 'name sku')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  return {
    totalProducts,
    lowStockProducts,
    recentMovements,
  };
};
