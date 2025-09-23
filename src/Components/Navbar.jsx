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

  return (
    <nav className="navbar glass">
      {/* Logo */}
      <Link to="/" className="logo">
        SoundStore
      </Link>

      {/* Hamburger icon for mobile */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
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
