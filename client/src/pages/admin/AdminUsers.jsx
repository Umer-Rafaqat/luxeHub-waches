import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Search, X } from 'lucide-react';
import { api } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const headers = { Authorization: `Bearer ${user?.token}` };

  const load = () => {
    setLoading(true);
    api.get('/admin/users', { headers })
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`, { headers });
      toast.success('User deleted');
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.sub}>{users.length} registered users</p>
        </div>
        <div className={styles.searchWrap}>
          <Search size={14} />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className={styles.tableWrap}>
        <div className={`${styles.tableHead} ${styles.usersHead}`}>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Joined</span>
          <span>Actions</span>
        </div>

        {loading ? (
          Array(5).fill(0).map((_, i) => <div key={i} className={styles.skeletonRow} />)
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>No users found</p>
        ) : (
          filtered.map((u, i) => (
            <motion.div
              key={u._id}
              className={`${styles.tableRow} ${styles.usersRow}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: u.isAdmin ? 'var(--gold)' : 'var(--dark-3)',
                  color: u.isAdmin ? 'var(--black)' : 'var(--gray)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: 'var(--white)', fontWeight: 500 }}>{u.name}</span>
              </div>
              <span style={{ color: 'var(--gray-light)', fontSize: '0.82rem' }}>{u.email}</span>
              <span className={u.isAdmin ? styles.badgeAdmin : styles.badgeUser}>
                {u.isAdmin ? 'Admin' : 'Customer'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>
                {new Date(u.createdAt).toLocaleDateString()}
              </span>
              <div>
                {!u.isAdmin && (
                  <button className={styles.deleteBtn} onClick={() => setDeleteId(u._id)}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.confirmModal} initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <Trash2 size={32} className={styles.confirmIcon} />
              <h3>Delete User?</h3>
              <p>This will permanently remove the user and their data.</p>
              <div className={styles.confirmBtns}>
                <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
                <button className={styles.deleteBtnConfirm} onClick={() => handleDelete(deleteId)}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
