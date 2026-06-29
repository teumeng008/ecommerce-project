import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { productService } from '../services/productService';
import { formatCurrency, getProductImage } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data);
      } catch (error) {
        addToast(error.response?.data?.message || 'Unable to load product.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [addToast, id]);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" /></div>;
  }

  if (!product) {
    return <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">Product not found.</div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <img src={getProductImage(product.thumbnail)} alt={product.name} className="h-112 w-full rounded-4xl object-cover shadow-lg" />
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{product.category?.name || 'Uncategorized'}</span>
          <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">{product.name}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{product.description}</p>
        <div className="mt-8 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Price</p>
            <p className="text-3xl font-semibold text-slate-900">{formatCurrency(product.price)}</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-8 w-8 rounded-full text-xl">−</button>
            <span className="min-w-8 text-center text-lg font-semibold">{quantity}</span>
            <button onClick={() => setQuantity((value) => value + 1)} className="h-8 w-8 rounded-full text-xl">+</button>
          </div>
        </div>
        <button onClick={() => addItem(product.id, quantity)} disabled={product.stock <= 0} className="mt-8 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300">
          Add to cart
        </button>
      </div>
    </div>
  );
}
