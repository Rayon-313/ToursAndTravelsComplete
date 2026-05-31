import { useState, useEffect } from 'react';
import { api, getAssetUrl } from '../api';

export default function ManageGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', category: '', order: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadGallery(); }, []);

  const loadGallery = async () => {
    try { setItems(await api.getGallery()); }
    catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setForm({ title: '', category: '', order: 0 });
    setEditing(null); setImageFile(null); setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({ title: item.title || '', category: item.category || '', order: item.order || 0 });
    setEditing(item); setImageFile(null); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery image?')) return;
    try { await api.deleteGalleryItem(id); showToast('Image deleted', 'success'); loadGallery(); }
    catch (err) { showToast(err.message, 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.updateGalleryItem(editing._id, form, imageFile); showToast('Gallery item updated!', 'success'); }
      else { await api.createGalleryItem(form, imageFile); showToast('Gallery item created!', 'success'); }
      setShowModal(false); loadGallery();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const imageUrl = getAssetUrl;

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
      <div className="admin-header-row">
        <h2>Manage Gallery</h2>
        <button className="btn btn-success" onClick={openCreate}>+ Upload Image</button>
      </div>
      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Title</th><th>Category</th><th>Order</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td><img src={imageUrl(item.image)} alt="" /></td>
                <td>{item.title || '—'}</td>
                <td>{item.category || '—'}</td>
                <td>{item.order}</td>
                <td className="actions">
                  <button className="btn btn-warning" onClick={() => openEdit(item)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
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
            <h2>{editing ? 'Edit Gallery Item' : 'Upload Gallery Image'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required={!editing} />
                {editing?.image && <img src={imageUrl(editing.image)} alt="" className="image-preview" />}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Title (optional)</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category/Tag (optional)</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
