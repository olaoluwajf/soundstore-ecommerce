import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ search, setSearch }) {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { cart, clearCart } = useCart();

  // ✅ List of admin emails
  const adminEmails = ["famirojujoshua@gmail.com"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    clearCart();
    navigate("/");
  };

  const isAdmin = user && adminEmails.includes(user.email);

  // ✅ Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar glass">
      {/* Logo */}
      <Link to="/" className="logo">
        SoundStore
      </Link>

      {/* Search */}
      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Navigation Links (visible on desktop) */}
      <div className="nav-links">
        <Link to="/" >Home</Link>
        <Link to="/products" >Products</Link>
        <Link to="/cart" className="cart-icon">
          <FontAwesomeIcon icon={faShoppingCart} />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </Link>
      </div>

      {/* Profile / Menu dropdown (also contains nav links for mobile) */}
      <div className="profile-dropdown" ref={dropdownRef}>
        <FontAwesomeIcon
          icon={faUserCircle}
          className="profile-icon"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="dropdown-menu">
            {/* show email if logged in */}
            {user && <p className="dropdown-email">{user.email}</p>}

            {/* Navigation links included in dropdown for mobile */}
            <div className="dropdown-links">
              <Link to="/" onClick={() => setDropdownOpen(false)}>Home</Link>
              <Link to="/products" onClick={() => setDropdownOpen(false)}>Products</Link>
              <Link to="/cart" onClick={() => setDropdownOpen(false)} className="cart-link">
                Cart {cart.length > 0 && <span className="cart-count-inline">({cart.length})</span>}
              </Link>
              {isAdmin && (
                <button
                  className="dropdown-btn"
                  onClick={() => {
                    navigate("/admin");
                    setDropdownOpen(false);
                  }}
                >
                  Dashboard
                </button>
              )}
            </div>

            <div className="dropdown-actions">
              {user ? (
                <button
                  className="dropdown-btn"
                  onClick={() => {
                    handleSignOut();
                    setDropdownOpen(false);
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="dropdown-btn"
                  onClick={() => setDropdownOpen(false)}
                >
                  Sign Up / Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
