import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useConfirm } from '../context/ConfirmContext';
import './ManageTestimonials.css';

export default function ManageTestimonials() {
  const { confirm } = useConfirm();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [editRating, setEditRating] = useState(5);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setMessage('Could not load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const addTestimonial = async () => {
    if (!newName.trim() || !newMessage.trim()) return;
    try {
      const { error } = await supabase
        .from('Testimonials')
        .insert([{ name: newName.trim(), message: newMessage.trim(), rating: newRating, is_active: false }]);

      if (error) throw error;
      setMessage('Testimonial added successfully.');
      setNewName('');
      setNewMessage('');
      setNewRating(5);
      await fetchTestimonials();
    } catch (err) {
      console.error(err);
      setMessage('Failed to add testimonial.');
    }
  };

  const toggleActive = async (id, currentActive) => {
    try {
      const { error } = await supabase
        .from('Testimonials')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) throw error;
      setMessage(`Testimonial ${!currentActive ? 'activated' : 'deactivated'}.`);
      await fetchTestimonials();
    } catch (err) {
      console.error(err);
      setMessage('Failed to update testimonial.');
    }
  };

  const deleteTestimonial = async (id) => {
    if (!await confirm('Delete this testimonial?')) return;
    try {
      const { error } = await supabase
        .from('Testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage('Testimonial deleted.');
      await fetchTestimonials();
    } catch (err) {
      console.error(err);
      setMessage('Failed to delete testimonial.');
    }
  };

  const startEdit = (testimonial) => {
    setEditingId(testimonial.id);
    setEditName(testimonial.name);
    setEditMessage(testimonial.message);
    setEditRating(testimonial.rating);
  };

  const saveEdit = async () => {
    if (!editName.trim() || !editMessage.trim()) return;
    try {
      const { error } = await supabase
        .from('Testimonials')
        .update({ name: editName.trim(), message: editMessage.trim(), rating: editRating })
        .eq('id', editingId);

      if (error) throw error;
      setMessage('Testimonial updated.');
      setEditingId(null);
      setEditName('');
      setEditMessage('');
      setEditRating(5);
      await fetchTestimonials();
    } catch (err) {
      console.error(err);
      setMessage('Failed to update testimonial.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditMessage('');
    setEditRating(5);
  };

  const renderStars = (rating, isInteractive = false, onChange = null) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''} ${isInteractive ? 'interactive' : ''}`}
            onClick={isInteractive ? () => onChange(star) : undefined}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="manage-testimonials">
      <h1>Manage Testimonials</h1>

      <div className="add-testimonial">
        <input
          type="text"
          placeholder="Customer name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <textarea
          placeholder="Testimonial message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows="3"
        />
        <div className="rating-input">
          <label>Rating:</label>
          {renderStars(newRating, true, setNewRating)}
        </div>
        <button className="btn primary" onClick={addTestimonial}>Add Testimonial</button>
      </div>

      {message && <div className="notice">{message}</div>}

      <div className="testimonials-list">
        {loading ? (
          <div className="loading">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="empty">No testimonials found.</div>
        ) : (
          testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-item">
              {editingId === testimonial.id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Name"
                  />
                  <textarea
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    placeholder="Message"
                    rows="3"
                  />
                  <div className="rating-input">
                    <label>Rating:</label>
                    {renderStars(editRating, true, setEditRating)}
                  </div>
                  <button className="btn small" onClick={saveEdit}>Save</button>
                  <button className="btn small outline" onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div className="view-mode">
                  <div className="testimonial-header">
                    <span className="name">{testimonial.name}</span>
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="message">{testimonial.message}</p>
                  <div className="actions">
                    <button
                      className={`btn small ${testimonial.is_active ? 'success' : 'outline'}`}
                      onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                    >
                      {testimonial.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button className="btn small outline" onClick={() => startEdit(testimonial)}>Edit</button>
                    <button className="btn small danger" onClick={() => deleteTestimonial(testimonial.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
