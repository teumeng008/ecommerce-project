import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu, FiShoppingCart, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Layout() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
              S
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">ShopSphere</p>
              <p className="text-xs text-slate-500">Modern essentials</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navLinkClass}>Products</NavLink>
            <NavLink to="/cart" className={navLinkClass}>Cart</NavLink>
            {user ? (
              <>
                <NavLink to="/orders" className={navLinkClass}>My Orders</NavLink>
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                {user.role === 'ADMIN' || user.role === "OWNER" ? (
                  <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                ) : null}
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 sm:flex"
              >
                <FiLogOut /> Logout
              </button>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  Login
                </Link>
                <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm">
                  Register
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-full border border-slate-200 bg-white p-3 text-slate-700 shadow-sm md:hidden"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>

            <Link to="/cart" className="relative rounded-full border border-slate-200 bg-white p-3 text-slate-700 shadow-sm">
              <FiShoppingCart className="text-lg" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Products</NavLink>
              <NavLink to="/cart" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Cart</NavLink>
              {user ? (
                <>
                  <NavLink to="/orders" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>My Orders</NavLink>
                  <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Profile</NavLink>
                  {user.role === 'ADMIN' || user.role === 'OWNER' ? (
                    <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Admin</NavLink>
                  ) : null}
                  <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="flex items-center gap-2 rounded-full px-4 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white shadow-sm">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
