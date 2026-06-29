import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { addToast } = useToast();
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + Number(item.product?.price || 0) * Number(item.quantity || 0), 0);
    return { subtotal };
  }, [cartItems]);

  const handleCheckout = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await orderService.checkout({ shippingAddress, phone });
      await clearCart();
      addToast('Order placed successfully.', 'success');
      navigate('/orders');
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to place order.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
        <form onSubmit={handleCheckout} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Shipping address</label>
            <textarea value={shippingAddress} onChange={(event) => setShippingAddress(event.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Phone number</label>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" required />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Placing order...' : 'Place order'}
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
        <div className="mt-6 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm text-slate-600">
              <span>{item.product?.name} × {item.quantity}</span>
              <span className="font-semibold text-slate-900">{formatCurrency(Number(item.product?.price || 0) * Number(item.quantity || 0))}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
          Total {formatCurrency(totals.subtotal)}
        </div>
      </div>
    </div>
  );
}
