import './ProductDetail.css';
import { useParams, useNavigate } from 'react-router-dom'; // <-- add useNavigate
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- initialize navigate
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product', error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!product) return <p className="loading">Product not found</p>;

  const inCart = cart.some((item) => String(item.id) === String(product.id));

  return (
    <div className="product-details">
      <div className="image-section">
        <img src={product.image} alt={product.title} />
      </div>

      <div className="details-section">
        <h1>{product.title}</h1>
        <p className="category">{product.category}</p>
        <p className="price">${product.price}</p>
        <p className="description">{product.description}</p>

        {!inCart ? (
          <button className="cart-btn add" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        ) : (
          <button
            className="cart-btn remove"
            onClick={() => removeFromCart(product.id)}
          >
            Remove from Cart
          </button>
        )}

        {/* Go Back Button */}
        <button
          className="back-btn"
          style={{ marginTop: '1.5rem' }}
          onClick={() => navigate('/products')}
        >
          ← Back to Products
        </button>
      </div>
    </div>
  );
}
