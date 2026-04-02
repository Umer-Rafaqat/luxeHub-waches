import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, LogOut, Edit2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../hooks/useApi';
import toast from 'react-hot-toast';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/mine', { headers: { Authorization: `Bearer ${user.token}` } })
      .then((res) => setOrders(res.data))
      .catch(() => {});
  }, [user]);

  const handleSave = async () => {
    try {
      await api.put('/auth/profile', form, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success('Profile updated');
      setEditing(false);
    } catch {
      toast.error('Update failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  if (!user) return null;

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.avatar}>
              <span>{user.name?.charAt(0).toUpperCase()}</span>
            </div>
            <p className={styles.userName}>{user.name}</p>
            <p className={styles.userEmail}>{user.email}</p>

            <nav className={styles.nav}>
              <button className={`${styles.navItem} ${tab === 'profile' ? styles.navActive : ''}`} onClick={() => setTab('profile')}>
                <User size={16} strokeWidth={1.5} /> Profile
              </button>
              <button className={`${styles.navItem} ${tab === 'orders' ? styles.navActive : ''}`} onClick={() => setTab('orders')}>
                <Package size={16} strokeWidth={1.5} /> Orders
              </button>
              <button className={styles.navItem} onClick={handleLogout}>
                <LogOut size={16} strokeWidth={1.5} /> Logout
              </button>
            </nav>
          </aside>

          <div className={styles.content}>
            <AnimatePresence mode="wait">
              {tab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className={styles.contentHeader}>
                    <h2>Profile Details</h2>
                    <button className={styles.editBtn} onClick={() => setEditing(!editing)}>
                      {editing ? <Check size={16} /> : <Edit2 size={16} />}
                      {editing ? 'Save' : 'Edit'}
                    </button>
                  </div>

                  <div className={styles.fields}>
                    <div className={styles.field}>
                      <label>Full Name</label>
                      {editing ? (
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      ) : (
                        <p>{user.name}</p>
                      )}
                    </div>
                    <div className={styles.field}>
                      <label>Email</label>
                      {editing ? (
                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      ) : (
                        <p>{user.email}</p>
                      )}
                    </div>
                    <div className={styles.field}>
                      <label>Member Since</label>
                      <p>2026</p>
                    </div>
                  </div>

                  {editing && (
                    <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
                  )}
                </motion.div>
              )}

              {tab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className={styles.contentTitle}>Order History</h2>
                  {orders.length === 0 ? (
                    <div className={styles.noOrders}>
                      <Package size={48} strokeWidth={0.8} />
                      <p>No orders yet</p>
                    </div>
                  ) : (
                    <div className={styles.ordersList}>
                      {orders.map((order, i) => (
                        <motion.div
                          key={order._id}
                          className={styles.orderCard}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <div className={styles.orderHeader}>
                            <span className={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                            <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className={`${styles.orderStatus} ${order.isDelivered ? styles.delivered : styles.processing}`}>
                              {order.isDelivered ? 'Delivered' : 'Processing'}
                            </span>
                          </div>
                          <div className={styles.orderItems}>
                            {order.items.map((item, j) => (
                              <div key={j} className={styles.orderItem}>
                                <img src={item.image} alt={item.name} />
                                <span>{item.name} × {item.quantity}</span>
                                <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div className={styles.orderFooter}>
                            <span>Total: <strong>PKR {order.totalPrice?.toLocaleString()}</strong></span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
