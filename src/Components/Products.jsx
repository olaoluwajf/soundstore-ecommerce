import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import './Products.css';
import { supabase } from '../supabaseClient';

export default function Products({ addToCart, removeFromCart, cart, search }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('Products')
        .select('*'); 

      if (error) console.error("Error fetching products:", error);
      else setProducts(data);

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(search?.toLowerCase())
  );

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>
      <div className="featured-grid">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="product-skeleton" />)
          : filteredProducts.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                cart={cart}
              />
            ))}
      </div>
      <div className="view-all-wrapper">
        <button className="view-all-btn" onClick={() => navigate('/products')}>
          View All Products
        </button>
      </div>
    </section>
  );
}
