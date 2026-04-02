import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Search, ChevronDown, ChevronUp, MapPin, Package } from 'lucide-react';
import { api } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';
import orderStyles from './AdminOrders.module.css';

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const headers = { Authorization: `Bearer ${user?.token}` };

  const load = () => {
    setLoading(true);
    api.get('/admin/orders', { headers })
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markDelivered = async (id) => {
    try {
      await api.put(`/admin/orders/${id}/deliver`, {}, { headers });
      toast.success('Marked as delivered');
      load();
    } catch {
      toast.error('Failed to update');
    }
  };

  const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id);

  // Get customer name/email from either registered user or guest
  const getCustomer = (order) => ({
    name: order.user?.name || order.guestInfo?.name || 'Guest',
    email: order.user?.email || order.guestInfo?.email || '—',
    isGuest: !order.user,
  });

  const filtered = orders.filter(o => {
    const c = getCustomer(o);
    const q = search.toLowerCase();
    return (
      o._id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Orders</h1>
          <p className={styles.sub}>{orders.length} total orders</p>
        </div>
        <div className={styles.searchWrap}>
          <Search size={14} />
          <input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className={styles.tableWrap}>
        {/* Header */}
        <div className={orderStyles.head}>
          <span>Order ID</span>
          <span>Customer</span>
          <span>Shipping Address</span>
          <span>Total</span>
          <span>Payment</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {loading ? (
          Array(6).fill(0).map((_, i) => <div key={i} className={styles.skeletonRow} />)
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>No orders found</p>
        ) : (
          filtered.map((order, i) => {
            const customer = getCustomer(order);
            const addr = order.shippingAddress;
            const isOpen = expanded === order._id;

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                {/* Main row */}
                <div className={orderStyles.row}>
                  <div>
                    <p className={orderStyles.orderId}>#{order._id.slice(-8).toUpperCase()}</p>
                    <p className={orderStyles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className={orderStyles.customerName}>{customer.name}</p>
                    <p className={orderStyles.customerEmail}>{customer.email}</p>
                    {customer.isGuest && <span className={orderStyles.guestBadge}>Guest</span>}
                  </div>

                  <div className={orderStyles.address}>
                    {addr?.address ? (
                      <>
                        <MapPin size={11} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                        <span>{addr.address}, {addr.city}, {addr.postalCode}, {addr.country}</span>
                      </>
                    ) : (
                      <span style={{ color: 'var(--gray)' }}>—</span>
                    )}
                  </div>

                  <span className={orderStyles.total}>PKR {order.totalPrice?.toLocaleString()}</span>

                  <span className={order.isPaid ? styles.yes : styles.no}>
                    {order.isPaid ? 'Paid' : order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Pending'}
                  </span>

                  <span className={order.isDelivered ? styles.badgeDelivered : styles.badgeProcessing}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>

                  <div className={orderStyles.rowActions}>
                    {!order.isDelivered && (
                      <button className={styles.deliverBtn} onClick={() => markDelivered(order._id)}>
                        <Check size={12} /> Deliver
                      </button>
                    )}
                    <button className={orderStyles.expandBtn} onClick={() => toggleExpand(order._id)} title="View items">
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Expanded items */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className={orderStyles.expandedPanel}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className={orderStyles.expandedInner}>
                        <div className={orderStyles.expandedHeader}>
                          <Package size={13} />
                          <span>Items Ordered</span>
                        </div>
                        {order.items?.map((item, j) => (
                          <div key={j} className={orderStyles.itemRow}>
                            <img src={item.image} alt={item.name} className={orderStyles.itemImg} />
                            <span className={orderStyles.itemName}>{item.name}</span>
                            <span className={orderStyles.itemQty}>× {item.quantity}</span>
                            <span className={orderStyles.itemPrice}>PKR {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className={orderStyles.itemsTotal}>
                          <span>Order Total</span>
                          <span>PKR {order.totalPrice?.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
