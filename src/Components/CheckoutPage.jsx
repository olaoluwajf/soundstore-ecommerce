import React, { useState } from "react";
import "./CheckoutPage.css";
import { useCart } from "../context/CartContext"; 

export default function CheckoutPage() {
  const { cart } = useCart();
   const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const deliveryFee = subtotal > 0 ? 15 : 0; 
  const total = subtotal + deliveryFee;

  
  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
      setShowPayment(false);
    }, 2000); 
  };

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        {/* LEFT: SHIPPING FORM */}
        <div className="checkout-form">
          <h2>Checkout</h2>
          <form>
            <label>
              Full Name
              <input type="text" placeholder="Enter your full name" required />
            </label>

            <label>
              Email
              <input type="email" placeholder="Enter your email" required />
            </label>

            <label>
              Address
              <input type="text" placeholder="Enter your address" required />
            </label>

            <div className="form-row">
              <label>
                City
                <input type="text" placeholder="City" required />
              </label>
              <label>
                Postal Code
                <input type="text" placeholder="Postal Code" required />
              </label>
            </div>

            <label>
              Phone Number
              <input type="text" placeholder="+1 555 123 4567" required />
            </label>
          </form>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>

          {cart.length > 0 ? (
            <div className="summary-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-info">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="item-qty">x{item.quantity || 1}</p>
                </div>
              ))}

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <p className="empty-summary">Your cart is empty.</p>
          )}

          <button
            className="pay-btn"
            disabled={cart.length === 0}
            style={{
              opacity: cart.length === 0 ? 0.6 : 1,
              cursor: cart.length === 0 ? "not-allowed" : "pointer",
            }}
            onClick={() => setShowPayment(true)}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
      {/* MOCK PAYMENT MODAL */}
      {showPayment && (
        <div className="payment-modal">
          <div className="payment-box">
            <h3>Check Out</h3>
            <form onSubmit={handlePayment}>
              <label>
                Card Number
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  maxLength="19"
                  required
                />
              </label>
              
                <label>
                  Expiry
                  <input type="text" placeholder="MM/YY" maxLength="5" required />
                </label>
                <label>
                  CVC
                  <input type="text" placeholder="CVC" maxLength="3" required />
                </label>
              
              <button type="submit" className="confirm-btn" disabled={processing}>
                {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowPayment(false)}
                disabled={processing}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS SCREEN */}
      {paid && (
        <div className="success-overlay">
          <div className="success-box">
            <h2>✅ Payment Successful!</h2>
            <p>Your order has been placed successfully.</p>
            <button onClick={() => setPaid(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
