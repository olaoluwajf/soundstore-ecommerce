import './Hero.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="hero">
      <motion.div className="hero-text" initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h2>Shop Smart. <br /> Live Better.</h2>
        <Link to="/products" className="hero-text-btn">Shop Now</Link>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
           <div className="hero-image-container">
    <div className="blob-background"></div>
              <img src="https://i.ibb.co/4n3944WG/Hero-image.png" alt="Hero Product" className="hero-image" />
  </div>

      </motion.div>
    </section>
  );
}
     