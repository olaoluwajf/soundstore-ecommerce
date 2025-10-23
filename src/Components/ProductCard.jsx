import formatCurrency from '../utils/currency';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  const inCart = cart.some((item) => String(item.id) === String(product.id));

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="image-wrapper">
          <img src={product.image} alt={product.title} className="product-image" />
        </div>
        <h3 className="title">{product.title}</h3>       {inCart && (<div className='card-qty'><button onClick={(e) => { e.preventDefault(); updateQuantity(product.id, Math.max(1, (cart.find(i => i.id === product.id)?.quantity || 1) - 1)) }}>-</button><span>{cart.find(i => i.id === product.id)?.quantity || 1}</span><button onClick={(e) => { e.preventDefault(); updateQuantity(product.id, (cart.find(i => i.id === product.id)?.quantity || 1) + 1) }}>+</button></div>)}
      </Link>

      <p className="price">{formatCurrency(product.price)}</p>

      <div className="button-wrapper">
        {!inCart ? (
          <button
            className="cart-btn add"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            Add to Cart
          </button>
        ) : (
          <button
            className="cart-btn remove"
            onClick={(e) => {
              e.preventDefault();
              removeFromCart(product.id);
            }}
          >
            Remove from Cart
          </button>
        )}
      </div>
    </div>
  );
}
