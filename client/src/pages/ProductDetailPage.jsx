import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, ChevronLeft, ChevronRight, Check, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useProduct, useProducts } from '../hooks/useApi';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const { addItem } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');

  const { products: related } = useProducts({ category: product?.category, limit: 4 });

  const handleAddToCart = () => {
    addItem(product, qty, selectedColor || product?.colors?.[0]);
    setAdded(true);
    toast.success('Added to cart');
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner} />
    </div>
  );

  if (!product) return (
    <div className={styles.notFound}>
      <p>Product not found</p>
      <Link to="/products">Back to collection</Link>
    </div>
  );

  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <main className={styles.page}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/products" className={styles.back}>
            <ArrowLeft size={16} strokeWidth={1.5} /> Back to Collection
          </Link>
        </motion.div>

        <div className={styles.layout}>
          {/* Gallery */}
          <motion.div
            className={styles.gallery}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className={styles.mainImg}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIdx}
                  src={images[imgIdx]}
                  alt={product.name}
                  className={styles.mainImgEl}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button className={`${styles.imgNav} ${styles.imgNavPrev}`} onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}>
                    <ChevronLeft size={20} strokeWidth={1.5} />
                  </button>
                  <button className={`${styles.imgNav} ${styles.imgNavNext}`} onClick={() => setImgIdx((i) => (i + 1) % images.length)}>
                    <ChevronRight size={20} strokeWidth={1.5} />
                  </button>
                </>
              )}
              {product.badge && <span className={styles.badge}>{product.badge}</span>}
            </div>

            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${imgIdx === i ? styles.thumbActive : ''}`}
                  onClick={() => setImgIdx(i)}
                >
                  <img src={img} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className={styles.infoTop}>
              <span className={styles.brand}>{product.brand}</span>
              <div className={styles.rating}>
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} strokeWidth={1.5} />
                ))}
                <span>({product.numReviews} reviews)</span>
              </div>
            </div>

            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>PKR {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className={styles.original}>PKR {product.originalPrice.toLocaleString()}</span>
              )}
              {product.originalPrice && (
                <span className={styles.discount}>
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <p className={styles.desc}>{product.description}</p>

            {/* Colors */}
            <div className={styles.section}>
              <span className={styles.sectionLabel}>
                Color: <strong>{selectedColor || product.colors?.[0]}</strong>
              </span>
              <div className={styles.colors}>
                {product.colors?.map((c) => (
                  <button
                    key={c}
                    className={`${styles.colorBtn} ${(selectedColor || product.colors[0]) === c ? styles.colorActive : ''}`}
                    onClick={() => setSelectedColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Quantity</span>
              <div className={styles.qtyRow}>
                <div className={styles.qty}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={14} /></button>
                  <motion.span key={qty} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>{qty}</motion.span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))}><Plus size={14} /></button>
                </div>
                <span className={styles.stock}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <motion.button
              className={`${styles.addBtn} ${added ? styles.addBtnAdded : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span key="added" className={styles.addBtnInner} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <Check size={18} /> Added to Cart
                  </motion.span>
                ) : (
                  <motion.span key="add" className={styles.addBtnInner} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <ShoppingBag size={18} strokeWidth={1.5} /> Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Tabs */}
            <div className={styles.tabs}>
              {['specs', 'details', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && <motion.div className={styles.tabLine} layoutId="tabLine" />}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={styles.tabContent}
              >
                {activeTab === 'specs' && product.specs && (
                  <div className={styles.specsList}>
                    {Object.entries(product.specs).filter(([, v]) => v && (!Array.isArray(v) || v.length)).map(([key, val]) => (
                      <div key={key} className={styles.specRow}>
                        <span className={styles.specKey}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className={styles.specVal}>{Array.isArray(val) ? val.join(', ') : val}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'details' && (
                  <div className={styles.detailsText}>
                    <p>{product.description}</p>
                    <p>Category: <strong>{product.category}</strong></p>
                    <p>Brand: <strong>{product.brand}</strong></p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className={styles.detailsText}>
                    <p>Free worldwide shipping on all orders. Delivered in a premium Luxe Hub presentation box.</p>
                    <p>Estimated delivery: 3-7 business days.</p>
                    <p>30-day hassle-free returns. 5-year manufacturer warranty included.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.filter((p) => p._id !== id).length > 0 && (
          <section className={styles.related}>
            <motion.h2
              className={styles.relatedTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              You May Also Like
            </motion.h2>
            <div className={styles.relatedGrid}>
              {related.filter((p) => p._id !== id).slice(0, 4).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
