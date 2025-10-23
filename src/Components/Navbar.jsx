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
  const [menuOpen, setMenuOpen] = useState(false);
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

      {/* Hamburger icon for mobile */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
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

      {/* Nav links */}
      <div className={`nav-links ${menuOpen ? "show" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/products" onClick={() => setMenuOpen(false)}>
          Products
        </Link>
        <Link to="/cart" className="cart-icon" onClick={() => setMenuOpen(false)}>
          <FontAwesomeIcon icon={faShoppingCart} />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </Link>
      </div>

      {/* ✅ Profile dropdown (Admin + User) */}
      {user ? (
        <div className="profile-dropdown" ref={dropdownRef}>
          <FontAwesomeIcon
            icon={faUserCircle}
            className="profile-icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <p className="dropdown-email">{user.email}</p>
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setDropdownOpen(false);
                  }}
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={() => {
                  handleSignOut();
                  setDropdownOpen(false);
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          className="auth-btn login-btn"
          onClick={() => setMenuOpen(false)}
        >
          Sign Up / Login
        </Link>
      )}
    </nav>
  );
}
