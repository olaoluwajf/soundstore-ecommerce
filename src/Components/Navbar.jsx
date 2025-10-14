import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ search, setSearch }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // for hamburger menu
  const navigate = useNavigate();

  const { cart, clearCart } = useCart();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    clearCart();
    navigate('/');
  };

  // Check admin status (example: store in localStorage on login)
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <nav className="navbar glass">
      {/* Logo */}
      <Link to="/" className="logo">
        SoundStore
      </Link>

      {/* Hamburger icon for mobile */}
      <div 
        className={`hamburger ${menuOpen ? 'open' : ''}`} 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Search */}
      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>

        <Link to="/cart" className="cart-icon" onClick={() => setMenuOpen(false)}>
          <FontAwesomeIcon icon={faShoppingCart} />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </Link>
      </div>

      {/* Admin Dashboard Button */}
      {isAdmin && (
        <button
          className="dashboard-btn"
          onClick={() => {
            navigate("/admin");
            setMenuOpen(false);
          }}
          style={{
            marginLeft: "1rem",
            background: "#ff9800",
            color: "#fff",
            borderRadius: "8px",
            padding: "0.5em 1em",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Dashboard
        </button>
      )}

      {/* Auth Buttons */}
      {!user ? (
        <Link
          to="/login"
          className="auth-btn login-btn"
          onClick={() => setMenuOpen(false)}
        >
          Sign Up / Login
        </Link>
      ) : (
        <button
          onClick={() => {
            handleSignOut();
            setMenuOpen(false);
          }}
          className="auth-btn logout-btn"
        >
          Sign Out
        </button>
      )}
    </nav>
  );
}
