import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await orderService.getOrders();
        setOrders((response.orders || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        addToast(error.response?.data?.message || 'Unable to load orders.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [addToast]);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">No orders yet</h1>
        <p className="mt-3 text-slate-500">Your order history will appear here after checkout.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Order #{order.id}</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">{formatDate(order.createdAt)}</h2>
              <p className="mt-2 text-sm text-slate-500">Status: <span className="font-semibold text-slate-900">{order.status}</span></p>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-sm text-slate-500">Total paid</p>
              <p className="text-2xl font-semibold text-slate-900">{formatCurrency(order.totalPrice)}</p>
              <Link to={`/orders/${order.id}`} className="mt-4 inline-flex rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">View details</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
