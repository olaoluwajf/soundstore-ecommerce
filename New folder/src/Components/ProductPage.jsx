import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './ProductPage.css';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

export default function ProductPage({ search, addToCart, removeFromCart, cart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

useEffect(() => {
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('Products').select('*');
    if (error) console.error("Supabase error:", error);
    else {
      console.log("Fetched products:", data);
      setProducts(data);
    }
    setLoading(false);
  };
  fetchProducts();
}, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="product-page">
      <h2>All Products</h2>
      <motion.div
        className="product-grid"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="product-skeleton" />)
          : filteredProducts.length > 0
          ? filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                cart={cart}
              />
            ))
          : <p className="no-results">No products found</p>}
      </motion.div>
    </section>
  );
}
