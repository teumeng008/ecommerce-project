import { useEffect, useMemo, useState } from 'react';
import { FiEdit3, FiMinusCircle, FiPlusCircle, FiTrash2 } from 'react-icons/fi';
import { adminService } from '../services/adminService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, getProductImage } from '../utils/formatters';

const emptyProductForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
  thumbnail: '',
  isActive: true,
};

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [usersResponse, productsResponse, categoriesResponse] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllProducts(),
        categoryService.getCategories(),
      ]);

      setUsers(usersResponse.users || []);
      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.list || []);
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to load admin data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const currentUserId = currentUser?.id;
  const [activeSection, setActiveSection] = useState('users');

  const ownerCount = useMemo(() => {
   return users.filter((item) => item.role === 'OWNER').length
  },[users]);
  const adminCount = useMemo(() => users.filter((item) => item.role === 'ADMIN').length, [users]);

  const handleChangeUserRole = async (userId, role) => {
    setSaving(true);
    try {
      await adminService.updateUserRole(userId, role);
      addToast('User role updated successfully.', 'success');
      await loadAdminData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to update user role.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleActivateProduct = async (product) => {
    setSaving(true);
    try {
      await adminService.updateProduct(product.id, { isActive: !product.isActive });
      addToast(`Product ${product.isActive ? 'deactivated' : 'reactivated'} successfully.`, 'success');
      await loadAdminData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to update product status.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product permanently?')) {
      return;
    }

    setSaving(true);
    try {
      await adminService.deleteProduct(productId);
      addToast('Product deleted successfully.', 'success');
      await loadAdminData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to delete product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price || ''),
      stock: String(product.stock || ''),
      categoryId: product.category?.id ?? '',
      thumbnail: product.thumbnail || '',
      isActive: product.isActive ?? true,
    });
  };

  const resetForm = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock, 10),
        categoryId: parseInt(productForm.categoryId, 10),
        thumbnail: productForm.thumbnail || undefined,
        isActive: productForm.isActive,
      };

      if (editingProductId) {
        await adminService.updateProduct(editingProductId, payload);
        addToast('Product updated successfully.', 'success');
      } else {
        await adminService.createProduct(payload);
        addToast('Product created successfully.', 'success');
      }

      await loadAdminData();
      resetForm();
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to save product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-4xl bg-slate-900 px-8 py-8 text-white shadow-lg">
        <div className="max-w-5xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Admin dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Manage users and products</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">Promote or demote users, keep stock accurate, and control product availability from one central admin view.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-800/90 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total users</p>
              <p className="mt-3 text-3xl font-semibold">{users.length}</p>
            </div>
            <div className=' rounded-3xl bg-slate-800/90 p-6'>
              <p className=' text-xs uppercase tracking-[0.3rem] text-slate-400'>Total Owner</p>
              <p className='mt-3 text-3xl font-semibold text-orange-300'>{ownerCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-800/90 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admins</p>
              <p className="mt-3 text-3xl font-semibold ">{adminCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-800/90 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Products</p>
              <p className="mt-3 text-3xl font-semibold">{products.length}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveSection('users')}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${activeSection === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
            >
              User roles
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('products')}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${activeSection === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
            >
              Products
            </button>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        {activeSection === 'users' ? (
          <section className="space-y-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">User role management</h2>
                <p className="text-sm text-slate-500">Promote staff or reduce permissions for standard users.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Role</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {users.map((user) => {
                  const isSelf = currentUserId === user.id;
                  return (
                    <tr key={user.id}>
                      <td className="px-4 py-3 text-slate-900">{user.firstName} {user.lastName}</td>
                      <td className="px-4 py-3 text-slate-500">{user.email}</td>
                      <td className="px-4 py-3 text-slate-900">{user.role}</td>
                      <td className="px-4 py-3">
                        {user.role === 'USER' ? (
                          <button
                            onClick={() => handleChangeUserRole(user.id, 'ADMIN')}
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            <FiPlusCircle /> Promote
                          </button>
                        ) : (
                          <button
                            onClick={() => handleChangeUserRole(user.id, 'USER')}
                            disabled={saving || isSelf}
                            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            <FiMinusCircle /> Demote
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        ) : null}

        {activeSection === 'products' ? (
          <section className="space-y-6">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Product catalog</h2>
                <p className="text-sm text-slate-500">Edit stock, toggle visibility, or remove products.</p>
              </div>

            <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Product</th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Stock</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={getProductImage(product.thumbnail)} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
                          <div>
                            <p className="font-semibold text-slate-900">{product.name}</p>
                            <p className="text-xs text-slate-500">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{product.category?.name || 'Uncategorized'}</td>
                      <td className="px-4 py-3 text-slate-900">{product.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FiEdit3 /> Edit
                        </button>
                        <button
                          onClick={() => handleActivateProduct(product)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          {product.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-400"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{editingProductId ? 'Edit product' : 'Add new product'}</h2>
                <p className="text-sm text-slate-500">Maintain stock and visibility from a single form.</p>
              </div>
              {editingProductId ? (
                <button type="button" onClick={resetForm} className="text-sm font-semibold text-slate-500 hover:text-slate-900">
                  Cancel edit
                </button>
              ) : null}
            </div>

            <form onSubmit={handleProductSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={productForm.name}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Product name"
                  required
                  className="rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
                />
                <select
                  value={productForm.categoryId}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                  className="rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <textarea
                value={productForm.description}
                onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Product description"
                rows={4}
                required
                className="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.price}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))}
                  placeholder="Price"
                  required
                  className="rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
                />
                <input
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, stock: event.target.value }))}
                  placeholder="Stock"
                  required
                  className="rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
                />
                <input
                  value={productForm.thumbnail}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, thumbnail: event.target.value }))}
                  placeholder="Thumbnail URL"
                  className="rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={productForm.isActive}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900"
                  />
                  Active product
                </label>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {editingProductId ? 'Save changes' : 'Create product'}
                </button>
              </div>
            </form>
          </div>
        </section>
        ) : null}
      </div>
    </div>
  );
}
