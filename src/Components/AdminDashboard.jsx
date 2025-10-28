import { useConfirm } from '../context/ConfirmContext';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { confirm } = useConfirm();

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  // fetch products from supabase
  const fetchProducts = async () => {
    setLoading(true);
    setMessage("");
    try {
      const { data, error } = await supabase.from("Products").select("*");
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Fetch products error:", err);
      setMessage("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

   useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const totalProducts = products.filter((p) => !p.deleted).length;
  const deletedProducts = products.filter((p) => p.deleted).length;

  const softDeleteProduct = async (id) => {
    if (!await confirm("Move product to trash?")) return;
    try {
      const { error } = await supabase
        .from("Products")
        .update({ deleted: true })
        .eq("id", id);

      if (error) throw error;
      setMessage("Product moved to trash.");
      await fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete product.");
    }
  };

  const goToAdd = () => {
    setSidebarOpen(false);
    navigate("/admin/add-product");
  };
  const goToRestore = () => {
    setSidebarOpen(false);
    navigate("/admin/restore-products");
  };

  const filtered = products.filter((p) =>
    (p.title || p.name || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      {/* Add overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <Link to="/" className="logo">SoundStore</Link>

          <button
            className="close-btn"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => { setSidebarOpen(false); navigate("/admin"); }} className="nav-item">
            <svg className="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z"/></svg>
            Dashboard
          </button>

          <button onClick={goToAdd} className="nav-item">
            <svg className="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M13 11h8v2h-8v8h-2v-8H3v-2h8V3h2v8z"/></svg>
            Add Product
          </button>

          <button onClick={goToRestore} className="nav-item">
            <svg className="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M13 3a9 9 0 100 18 9 9 0 000-18zm-1 5v6l5 3 .75-1.23L14 13V8h-2z"/></svg>
            Restore Deleted
          </button>
         
          <button onClick={() => { setSidebarOpen(false); navigate("/login"); }} className="nav-item danger">
            <svg className="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>
            Log Out
          </button>
                            <button
            className="toggle-theme-btn"
            onClick={() => setDarkMode((d) => !d)}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </nav>

        <div className="sidebar-footer">
          <small className="muted">SoundStore • Admin</small>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div className="left">
            {/* Hamburger button */}
            <button 
              className={`hamburger ${sidebarOpen ? 'open' : ''}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <h1 className="title">Admin Dashboard</h1>
          </div>

          <div className="right">
            <div className="search">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
              />
              <button className="btn-icon" title="Clear" onClick={() => setQuery("")}>✕</button>
            </div>
          </div>
        </div>

        {/* actions + stats */}
        <section className="top-row">
          <div className="actions">
            <button className="btn primary" onClick={goToAdd}>+ Add New Product</button>
            <button className="btn outline" onClick={goToRestore}>🔄 Restore Deleted</button>
          </div>

          <div className="stats">
            <div className="stat-card glow">
              <div className="stat-label">Total</div>
              <div className="stat-value">{totalProducts}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Deleted</div>
              <div className="stat-value">{deletedProducts}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">All Items</div>
              <div className="stat-value">{products.length}</div>
            </div>
          </div>
        </section>

        {message && <div className="notice">{message}</div>}

        <section className="admin-products-section">
          <h2 className="section-title">Products</h2>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="empty">No products found.</div>
          ) : (
            <div className="admin-product-grid">
              {filtered.map((p) => (
                <article className="product-card" key={p.id}>
                  <div className="media">
                    <img src={p.image} alt={p.title} />
                  </div>

                  <div className="info">
                    <h3 className="p-title">{p.title}</h3>
                    <p className="p-category">{p.category}</p>
                    <div className="p-bottom">
                      <div className="price">${p.price}</div>
                      <div className="actions-row">
                        {!p.deleted ? (
                          <>
                            <button className="small-btn" onClick={() => navigate(`/admin/product/${p.id}`)}>View</button>
                            <button className="small-btn danger" onClick={() => softDeleteProduct(p.id)}>Trash</button>
                          </>
                        ) : (
                          <span className="muted">In Trash</span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
