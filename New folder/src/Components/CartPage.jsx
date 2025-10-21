import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from 'react-router-dom';
import "./CartPage.css";
import EmptyCart from "./EmptyCart"; 


const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
     <EmptyCart />
    );
  }

  // compute total price
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} className="cart-item-img" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="price">₦{item.price}</p>
              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <p className="total">Total: ₦{total}</p>
        <button className="btn-clear" onClick={clearCart}>
          Clear Cart
        </button>
        <Link to='/checkout' className="btn-checkout">Checkout</Link>
      </div>

    </div>
  );
};

export default CartPage;
