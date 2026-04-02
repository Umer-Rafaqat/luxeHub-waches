import { motion } from 'framer-motion';
import styles from './LegalPage.module.css';

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <motion.div className={styles.container} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className={styles.eyebrow}>Legal</span>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: April 2026</p>

        <div className={styles.body}>
          <section>
            <h2>1. Information We Collect</h2>
            <p>When you place an order or contact us, we may collect your name, phone number, email address, and delivery address. This information is used solely to process and deliver your order.</p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Contact you regarding your order status</li>
              <li>Send updates about new collections (only if you opt in)</li>
              <li>Improve our services and website experience</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or share your personal information with third parties. Your data is only used internally to manage your orders and communications with Luxe Hub.</p>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>We take reasonable measures to protect your personal information. Our website uses SSL encryption to secure data transmitted between your browser and our servers.</p>
          </section>

          <section>
            <h2>5. Cookies</h2>
            <p>We use cookies to maintain your shopping cart and session preferences. No tracking or advertising cookies are used. You can disable cookies in your browser settings, though some features may not function correctly.</p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to request access to, correction of, or deletion of your personal data. To make such a request, contact us via WhatsApp at <strong>0309 2911122</strong> or Instagram <strong>@luxehubpk</strong>.</p>
          </section>

          <section>
            <h2>7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.</p>
          </section>

          <section>
            <h2>8. Contact</h2>
            <p>For any privacy-related questions, reach us at:</p>
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
