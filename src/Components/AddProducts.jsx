import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AdminDashboard.css"; 

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    category: ""
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    if (!form.title || !form.price) {
      setMsg("Title and price are required.");
      setLoading(false);
      return;
    }

    try {
      const product = {
        title: form.title,
        price: parseFloat(form.price),
        image: form.image || "",
        description: form.description || "",
        deleted: false
      };

      const { data, error } = await supabase.from("Products").insert([product]);

      if (error) throw error;

      setMsg("Product added.");
      setLoading(false);
      navigate("/admin"); 
    } catch (err) {
      console.error(err);
      setMsg("Failed to add product.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard" style={{ paddingTop: 40 }}>
      <aside className="sidebar">
        <h2 className="logo">Admin</h2>
      </aside>

      <main className="main-content">
        <h1>Add New Product</h1>

        {msg && <p>{msg}</p>}

        <form onSubmit={handleSubmit} style={{ maxWidth: 720 }}>
          <label>Title</label>
          <input name="title" value={form.title} onChange={onChange} />

          <label>Price (USD)</label>
          <input name="price" value={form.price} onChange={onChange} />

          <label>Image URL</label>
          <input name="image" value={form.image} onChange={onChange} placeholder="https://..." />

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={onChange} rows={5} />

          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={loading}>Create Product</button>
            <button type="button" onClick={() => navigate("/admin")} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
}
