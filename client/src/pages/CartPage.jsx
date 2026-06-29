import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, loading, removeItem, updateItem, clearCart } = useCart();

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + Number(item.product?.price || 0) * Number(item.quantity || 0), 0);
    return { subtotal };
  }, [cartItems]);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" /></div>;
  }

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">Your cart is waiting</h1>
        <p className="mt-3 text-slate-500">Sign in to view and manage your selected items.</p>
        <Link to="/login" className="mt-6 inline-flex rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">Sign in</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-3 text-slate-500">Choose a few favorites and come back here anytime.</p>
        <Link to="/" className="mt-6 inline-flex rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <div className="h-24 w-full rounded-2xl bg-slate-100 sm:w-24" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">{item.product?.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{formatCurrency(item.product?.price || 0)}</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <button onClick={() => updateItem(item.productId, Math.max(1, item.quantity - 1))} className="h-8 w-8 rounded-full text-xl">−</button>
              <span className="min-w-8 text-center text-lg font-semibold">{item.quantity}</span>
              <button onClick={() => updateItem(item.productId, item.quantity + 1)} className="h-8 w-8 rounded-full text-xl">+</button>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">{formatCurrency(Number(item.product?.price || 0) * Number(item.quantity || 0))}</p>
              <button onClick={() => removeItem(item.productId)} className="mt-2 text-sm font-semibold text-rose-500">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">{formatCurrency(totals.subtotal)}</span>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button onClick={() => navigate('/checkout')} className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">Checkout</button>
          <button onClick={() => clearCart()} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700">Clear cart</button>
          <Link to="/" className="rounded-2xl border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
