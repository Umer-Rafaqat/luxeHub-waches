import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  return (
    <main className={styles.page}>
      <div className="container">
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Shopping Cart
        </motion.h1>

        {items.length === 0 ? (
          <motion.div className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ShoppingBag size={64} strokeWidth={0.8} />
            <h2>Your cart is empty</h2>
            <p>Discover our collection of exceptional timepieces</p>
            <Link to="/products" className={styles.shopBtn}>Explore Collection</Link>
          </motion.div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.items}>
              <div className={styles.itemsHeader}>
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={`${item._id}-${item.selectedColor}`}
                    className={styles.item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    layout
                  >
                    <div className={styles.itemProduct}>
                      <img src={item.thumbnail} alt={item.name} />
                      <div>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemColor}>{item.selectedColor}</p>
                        <button className={styles.removeBtn} onClick={() => removeItem(item._id, item.selectedColor)}>
                          <X size={12} /> Remove
                        </button>
                      </div>
                    </div>
                    <span className={styles.itemPrice}>PKR {item.price.toLocaleString()}</span>
                    <div className={styles.qty}>
                      <button onClick={() => updateQuantity(item._id, item.selectedColor, item.quantity - 1)}><Minus size={12} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.selectedColor, item.quantity + 1)}><Plus size={12} /></button>
                    </div>
                    <span className={styles.itemTotal}>PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>PKR {total.toLocaleString()}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span className={styles.free}>Free</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <motion.span key={total} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  PKR {total.toLocaleString()}
                </motion.span>
              </div>
              <Link to="/checkout" className={styles.checkoutBtn}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <Link to="/products" className={styles.continueBtn}>Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
