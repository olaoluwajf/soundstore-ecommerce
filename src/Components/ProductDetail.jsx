import './ProductDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="product-loading-wrapper">
        <div className="product-loading">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }
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
        <button
  className="cart-btn add"
  onClick={() => {
    addToCart(product);
    toast.success("Product added to cart!");
  }}
>
  Add to Cart
</button>
        ) : (
      <button
  className="cart-btn remove"
  onClick={() => {
    removeFromCart(product.id);
    toast.info("Product removed from cart.");
  }}
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