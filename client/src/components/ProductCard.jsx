import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (product.images?.length > 1) setImgIdx(1);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setImgIdx(0);
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/products/${product._id}`} className={styles.imageWrap}>
        <motion.img
          key={imgIdx}
          src={product.images?.[imgIdx] || product.thumbnail}
          alt={product.name}
          className={styles.image}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.5 }}
        />
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className={styles.viewBtn}>
            <Eye size={14} strokeWidth={1.5} /> Quick View
          </span>
        </motion.div>
      </Link>

      <div className={styles.info}>
        <div className={styles.meta}>
          <span className={styles.brand}>{product.brand}</span>
          <div className={styles.rating}>
            <Star size={11} fill="currentColor" />
            <span>{product.rating?.toFixed(1)}</span>
          </div>
        </div>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceRow}>
          <div className={styles.prices}>
            <span className={styles.price}>PKR {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className={styles.original}>PKR {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <motion.button
            className={styles.addBtn}
            onClick={handleAddToCart}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
          </motion.button>
        </div>
        <div className={styles.colors}>
          {product.colors?.slice(0, 4).map((c) => (
            <span key={c} className={styles.colorDot} title={c} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
