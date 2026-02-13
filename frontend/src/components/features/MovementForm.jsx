import { useState } from 'react';
import Button from '../common/Button';

export default function MovementForm({ products, onSubmit, onCancel, loading }) {
  const [productId, setProductId] = useState('');
  const [type, setType] = useState('IN');
  const [quantity, setQuantity] = useState('1');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      productId,
      type,
      quantity: parseInt(quantity, 10) || 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Product</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        >
          <option value="">Select product</option>
          {products?.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.sku}) - Qty: {p.quantity}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        >
          <option value="IN">Stock IN</option>
          <option value="OUT">Stock OUT</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Movement'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
