import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from './dashboardSlice';
import PageLayout from '../../components/layout/PageLayout';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { totalProducts, lowStockProducts, recentMovements, loading } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <PageLayout>
        <div className="text-slate-400">Loading...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-white mt-1">{totalProducts}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm">Low Stock Items</p>
          <p className="text-3xl font-bold text-amber-400 mt-1">{lowStockProducts?.length ?? 0}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Low Stock Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">Qty</th>
                  <th className="px-6 py-3">Threshold</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts?.length ? (
                  lowStockProducts.map((p) => (
                    <tr key={p._id} className="border-b border-slate-700/50">
                      <td className="px-6 py-3 text-white">
                        <Link to={`/products/${p._id}`} className="hover:text-primary-400">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-slate-300">{p.sku}</td>
                      <td className="px-6 py-3 text-amber-400">{p.quantity}</td>
                      <td className="px-6 py-3 text-slate-400">{p.lowStockThreshold}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-slate-500 text-center">
                      No low stock products
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Recent Movements</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Qty</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentMovements?.length ? (
                  recentMovements.map((m) => (
                    <tr key={m._id} className="border-b border-slate-700/50">
                      <td className="px-6 py-3 text-white">
                        {m.product?.name ?? '-'} ({m.product?.sku ?? '-'})
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={
                            m.type === 'IN'
                              ? 'text-emerald-400'
                              : 'text-red-400'
                          }
                        >
                          {m.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-300">{m.quantity}</td>
                      <td className="px-6 py-3 text-slate-400 text-sm">
                        {formatDate(m.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-slate-500 text-center">
                      No recent movements
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
