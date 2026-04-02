import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, Clock } from 'lucide-react';
import { api } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminDashboard.module.css';

function StatCard({ icon: Icon, label, value, color, index }) {
  return (
    <motion.div
      className={styles.statCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className={styles.statIcon} style={{ background: color + '18', color }}>
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats', { headers: { Authorization: `Bearer ${user?.token}` } })
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.sub}>Welcome back, {user?.name}</p>
      </div>

      {loading ? (
        <div className={styles.skeletonGrid}>
          {Array(4).fill(0).map((_, i) => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <StatCard icon={DollarSign} label="Total Revenue" value={`PKR ${stats?.revenue?.toLocaleString()}`} color="#c9a84c" index={0} />
            <StatCard icon={ShoppingCart} label="Total Orders" value={stats?.totalOrders} color="#60a5fa" index={1} />
            <StatCard icon={Package} label="Products" value={stats?.totalProducts} color="#a78bfa" index={2} />
            <StatCard icon={Users} label="Customers" value={stats?.totalUsers} color="#34d399" index={3} />
          </div>

          <motion.div
            className={styles.recentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.sectionHead}>
              <Clock size={16} strokeWidth={1.5} />
              <h2>Recent Orders</h2>
            </div>
            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span>Order ID</span>
                <span>Customer</span>
                <span>Total</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {stats?.recentOrders?.length === 0 && (
                <p className={styles.empty}>No orders yet</p>
              )}
              {stats?.recentOrders?.map((order) => (
                <div key={order._id} className={styles.tableRow}>
                  <span className={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                  <span>{order.user?.name || 'Guest'}</span>
                  <span className={styles.amount}>PKR {order.totalPrice?.toLocaleString()}</span>
                  <span className={`${styles.badge} ${order.isDelivered ? styles.delivered : styles.processing}`}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                  <span className={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
