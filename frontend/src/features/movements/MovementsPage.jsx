import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovements, createMovement, clearError } from './movementsSlice';
import { fetchProducts } from '../products/productsSlice';
import PageLayout from '../../components/layout/PageLayout';
import MovementForm from '../../components/features/MovementForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';
import RequireRole from '../auth/RequireRole';

export default function MovementsPage() {
  const dispatch = useDispatch();
  const { items, pagination, loading, error } = useSelector((state) => state.movements);
  const { items: products } = useSelector((state) => state.products);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMovements({ page, limit: 20 }));
  }, [dispatch, page]);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 500 }));
  }, [dispatch]);

  const handleSubmit = async (data) => {
    const result = await dispatch(createMovement(data));
    if (!result.error) {
      setModalOpen(false);
      dispatch(fetchMovements({ page, limit: 20 }));
    }
  };

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Stock Movements</h1>
        <RequireRole roles={['admin']}>
          <Button onClick={() => { setModalOpen(true); dispatch(clearError()); }}>
            Add Movement
          </Button>
        </RequireRole>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-slate-500 text-center">
                    Loading...
                  </td>
                </tr>
              ) : items.length ? (
                items.map((m) => (
                  <tr key={m._id} className="border-b border-slate-700/50">
                    <td className="px-6 py-3 text-white">
                      {m.product?.name ?? '-'} ({m.product?.sku ?? '-'})
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={
                          m.type === 'IN' ? 'text-emerald-400' : 'text-red-400'
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
                    No movements yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-slate-700 flex justify-between items-center">
            <span className="text-slate-400 text-sm">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Stock Movement">
        <MovementForm
          products={products}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </PageLayout>
  );
}
