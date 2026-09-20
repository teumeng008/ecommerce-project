import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cartService } from '../services/cartService.js';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const response = await cartService.getCart();
      setCartItems(response.cart || []);
    } catch (error) {
      addToast(error.response?.data?.message || 'Could not load your cart.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId, quantity = 1) => {
    try {
      await cartService.addItem(productId, quantity);
      await fetchCart();
      addToast('Added to cart.', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to add item.', 'error');
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      await cartService.updateItem(productId, quantity);
      await fetchCart();
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to update item.', 'error');
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartService.removeItem(productId);
      await fetchCart();
      addToast('Removed from cart.', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to remove item.', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await fetchCart();
      addToast('Cart cleared.', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to clear cart.', 'error');
    }
  };

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + (item.quantity || 0), 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      loading,
      fetchCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      itemCount,
    }),
    [cartItems, loading, fetchCart, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }

  return context;
}
