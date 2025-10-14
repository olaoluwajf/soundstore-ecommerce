import React, { useState } from "react";
import "./CheckoutPage.css";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postal: "",
    phone: "",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const total = subtotal + deliveryFee;

  const allFieldsFilled = Object.values(form).every((v) => v.trim() !== "");

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Paystack payment handler
  const payWithPaystack = (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!window.PaystackPop) {
      alert("Payment service not loaded. Please refresh and try again.");
      setProcessing(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: "pk_test_0e9bca5770e44a5e3f83442e72c31b3739c40ebe", // Replace with your Paystack public key
      email: form.email,
      amount: total * 100, // Paystack expects amount in kobo
      currency: "NGN",
      ref: "ECOM-" + Math.floor(Math.random() * 1000000000 + 1),
      metadata: {
        custom_fields: [
          { display_name: "Full Name", variable_name: "full_name", value: form.name },
          { display_name: "Phone", variable_name: "phone", value: form.phone },
          { display_name: "Address", variable_name: "address", value: form.address },
          { display_name: "City", variable_name: "city", value: form.city },
          { display_name: "Postal", variable_name: "postal", value: form.postal },
        ],
      },
      callback: function (response) {
        setProcessing(false);
        setPaid(true);
        setShowPayment(false);
        // Optionally, verify transaction on your backend here
      },
      onClose: function () {
        setProcessing(false);
      },
    });
    handler.openIframe();
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
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
                value={form.name}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={form.email}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Address
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                required
                value={form.address}
                onChange={handleInputChange}
              />
            </label>

            <div className="form-row">
              <label>
                City
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  value={form.city}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Postal Code
                <input
                  type="text"
                  name="postal"
                  placeholder="Postal Code"
                  required
                  value={form.postal}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <label>
              Phone Number
              <input
                type="text"
                name="phone"
                placeholder="+1 555 123 4567"
                required
                value={form.phone}
                onChange={handleInputChange}
              />
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
            type="button"
            className="pay-btn"
            disabled={cart.length === 0 || !allFieldsFilled || processing}
            style={{
              opacity: cart.length === 0 || !allFieldsFilled ? 0.6 : 1,
              cursor: cart.length === 0 || !allFieldsFilled ? "not-allowed" : "pointer",
            }}
            onClick={payWithPaystack}
          >
            Pay with Paystack
          </button>
        </div>
      </div>
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
