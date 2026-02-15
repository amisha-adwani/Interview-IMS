import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct, bulkCreateProducts, clearError } from './productsSlice';
import PageLayout from '../../components/layout/PageLayout';
import ProductForm from '../../components/features/ProductForm';
import CSVImportModal from '../../components/features/CSVImportModal';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from '../../utils/csvUtils';
import { useAuth } from '../../hooks/useAuth';
import RequireRole from '../auth/RequireRole';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();
  const { items, pagination, loading, error } = useSelector((state) => state.products);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [csvImportOpen, setCsvImportOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchProducts({
        page,
        limit: 20,
        search: search || undefined,
        category: category || undefined,
        lowStock: lowStock || undefined,
      })
    );
  }, [dispatch, page, search, category, lowStock]);

  const handleCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
    dispatch(clearError());
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setModalOpen(true);
    dispatch(clearError());
  };

  const handleSubmit = async (data) => {
    if (editingProduct) {
      const result = await dispatch(updateProduct({ id: editingProduct._id, data }));
      if (!result.error) {
        setModalOpen(false);
        setEditingProduct(null);
        dispatch(fetchProducts({ page, limit: 20, search, category, lowStock }));
      }
    } else {
      const result = await dispatch(createProduct(data));
      if (!result.error) {
        setModalOpen(false);
        dispatch(fetchProducts({ page, limit: 20, search, category, lowStock }));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await dispatch(deleteProduct(id));
    }
  };

  const handleExportCSV = () => {
    const csvData = items.map(product => ({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      lowStockThreshold: product.lowStockThreshold || 5
    }));
    
    exportToCSV(csvData, 'products');
  };

  const handleCSVImport = async (csvData) => {
    const validProducts = csvData.filter(row => 
      row.name?.trim() && row.sku?.trim() && row.category?.trim()
    );
    
    if (validProducts.length === 0) {
      alert('No valid products found in CSV');
      return;
    }
    
    const productData = validProducts.map(row => ({
      name: row.name.trim(),
      sku: row.sku.trim(),
      category: row.category.trim(),
      price: parseFloat(row.price) || 0,
      quantity: parseInt(row.quantity, 10) || 0,
      lowStockThreshold: parseInt(row.lowStockThreshold, 10) || 5
    }));
    
    const result = await dispatch(bulkCreateProducts(productData));
    
    setCsvImportOpen(false);
    
    if (result.error) {
      alert(`Import failed: ${result.error}`);
    } else {
      const { success, errors } = result.payload?.data || { success: [], errors: [] };
      alert(`Import completed! Success: ${success.length}, Errors: ${errors.length}`);
    }
    
    dispatch(fetchProducts({ page, limit: 20, search, category, lowStock }));
  };

  const isLowStock = (p) => p.quantity <= (p.lowStockThreshold ?? 5);

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <div className="flex gap-2">
          <RequireRole roles={['admin']}>
            <Button variant="secondary" onClick={handleExportCSV}>
              Export CSV
            </Button>
            <Button variant="secondary" onClick={() => setCsvImportOpen(true)}>
              Import CSV
            </Button>
            <Button onClick={handleCreate}>Add Product</Button>
          </RequireRole>
        </div>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white w-48"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white w-40"
        />
        <label className="flex items-center gap-2 text-slate-300">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(e) => setLowStock(e.target.checked)}
          />
          Low stock only
        </label>
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
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Qty</th>
                <th className="px-6 py-3">Threshold</th>
                {isAdmin && <th className="px-6 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-slate-500 text-center">
                    Loading...
                  </td>
                </tr>
              ) : items.length ? (
                items.map((p) => (
                  <tr key={p._id} className="border-b border-slate-700/50">
                    <td className="px-6 py-3 text-white">{p.name}</td>
                    <td className="px-6 py-3 text-slate-300">{p.sku}</td>
                    <td className="px-6 py-3 text-slate-300">{p.category}</td>
                    <td className="px-6 py-3 text-slate-300">{formatCurrency(p.price)}</td>
                    <td
                      className={`px-6 py-3 ${
                        isLowStock(p) ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      {p.quantity}
                    </td>
                    <td className="px-6 py-3 text-slate-400">{p.lowStockThreshold}</td>
                    {isAdmin && (
                      <td className="px-6 py-3 flex gap-2">
                        <Button variant="ghost" onClick={() => handleEdit(p)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(p._id)}>
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-slate-500 text-center">
                    No products found
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={loading}
        />
      </Modal>

      <CSVImportModal
        isOpen={csvImportOpen}
        onClose={() => setCsvImportOpen(false)}
        onImport={handleCSVImport}
        loading={loading}
      />
    </PageLayout>
  );
}
