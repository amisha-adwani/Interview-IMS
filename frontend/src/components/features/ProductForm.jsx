import { useState, useEffect } from 'react';
import Button from '../common/Button';

const initial = {
  name: '',
  sku: '',
  category: '',
  price: '',
  quantity: '0',
  lowStockThreshold: '5',
};

export default function ProductForm({ product, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        quantity: product.quantity?.toString() || '0',
        lowStockThreshold: product.lowStockThreshold?.toString() || '5',
      });
    } else {
      setForm(initial);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      price: parseFloat(form.price) || 0,
      quantity: parseInt(form.quantity, 10) || 0,
      lowStockThreshold: parseInt(form.lowStockThreshold, 10) || 5,
    });
  };

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">SKU</label>
        <input
          type="text"
          value={form.sku}
          onChange={(e) => update('sku', e.target.value.toUpperCase())}
          required
          disabled={!!product}
          className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white disabled:opacity-60"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
        <input
          type="text"
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Price</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) => update('price', e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Quantity</label>
        <input
          type="number"
          min="0"
          value={form.quantity}
          onChange={(e) => update('quantity', e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Low Stock Threshold</label>
        <input
          type="number"
          min="0"
          value={form.lowStockThreshold}
          onChange={(e) => update('lowStockThreshold', e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : product ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
