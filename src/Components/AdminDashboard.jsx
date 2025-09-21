import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // new state

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

  const totalProducts = products.filter((p) => !p.deleted).length;
  const deletedProducts = products.filter((p) => p.deleted).length;

  const softDeleteProduct = async (id) => {
    if (!window.confirm("Move product to trash?")) return;
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

  const goToAdd = () => navigate("/admin/add-product");
  const goToRestore = () => navigate("/admin/restore-products");

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}

            {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className="logo">Admin</h2>
        <ul>
          <li onClick={() => navigate("/admin")}>Dashboard Home</li>
          <li onClick={goToAdd}>Add New Product</li>
          <li onClick={goToRestore}>Restore Deleted Products</li>
          <li onClick={() => navigate("/auth")}>Log Out</li>
        </ul>
      </aside>


      <main className="main-content">
        {/* Toggle Button (mobile only) */}
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <h1>Admin Dashboard</h1>

        <div className="dashboard-actions">
          <button className="btn-add" onClick={goToAdd}>
            + Add New Product
          </button>
          <button className="btn-restore" onClick={goToRestore}>
            🔄 Restore Deleted Products
          </button>
        </div>

        {message && <p className="admin-message">{message}</p>}

        <div className="dashboard-summary">
          <div className="card">
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
          <div className="card">
            <h3>Deleted Products</h3>
            <p>{deletedProducts}</p>
          </div>
          <div className="card">
            <h3>All Items (incl. deleted)</h3>
            <p>{products.length}</p>
          </div>
        </div>

        <h2 className="products-title">Products</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          <div className="admin-grid">
            {products.map((product) => (
              <div className="admin-card" key={product.id}>
                <img src={product.image} alt={product.title} />
                <h3>{product.title}</h3>
                <p className="muted">{product.category}</p>
                <p className="price">${product.price}</p>

                <div className="card-actions">
                  {!product.deleted ? (
                    <>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="btn-view"
                      >
                        View
                      </button>
                      <button
                        onClick={() => softDeleteProduct(product.id)}
                        className="btn-danger"
                      >
                        Move to Trash
                      </button>
                    </>
                  ) : (
                    <span className="muted">In Trash</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
