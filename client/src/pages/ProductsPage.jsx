import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { useCart } from '../hooks/useCart';
import { formatCurrency, getProductImage } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
        ]);

        const loadedProducts = productResponse.data || [];
        const loadedCategories = categoryResponse.list || [];

        setProducts(loadedProducts);
        setCategories(loadedCategories);
        setSelectedCategoryId((current) => current ?? loadedCategories[0]?.id ?? null);
      } catch (error) {
        addToast(error.response?.data?.message || 'Unable to load products.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [addToast]);

  const handleAddToCart = async (product) => {
    if (product.stock <= 0) {
      addToast('This product is out of stock.', 'error');
      return;
    }
    await addItem(product.id, 1);
  };

  const visibleProducts = selectedCategoryId
    ? products.filter((product) => product.category?.id === selectedCategoryId)
    : products;

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" /></div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-4xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-lg">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Fresh arrivals</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Curated essentials for everyday living.</h1>
          <p className="text-base text-slate-300">Browse premium products, add them to your cart, and complete your order in seconds.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedCategoryId === null ? 'bg-slate-900 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            All products
          </button>
          {categories.map((category) => {
            const isActive = selectedCategoryId === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-900 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        {visibleProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            No products are available for this category right now.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <img src={getProductImage(product.thumbnail)} alt={product.name} className="h-56 w-full object-cover" />
                <div className="space-y-4 p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                      <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
                    <p className="text-sm text-slate-500">{product.description?.slice(0, 110)}...</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold text-slate-900">{formatCurrency(product.price)}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => handleAddToCart(product)} disabled={product.stock <= 0} className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300">
                      Add to cart
                    </button>
                    <Link to={`/products/${product.id}`} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
