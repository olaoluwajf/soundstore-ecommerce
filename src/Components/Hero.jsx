import './Hero.css';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="hero">
      <motion.div className="hero-text" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <h2>Shop Smart. <br /> Live Better.</h2>
        <p>We bring the latest, the trusted, and the trending to your doorstep.</p>
        <button>Shop Now</button>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
           <div className="hero-image-container">
    <div className="blob-background"></div>
              <img src="/Hero-image.png" alt="Hero Product" className="hero-image" />
  </div>

      </motion.div>
    </section>
  );
}
     