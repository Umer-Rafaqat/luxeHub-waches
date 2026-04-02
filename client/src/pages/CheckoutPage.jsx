import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, X, UserPlus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../hooks/useApi';
import toast from 'react-hot-toast';
import styles from './CheckoutPage.module.css';

const STEPS = ['Shipping', 'Payment', 'Confirm'];

const PAYMENT_METHODS = [
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'cod', label: 'Cash on Delivery' },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [payment, setPayment] = useState('card');
  const [loading, setLoading] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  // Guest checkout state
  const [checkoutMode, setCheckoutMode] = useState(null); // 'guest' | 'account'
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' });

  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Derived — must be before effects that use it
  const requiresAuthChoice = !user && !checkoutMode;

  // Always scroll to top on mount and on step change
  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  // Lock body scroll when auth modal is open
  useEffect(() => {
    document.body.style.overflow = requiresAuthChoice ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [requiresAuthChoice]);

  // When user clicks "Proceed to Checkout" from cart, we intercept here
  // If not logged in and no mode chosen, show the modal

  const handleOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ product: i._id, name: i.name, image: i.thumbnail, price: i.price, quantity: i.quantity })),
        shippingAddress: shipping,
        paymentMethod: payment,
        totalPrice: total,
      };

      const headers = {};
      if (user) {
        headers.Authorization = `Bearer ${user.token}`;
      } else {
        payload.guestInfo = guestInfo;
      }

      await api.post('/orders', payload, { headers });
      clearCart();
      setOrderDone(true);
    } catch {
      toast.error('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderDone) return (
    <main className={styles.page}>
      <motion.div
        className={styles.success}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className={styles.successIcon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <Check size={32} strokeWidth={2} />
        </motion.div>
        <h1>Order Confirmed</h1>
        <p>Thank you for your purchase. Your timepiece will be delivered in premium packaging.</p>
        {!user && (
          <p className={styles.guestRegisterNote}>
            Want to track your order and get new collection updates?{' '}
            <Link to={`/register?redirect=/profile&email=${encodeURIComponent(guestInfo.email)}`}>Create a free account</Link>
          </p>
        )}
        <button className={styles.homeBtn} onClick={() => navigate('/')}>Return Home</button>
      </motion.div>
    </main>
  );

  return (
    <main className={styles.page}>
      {/* Auth choice modal for non-logged-in users */}
      <AnimatePresence>
        {requiresAuthChoice && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.modalHeader}>
                <h2>How would you like to continue?</h2>
                <button className={styles.modalClose} onClick={() => navigate('/cart')} aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className={styles.modalOptions}>
                <button
                  className={styles.modalOption}
                  onClick={() => setCheckoutMode('guest')}
                >
                  <div className={styles.modalOptionIcon}>
                    <ShoppingBag size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <strong>Guest Checkout</strong>
                    <p>Buy without creating an account. Quick and easy.</p>
                  </div>
                </button>

                <div className={styles.modalDivider}><span>or</span></div>

                <button
                  className={`${styles.modalOption} ${styles.modalOptionGold}`}
                  onClick={() => navigate('/register?redirect=/checkout')}
                >
                  <div className={styles.modalOptionIcon}>
                    <UserPlus size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <strong>Create an Account</strong>
                    <p>Get updates on new collections, exclusive offers, and track your orders.</p>
                  </div>
                </button>

                <p className={styles.modalLoginNote}>
                  Already have an account? <Link to="/login?redirect=/checkout">Sign in</Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container">
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s} className={`${styles.step} ${i <= step ? styles.stepActive : ''}`}>
              <div className={styles.stepNum}>{i < step ? <Check size={14} /> : i + 1}</div>
              <span>{s}</span>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.stepLineDone : ''}`} />}
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          <div className={styles.formArea}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="shipping" className={styles.formCard} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2>Shipping Address</h2>

                  {/* Guest info fields */}
                  {!user && checkoutMode === 'guest' && (
                    <div className={styles.guestSection}>
                      <div className={styles.field}>
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={guestInfo.name}
                          onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className={styles.field}>
                        <label>Email</label>
                        <input
                          type="email"
                          value={guestInfo.email}
                          onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                          placeholder="For order confirmation"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {['address', 'city', 'postalCode', 'country'].map((field) => (
                    <div key={field} className={styles.field}>
                      <label>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <input
                        type="text"
                        value={shipping[field]}
                        onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                        required
                      />
                    </div>
                  ))}

                  <button
                    className={styles.nextBtn}
                    onClick={() => setStep(1)}
                    disabled={
                      !Object.values(shipping).every(Boolean) ||
                      (!user && checkoutMode === 'guest' && (!guestInfo.name || !guestInfo.email))
                    }
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="payment" className={styles.formCard} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2>Payment Method</h2>
                  {PAYMENT_METHODS.map((m) => (
                    <label key={m.value} className={`${styles.payOption} ${payment === m.value ? styles.payActive : ''}`}>
                      <input type="radio" name="payment" value={m.value} checked={payment === m.value} onChange={() => setPayment(m.value)} />
                      <span>{m.label}</span>
                      {m.value === 'cod' && <span className={styles.codBadge}>No card needed</span>}
                    </label>
                  ))}
                  <div className={styles.secureNote}>
                    <Lock size={12} /> Secured with 256-bit SSL encryption
                  </div>
                  <div className={styles.btnRow}>
                    <button className={styles.backBtn} onClick={() => setStep(0)}>Back</button>
                    <button className={styles.nextBtn} onClick={() => setStep(2)}>Review Order</button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="confirm" className={styles.formCard} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2>Review Order</h2>
                  {!user && guestInfo.name && (
                    <div className={styles.reviewSection}>
                      <h4>Guest</h4>
                      <p>{guestInfo.name} — {guestInfo.email}</p>
                    </div>
                  )}
                  <div className={styles.reviewSection}>
                    <h4>Shipping to</h4>
                    <p>{shipping.address}, {shipping.city}, {shipping.postalCode}, {shipping.country}</p>
                  </div>
                  <div className={styles.reviewSection}>
                    <h4>Payment</h4>
                    <p>{PAYMENT_METHODS.find(m => m.value === payment)?.label}</p>
                    {payment === 'cod' && (
                      <p className={styles.codNote}>You will pay in cash when your order is delivered.</p>
                    )}
                  </div>
                  <div className={styles.btnRow}>
                    <button className={styles.backBtn} onClick={() => setStep(1)}>Back</button>
                    <button className={styles.placeBtn} onClick={handleOrder} disabled={loading}>
                      {loading ? <span className={styles.spinner} /> : 'Place Order'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            {items.map((item) => (
              <div key={`${item._id}-${item.selectedColor}`} className={styles.orderItem}>
                <img src={item.thumbnail} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p className={styles.orderItemSub}>{item.selectedColor} × {item.quantity}</p>
                </div>
                <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className={styles.orderTotal}>
              <span>Total</span>
              <span>PKR {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
