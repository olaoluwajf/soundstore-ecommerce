import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Hero from './Components/Hero';
import ProductPage from './Components/ProductPage';
import Navbar from './Components/Navbar';
import Products from './Components/Products';
import ProductDetails from './Components/ProductDetail';
import AdminDashboard from './Components/AdminDashboard';
import AuthPage from './Components/AuthPage';
import AddProduct from './Components/AddProducts';
import RestoreProducts from './Components/RestoreProducts';
import SignUpPage from './Components/SignUpPage'
import LoginPage from './Components/LoginPage'
import AdminRoute from './Components/AdminRoute';
import CartPage from './Components/CartPage';
import Footer from './Components/Footer';
import './App.css';

function AnimatedRoutes({ search, addToCart, removeFromCart, cart, products }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Products 
                search={search} 
                addToCart={addToCart} 
                removeFromCart={removeFromCart} 
                cart={cart} 
              />
              <div className='footer-g'><Footer /></div>
              
            </>
          }
        />
      
        <Route
          path="/products"
          element={
            <>
            <ProductPage 
              search={search} 
              addToCart={addToCart} 
              removeFromCart={removeFromCart} 
              cart={cart} 
            />
            <Footer />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
            <ProductDetails
              products={products}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cart={cart}
            />
            <Footer/>
            </>
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/restore-products"
          element={
            <AdminRoute>
              <RestoreProducts />
            </AdminRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      // prevent duplicates
      if (prevCart.find((item) => item.id === product.id)) return prevCart;
      return [...prevCart, product];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <Router>
      <InnerApp
        search={search}
        setSearch={setSearch}
        cart={cart}
        setCart={setCart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
    </Router>
  );
}

function InnerApp({ search, setSearch, cart, addToCart, removeFromCart }) {
  const location = useLocation();

  // hide Navbar on auth and admin pages
  const hideNavbar = location.pathname.startsWith('/signup') || location.pathname.startsWith('/login') || location.pathname.startsWith('/admin');

  return (
    <>
      {!hideNavbar && (
        <>
        <Navbar 
          search={search} 
          setSearch={setSearch} 
          cartCount={cart.length} 
        />
        </>
      )}

      <AnimatedRoutes 
        search={search} 
        addToCart={addToCart} 
        removeFromCart={removeFromCart} 
        cart={cart} 
      />
    </>
  );
}
