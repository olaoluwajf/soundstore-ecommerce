import { Link } from 'react-router-dom';
import './ProductCard.css';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { cart, addToCart, removeFromCart } = useCart();

  const inCart = cart.some((item) => String(item.id) === String(product.id));

  return (
    <div className="product-card">

      <Link to={`/product/${product.id}`} className="product-link">
        <img src={product.image} alt={product.title} className="product-image" />
        <h3>{product.title}</h3>
      </Link>

      <p className="price">${product.price}</p>

      {!inCart ? (
        <button
          className="cart-btn add"
          onClick={(e) => {
            e.stopPropagation(); 
            addToCart(product);
          }}
        >
          Add to Cart
        </button>
      ) : (
        <button
          className="cart-btn remove"
          onClick={(e) => {
            e.stopPropagation(); 
            removeFromCart(product.id);
          }}
        >
          Remove from Cart
        </button>
      )}
    </div>
  );
}
