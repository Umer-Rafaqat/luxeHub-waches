import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';
import { api } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './AdminTable.module.css';

const EMPTY_FORM = {
  name: '', brand: '', description: '', price: '', originalPrice: '',
  category: 'luxury', thumbnail: '', images: '', stock: 10,
  isFeatured: false, badge: '',
  colors: '', rating: 0, numReviews: 0,
  specs: { movement: '', caseMaterial: '', caseSize: '', waterResistance: '', crystal: '', strap: '', powerReserve: '' },
};

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const headers = { Authorization: `Bearer ${user?.token}` };

  const load = () => {
    setLoading(true);
    api.get('/admin/products', { headers })
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
  const openEdit = (p) => {
    setForm({
      ...p,
      images: p.images?.join(', ') || '',
      colors: p.colors?.join(', ') || '',
      specs: p.specs || EMPTY_FORM.specs,
    });
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        stock: Number(form.stock),
        images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: form.colors ? form.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (modal === 'add') {
        await api.post('/admin/products', payload, { headers });
        toast.success('Product created');
      } else {
        await api.put(`/admin/products/${form._id}`, payload, { headers });
        toast.success('Product updated');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`, { headers });
      toast.success('Product deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const setSpec = (key, val) => setForm(f => ({ ...f, specs: { ...f.specs, [key]: val } }));

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.sub}>{products.length} total products</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchWrap}>
            <Search size={14} />
            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className={styles.addBtn} onClick={openAdd}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Rating</span>
          <span>Featured</span>
          <span>Actions</span>
        </div>

        {loading ? (
          Array(6).fill(0).map((_, i) => <div key={i} className={styles.skeletonRow} />)
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>No products found</p>
        ) : (
          filtered.map((p, i) => (
            <motion.div
              key={p._id}
              className={styles.tableRow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className={styles.productCell}>
                <img src={p.thumbnail} alt={p.name} className={styles.thumb} />
                <div>
                  <p className={styles.productName}>{p.name}</p>
                  <p className={styles.productBrand}>{p.brand}</p>
                </div>
              </div>
              <span className={styles.catBadge}>{p.category}</span>
              <span className={styles.price}>
                PKR {p.price.toLocaleString()}
                {p.originalPrice && <s>PKR {p.originalPrice.toLocaleString()}</s>}
              </span>
              <span className={p.stock < 5 ? styles.lowStock : styles.stockOk}>{p.stock}</span>
              <span className={styles.rating}>★ {p.rating?.toFixed(1)}</span>
              <span className={p.isFeatured ? styles.yes : styles.no}>{p.isFeatured ? 'Yes' : 'No'}</span>
              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => openEdit(p)}><Pencil size={14} /></button>
                <button className={styles.deleteBtn} onClick={() => setDeleteId(p._id)}><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className={styles.modalHeader}>
                <h2>{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
                <button onClick={() => setModal(null)}><X size={18} /></button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <Field label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
                  <Field label="Brand" value={form.brand} onChange={v => setForm(f => ({ ...f, brand: v }))} />
                  <Field label="Price ($)" type="number" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} />
                  <Field label="Original Price ($)" type="number" value={form.originalPrice || ''} onChange={v => setForm(f => ({ ...f, originalPrice: v }))} />
                  <div className={styles.fieldFull}>
                    <label>Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      {['luxury', 'sport', 'classic', 'digital'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <Field label="Stock" type="number" value={form.stock} onChange={v => setForm(f => ({ ...f, stock: v }))} />
                  <Field label="Badge (e.g. New, Sale)" value={form.badge || ''} onChange={v => setForm(f => ({ ...f, badge: v }))} />
                  <div className={styles.fieldFull}>
                    <label>
                      <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                      {' '}Featured on Homepage
                    </label>
                  </div>
                  <div className={styles.fieldFull}>
                    <Field label="Thumbnail URL" value={form.thumbnail} onChange={v => setForm(f => ({ ...f, thumbnail: v }))} />
                  </div>
                  <div className={styles.fieldFull}>
                    <Field label="Image URLs (comma-separated)" value={form.images} onChange={v => setForm(f => ({ ...f, images: v }))} />
                  </div>
                  <div className={styles.fieldFull}>
                    <Field label="Colors (comma-separated)" value={form.colors} onChange={v => setForm(f => ({ ...f, colors: v }))} />
                  </div>
                  <div className={styles.fieldFull}>
                    <Field label="Description" textarea value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} />
                  </div>
                </div>

                <div className={styles.specsSection}>
                  <h3>Specifications</h3>
                  <div className={styles.formGrid}>
                    {Object.keys(EMPTY_FORM.specs).map(key => (
                      <Field key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={form.specs?.[key] || ''} onChange={v => setSpec(key, v)} />
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.cancelBtn} onClick={() => setModal(null)}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? <span className={styles.spinner} /> : <><Check size={15} /> Save</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.confirmModal} initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <Trash2 size={32} className={styles.confirmIcon} />
              <h3>Delete Product?</h3>
              <p>This action cannot be undone.</p>
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

function Field({ label, value, onChange, type = 'text', textarea }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}
