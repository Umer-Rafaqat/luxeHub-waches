import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, count } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.aside
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className={styles.header}>
              <div className={styles.title}>
                <ShoppingBag size={18} strokeWidth={1.5} />
                <span>Cart ({count})</span>
              </div>
              <button className={styles.close} onClick={() => setIsOpen(false)}>
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className={styles.items}>
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    className={styles.empty}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ShoppingBag size={48} strokeWidth={0.8} />
                    <p>Your cart is empty</p>
                    <Link to="/products" onClick={() => setIsOpen(false)} className={styles.shopBtn}>
                      Explore Collection
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item._id}-${item.selectedColor}`}
                      className={styles.item}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      layout
                    >
                      <img src={item.thumbnail} alt={item.name} className={styles.itemImg} />
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemColor}>{item.selectedColor}</p>
                        <p className={styles.itemPrice}>PKR {item.price.toLocaleString()}</p>
                        <div className={styles.qty}>
                          <button onClick={() => updateQuantity(item._id, item.selectedColor, item.quantity - 1)}>
                            <Minus size={12} />
                          </button>
                          <motion.span key={item.quantity} initial={{ scale: 1.3 }} animate={{ scale: 1 }}>
                            {item.quantity}
                          </motion.span>
                          <button onClick={() => updateQuantity(item._id, item.selectedColor, item.quantity + 1)}>
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button className={styles.remove} onClick={() => removeItem(item._id, item.selectedColor)}>
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotal}>
                  <span>Subtotal</span>
                  <motion.span key={total} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                    PKR {total.toLocaleString()}
                  </motion.span>
                </div>
                <Link to="/checkout" onClick={() => setIsOpen(false)} className={styles.checkoutBtn}>
                  Checkout <ArrowRight size={16} />
                </Link>
                <Link to="/cart" onClick={() => setIsOpen(false)} className={styles.viewCart}>
                  View Cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
