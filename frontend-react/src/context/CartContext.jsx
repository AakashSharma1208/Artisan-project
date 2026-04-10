import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const getCartKey = (userId) => userId ? `cart_${userId}` : 'cart_guest';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  const userId = user?.id || user?._id || 'guest';

  // Load cart when userId changes
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(getCartKey(userId))) || [];
      setCart(stored);
    } catch {
      setCart([]);
    }
  }, [userId]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(getCartKey(userId), JSON.stringify(cart));
  }, [cart, userId]);

  const addToCart = (item) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx > -1) {
        const u = [...prev];
        u[idx].quantity += item.quantity;
        return u;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(getCartKey(userId));
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
