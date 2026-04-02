import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useProducts } from '../hooks/useApi';
import ProductCard from '../components/ProductCard';
import styles from './ProductsPage.module.css';

const CATEGORIES = ['all', 'luxury', 'sport', 'classic', 'digital'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;

  const { products, total, pages, loading } = useProducts({ category, sort, search, page, limit: 12 });

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <motion.div
          className={styles.headerContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.eyebrow}>Our Collection</span>
          <h1 className={styles.title}>
            {search ? `Results for "${search}"` : category === 'all' ? 'All Timepieces' : `${category.charAt(0).toUpperCase() + category.slice(1)} Watches`}
          </h1>
          <p className={styles.count}>{total} pieces</p>
        </motion.div>
      </div>

      <div className="container">
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.catTabs}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.catTab} ${category === cat ? styles.active : ''}`}
                onClick={() => setParam('category', cat)}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                {category === cat && (
                  <motion.div className={styles.tabUnderline} layoutId="tabUnderline" />
                )}
              </button>
            ))}
          </div>

          <div className={styles.controls}>
            <div className={styles.sortWrap}>
              <select
                className={styles.sort}
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className={styles.sortIcon} />
            </div>

            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${view === 'grid' ? styles.viewActive : ''}`}
                onClick={() => setView('grid')}
              >
                <Grid size={16} strokeWidth={1.5} />
              </button>
              <button
                className={`${styles.viewBtn} ${view === 'list' ? styles.viewActive : ''}`}
                onClick={() => setView('list')}
              >
                <List size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {search && (
          <div className={styles.searchTag}>
            <span>Search: "{search}"</span>
            <button onClick={() => { const n = new URLSearchParams(searchParams); n.delete('search'); setSearchParams(n); }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className={view === 'grid' ? styles.grid : styles.listGrid}>
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            className={styles.empty}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No watches found. Try a different filter.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${sort}-${search}-${page}`}
              className={view === 'grid' ? styles.grid : styles.listGrid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {products.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ''}`}
                onClick={() => setParam('page', String(p))}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
