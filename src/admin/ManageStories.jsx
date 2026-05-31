import { useState, useEffect } from 'react';
import { api, getAssetUrl } from '../api';

export default function ManageStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', date: '', authorName: '', price: '', stats: [] });
  const [imageFile, setImageFile] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadStories(); }, []);

  const loadStories = async () => {
    try { setStories(await api.getStories()); }
    catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setForm({ title: '', description: '', date: '', authorName: '', price: '', stats: [] });
    setEditing(null); setImageFile(null); setShowModal(true);
  };

  const openEdit = (story) => {
    setForm({ title: story.title || '', description: story.description || '', date: story.date || '', authorName: story.authorName || '', price: story.price || '', stats: story.stats || [] });
    setEditing(story); setImageFile(null); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    try { await api.deleteStory(id); showToast('Story deleted', 'success'); loadStories(); }
    catch (err) { showToast(err.message, 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.updateStory(editing._id, form, imageFile); showToast('Story updated!', 'success'); }
      else { await api.createStory(form, imageFile); showToast('Story created!', 'success'); }
      setShowModal(false); loadStories();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const imageUrl = getAssetUrl;

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
      <div className="admin-header-row">
        <h2>Manage Stories</h2>
        <button className="btn btn-success" onClick={openCreate}>+ Add Story</button>
      </div>
      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Title</th><th>Date</th><th>Author</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {stories.map((s) => (
              <tr key={s._id}>
                <td>{s.image ? <img src={imageUrl(s.image)} alt="" /> : '—'}</td>
                <td>{s.title}</td>
                <td>{s.date}</td>
                <td>{s.authorName || '—'}</td>
                <td className="actions">
                  <button className="btn btn-warning" onClick={() => openEdit(s)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>{editing ? 'Edit Story' : 'Add Story'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Oct 2025" />
                </div>
                <div className="form-group">
                  <label>Author Name</label>
                  <input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Story Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                  {editing?.image && <img src={imageUrl(editing.image)} alt="" className="image-preview" />}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Story' : 'Create Story'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
