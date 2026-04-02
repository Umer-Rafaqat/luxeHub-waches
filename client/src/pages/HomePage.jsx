import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, ChevronDown, Award, Shield, Truck, RotateCcw } from 'lucide-react';
import { useFeaturedProducts } from '../hooks/useApi';
import ProductCard from '../components/ProductCard';
import styles from './HomePage.module.css';

const HERO_WATCHES = [
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200',
  'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=1200',
  'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1200',
];

const CATEGORIES = [
  { label: 'Luxury', img: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600', href: '/products?category=luxury', desc: 'Haute horlogerie masterpieces' },
  { label: 'Sport', img: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600', href: '/products?category=sport', desc: 'Built for performance' },
  { label: 'Classic', img: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600', href: '/products?category=classic', desc: 'Timeless elegance' },
  { label: 'Digital', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600', href: '/products?category=digital', desc: 'Smart technology' },
];

const PERKS = [
  { icon: Award, title: 'Certified Authentic', desc: 'Every piece verified by master watchmakers' },
  { icon: Shield, title: '5-Year Warranty', desc: 'Full coverage on all timepieces' },
  { icon: Truck, title: 'Free Shipping', desc: 'Complimentary worldwide delivery' },
  { icon: RotateCcw, title: '30-Day Returns', desc: 'Hassle-free return policy' },
];

function AnimatedText({ text, className, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const words = text.split(' ');
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: delay + i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { products: featured, loading } = useFeaturedProducts();

  return (
    <main>
      {/* HERO */}
      <section ref={heroRef} className={styles.hero}>
        <motion.div className={styles.heroBg} style={{ y: heroY }}>
          <img src={HERO_WATCHES[0]} alt="Hero watch" className={styles.heroBgImg} />
          <div className={styles.heroBgOverlay} />
        </motion.div>

        <motion.div className={styles.heroContent} style={{ opacity: heroOpacity }}>
          <motion.span
            className={styles.heroEyebrow}
            initial={{ opacity: 0, letterSpacing: '0.3em' }}
            animate={{ opacity: 1, letterSpacing: '0.2em' }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            2026 Collection
          </motion.span>

          <h1 className={styles.heroTitle}>
            <AnimatedText text="The Art of" className={styles.heroLine1} delay={0.5} />
            <br />
            <AnimatedText text="Timekeeping" className={styles.heroLine2} delay={0.7} />
          </h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            Discover extraordinary timepieces crafted for those who appreciate the finest things in life.
          </motion.p>

          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <Link to="/products" className={styles.ctaPrimary}>
              Explore Collection <ArrowRight size={16} />
            </Link>
            <Link to="/products?category=luxury" className={styles.ctaSecondary}>
              Luxury Pieces
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.heroScroll}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={20} strokeWidth={1} />
          </motion.div>
          <span>Scroll</span>
        </motion.div>

        <div className={styles.heroStats}>
          {[['18+', 'Brands'], ['500+', 'Models'], ['50K+', 'Clients']].map(([num, label]) => (
            <motion.div
              key={label}
              className={styles.heroStat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <span className={styles.statNum}>{num}</span>
              <span className={styles.statLabel}>{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className={styles.marqueeWrap}>
        <motion.div
          className={styles.marquee}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {Array(8).fill(['LUXURY', 'PRECISION', 'CRAFTSMANSHIP', 'HERITAGE', 'EXCELLENCE']).flat().map((w, i) => (
            <span key={i} className={styles.marqueeItem}>{w} <span className={styles.marqueeDot}>◆</span></span>
          ))}
        </motion.div>
      </div>

      {/* CATEGORIES */}
      <section className={styles.categories}>
        <div className="container">
          <motion.div
            className={styles.sectionHead}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.eyebrow}>Shop by Style</span>
            <h2 className={styles.sectionTitle}>Find Your Collection</h2>
          </motion.div>

          <div className={styles.catGrid}>
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
              >
                <Link to={cat.href} className={styles.catCard}>
                  <div className={styles.catImgWrap}>
                    <img src={cat.img} alt={cat.label} className={styles.catImg} />
                    <div className={styles.catOverlay} />
                  </div>
                  <div className={styles.catInfo}>
                    <span className={styles.catDesc}>{cat.desc}</span>
                    <h3 className={styles.catLabel}>{cat.label}</h3>
                    <span className={styles.catArrow}><ArrowRight size={16} /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className={styles.featured}>
        <div className="container">
          <motion.div
            className={styles.sectionHead}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.eyebrow}>Curated Selection</span>
            <h2 className={styles.sectionTitle}>Featured Timepieces</h2>
            <Link to="/products" className={styles.seeAll}>
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>

          {loading ? (
            <div className={styles.skeletonGrid}>
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : (
            <div className={styles.productGrid}>
              {featured.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className={styles.editorial}>
        <div className={styles.editorialImg}>
          <img src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1400" alt="Editorial" />
          <div className={styles.editorialOverlay} />
        </div>
        <motion.div
          className={styles.editorialContent}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <span className={styles.eyebrow}>The Luxe Hub Story</span>
          <h2 className={styles.editorialTitle}>Where Tradition Meets Innovation</h2>
          <p className={styles.editorialText}>
            For over three decades, Luxe Hub has been the destination for collectors who demand nothing less than perfection. Our curated selection spans the full spectrum of horology.
          </p>
          <Link to="/products" className={styles.ctaPrimary}>
            Discover More <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* PERKS */}
      <section className={styles.perks}>
        <div className="container">
          <div className={styles.perksGrid}>
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk.title}
                className={styles.perk}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <perk.icon size={28} strokeWidth={1} className={styles.perkIcon} />
                <h4 className={styles.perkTitle}>{perk.title}</h4>
                <p className={styles.perkDesc}>{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
