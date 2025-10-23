import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
import './AdminProductDetail.css';

export default function AdminProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        toast.error('Failed to load product');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (

        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>

    );
  }

  if (!product) {
    return (
 
        <div className="admin-error">Product not found</div>

    );
  }

  return (

      <div className="admin-product-detail">
        <div className="admin-detail-header">
          <h2>Product Details</h2>
          <button 
            className="back-btn"
            onClick={() => navigate('/admin')}
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="admin-detail-content">
          <div className="admin-detail-image">
            <img src={product.image} alt={product.title || product.name} />
          </div>

          <div className="admin-detail-info">
            <div className="info-row">
              <label>Name</label>
              <p>{product.title || product.name}</p>
            </div>

            <div className="info-row">
              <label>Price</label>
              <p>₦{Number(product.price).toLocaleString()}</p>
            </div>

            <div className="info-row">
              <label>Category</label>
              <p>{product.category}</p>
            </div>

            <div className="info-row">
              <label>Description</label>
              <p className="description">{product.description}</p>
            </div>

            <div className="admin-actions">
              <button 
                className="delete-btn"
                onClick={() => {
                  // Add your delete logic here
                  toast.info('Product moved to trash');
                  navigate('/admin');
                }}
              >
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      </div>

  );
}