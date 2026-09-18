import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';



export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === '/register';
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register(form);
        navigate('/login');
      } else {
        await login(form);
        navigate('/');
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Authentication failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-2 py-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{isRegister ? 'Create an account' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm text-slate-500">{isRegister ? 'Join ShopSphere for a faster checkout.' : 'Sign in to continue your shopping.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-slate-900" required />
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-slate-900" required />
            </div>
          ) : null}

          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-slate-900" required />
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-slate-900" required />

          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link to={isRegister ? '/login' : '/register'} className="font-semibold text-slate-900">
            {isRegister ? 'Sign in' : 'Create one'}
          </Link>
        </p>
      </div>
    </div>
  );
}
