import { useConfirm } from '../context/ConfirmContext';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AdminDashboard.css";

export default function RestoreProducts() {
  const { confirm } = useConfirm();

  const navigate = useNavigate();
  const [trash, setTrash] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("Products").select("*").eq("deleted", true);
      if (error) throw error;
      setTrash(data || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed loading trash.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const restore = async (id) => {
    try {
      const { error } = await supabase.from("Products").update({ deleted: false }).eq("id", id);
      if (error) throw error;
      setMsg("Product restored.");
      fetchTrash();
    } catch (err) {
      console.error(err);
      setMsg("Restore failed.");
    }
  };

  const hardDelete = async (id) => {
    if (!await confirm("Permanently delete this product? This cannot be undone.")) return;
    try {
      const { error } = await supabase.from("Products").delete().eq("id", id);
      if (error) throw error;
      setMsg("Product permanently deleted.");
      fetchTrash();
    } catch (err) {
      console.error(err);
      setMsg("Permanent delete failed.");
    }
  };

  return (
    <div className="admin-dashboard" style={{ paddingTop: 40 }}>
      <aside className="sidebar">
        <h2 className="logo">Admin</h2>
      </aside>

      <main className="main-content">
        <h1>Trash / Deleted Products</h1>

        {msg && <p>{msg}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : trash.length === 0 ? (
          <p>Trash is empty.</p>
        ) : (
          <div className="admin-grid">
            {trash.map(item => (
              <div className="admin-card" key={item.id}>
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="muted">{item.category}</p>
                <p className="price">${item.price}</p>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => restore(item.id)}>Restore</button>
                  <button className="danger" onClick={() => hardDelete(item.id)}>Delete Permanently</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 20 }}>
          <button className='back-btn' onClick={() => navigate("/admin")}>Back to dashboard</button>
        </div>
      </main>
    </div>
  );
}
