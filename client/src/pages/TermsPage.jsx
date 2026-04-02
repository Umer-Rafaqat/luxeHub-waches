import { motion } from 'framer-motion';
import styles from './LegalPage.module.css';

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <motion.div className={styles.container} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className={styles.eyebrow}>Legal</span>
        <h1>Terms of Service</h1>
        <p className={styles.updated}>Last updated: April 2026</p>

        <div className={styles.body}>
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the Luxe Hub website and placing orders, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>

          <section>
            <h2>2. Products</h2>
            <p>All watches sold by Luxe Hub are 100% original and imported. We make every effort to accurately represent products through descriptions and images. Minor variations in color may occur due to photography and screen settings.</p>
          </section>

          <section>
            <h2>3. Orders & Payment</h2>
            <ul>
              <li>Orders can be placed through the website, WhatsApp, or Instagram DM.</li>
              <li>We offer <strong>Cash on Delivery</strong> across all of Pakistan.</li>
              <li>Orders are confirmed once our team verifies availability and contacts you.</li>
              <li>Prices are listed in PKR and are subject to change without prior notice.</li>
            </ul>
          </section>

          <section>
            <h2>4. Shipping & Delivery</h2>
            <p>We deliver all over Pakistan via courier services. Estimated delivery time is 3–7 business days depending on your location. Delivery charges, if any, will be communicated at the time of order confirmation.</p>
          </section>

          <section>
            <h2>5. Returns & Exchanges</h2>
            <p>We accept returns or exchanges within <strong>7 days</strong> of delivery, provided the item is unused, in its original packaging, and accompanied by proof of purchase. Items damaged due to misuse are not eligible for return.</p>
            <p>To initiate a return, contact us via WhatsApp at <strong>0309 2911122</strong>.</p>
          </section>

          <section>
            <h2>6. Warranty</h2>
            <p>All watches come with a manufacturer warranty as applicable. Warranty does not cover physical damage, water damage beyond the watch's rated resistance, or unauthorized repairs.</p>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>Luxe Hub shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services beyond the purchase price of the item in question.</p>
          </section>

          <section>
            <h2>8. Changes to Terms</h2>
            <p>We reserve the right to update these Terms of Service at any time. Continued use of our website after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>For any questions regarding these terms:</p>
            <ul>
              <li>WhatsApp: <a href="https://wa.me/923092911122" target="_blank" rel="noopener noreferrer">0309 2911122</a></li>
              <li>Instagram: <a href="https://www.instagram.com/luxehubpk" target="_blank" rel="noopener noreferrer">@luxehubpk</a></li>
            </ul>
          </section>
        </div>
      </motion.div>
    </main>
  );
}
