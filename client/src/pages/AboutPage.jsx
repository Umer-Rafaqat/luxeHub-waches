import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Watch } from 'lucide-react';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.eyebrow}>Our Story</span>
          <h1>About Luxe Hub</h1>
          <p>Pakistan's destination for 100% original imported watches.</p>
        </motion.div>
      </section>

      {/* Description */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div
            className={styles.descCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Watch size={36} strokeWidth={1} className={styles.watchIcon} />
            <h2>Who We Are</h2>
            <p>
              Luxe Hub is a shopping &amp; retail brand dedicated to bringing you the finest timepieces from around the world.
              Every watch we carry is <strong>100% original</strong> and imported — no replicas, no compromises.
            </p>
            <p>
              We offer <strong>Cash on Delivery all over Pakistan</strong>, so you can shop with complete confidence and pay only when your order arrives at your door.
            </p>
            <p>
              Whether you're a seasoned collector or buying your first luxury watch, our team is here to help you find the perfect timepiece. Reach out to us directly via DM or WhatsApp — we're always happy to assist.
            </p>
          </motion.div>

          {/* Highlights */}
          <div className={styles.highlights}>
            {[
              { icon: '⌚️', title: '100% Original', desc: 'Every watch is genuine and imported directly from authorized sources.' },
              { icon: '🚛', title: 'Cash on Delivery', desc: 'Available all over Pakistan. Pay when your order arrives.' },
              { icon: '📩', title: 'Order via DM / WhatsApp', desc: 'Prefer to order directly? Message us on Instagram or WhatsApp.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={styles.highlightCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <span className={styles.highlightEmoji}>{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <motion.div
            className={styles.contactCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2>Get in Touch</h2>
            <div className={styles.contactLinks}>
              <a
                href="https://wa.me/923092911122"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactBtn}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp: 0309 2911122
              </a>
              <a
                href="https://www.instagram.com/luxehubpk?igsh=MThncjkxbW1tcnhuYg=="
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactBtn}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
                @luxehubpk
              </a>
            </div>
          </motion.div>

          <div className={styles.cta}>
            <Link to="/products" className={styles.ctaBtn}>Explore Collection</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
