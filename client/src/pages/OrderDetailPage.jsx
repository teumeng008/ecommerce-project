import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../services/orderService";
import { productService } from "../services/productService";
import { formatCurrency, formatDate } from "../utils/formatters";
import { useToast } from "../context/ToastContext";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState([]);      // Stores the array of purchased items
  const [products, setProducts] = useState({}); // Stores product data as a lookup map: { id: data }

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);

        // 1. Fetch the order details first
        const orderResponse = await orderService.getOrderById(id);
        const orderItems = orderResponse.order || [];
        setOrder(orderItems);

        // 2. Map through items to create a list of product fetch requests
        const productPromises = orderItems.map(async (item) => {
          try {
            const prodResponse = await productService.getProductById(item.productId);
            const productData = prodResponse?.data ?? prodResponse?.product ?? null;

            // Return an object containing both the ID and the raw product data
            return { id: item.productId, data: productData };
          } catch {
            return { id: item.productId, data: null }; // Fallback if a single product fails
          }
        });

        // 3. Fire all product API requests at the exact same time (in parallel)
        const fetchedProducts = await Promise.all(productPromises);

        // 4. Convert the array of products into an easy lookup dictionary object
        // Example output: { "prod_123": { name: "Shoes" }, "prod_456": { name: "Hat" } }
        const productsMap = fetchedProducts.reduce((accumulator, currentItem) => {
          if (currentItem.data) {
            accumulator[currentItem.id] = currentItem.data;
          }
          return accumulator;
        }, {});

        // 5. Save that lookup map to your state
        setProducts(productsMap);

      } catch (error) {
        addToast(error.response?.data?.message || "Unable to load details.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadAllData();
  }, [id, addToast]);

  // Calculate the grand total of the order dynamically
  const orderTotal = order.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  if (!order || order.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        Order not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Order summary</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Order #{id}</h1>
            <p className="mt-2 text-sm text-slate-500">Placed on {formatDate(new Date())}</p>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-sm text-slate-500">Status</p>
            <p className="text-xl font-semibold text-slate-900">PAID</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Shipping details */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Shipping details</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-900">Address:</span> 123 Market Street</p>
            <p><span className="font-semibold text-slate-900">Phone:</span> +1 555 123 4567</p>
            <p><span className="font-semibold text-slate-900">Total:</span> {formatCurrency(orderTotal)}</p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Purchased items</h2>
          <div className="mt-4 space-y-3">
            {order.map((item) => {
              
              // POINT OF INTEREST: We use the item's productId to pull 
              // the matching product details instantly from our lookup object state.
              const currentProduct = products[item.productId];

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {/* POINT OF INTEREST: If the product loaded successfully, show its name. 
                          If it hasn't loaded yet or failed, safely fall back to showing the raw item.productId */}
                      {currentProduct ? currentProduct.name : item.productId}
                    </p>
                    <p className="text-sm text-slate-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="text-sm text-slate-500">
                      Subtotal {formatCurrency(Number(item.price) * Number(item.quantity))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}