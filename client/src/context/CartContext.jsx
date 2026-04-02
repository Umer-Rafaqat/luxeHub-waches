import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('luxehub_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('luxehub_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1, color = null) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id && i.selectedColor === color);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id && i.selectedColor === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...product, quantity, selectedColor: color || product.colors?.[0] }];
    });
    setIsOpen(true);
  };

  const removeItem = (id, color) => {
    setItems((prev) => prev.filter((i) => !(i._id === id && i.selectedColor === color)));
  };

  const updateQuantity = (id, color, quantity) => {
    if (quantity < 1) return removeItem(id, color);
    setItems((prev) =>
      prev.map((i) => (i._id === id && i.selectedColor === color ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
