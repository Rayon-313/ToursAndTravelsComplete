import { useState, useEffect } from 'react';
import { api } from '../api';

export default function ManageFilters() {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', options: [] });
  const [optionsText, setOptionsText] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => { loadFilters(); }, []);

  const loadFilters = async () => {
    try { setFilters(await api.getFilters()); }
    catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setForm({ name: '', options: [] });
    setOptionsText('');
    setEditing(null); setShowModal(true);
  };

  const openEdit = (filter) => {
    setForm({ name: filter.name, options: filter.options || [] });
    setOptionsText((filter.options || []).join(', '));
    setEditing(filter); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this filter?')) return;
    try { await api.deleteFilter(id); showToast('Filter deleted', 'success'); loadFilters(); }
    catch (err) { showToast(err.message, 'error'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, options: optionsText.split(',').map((o) => o.trim()).filter(Boolean) };
      if (editing) { await api.updateFilter(editing._id, data); showToast('Filter updated!', 'success'); }
      else { await api.createFilter(data); showToast('Filter created!', 'success'); }
      setShowModal(false); loadFilters();
    } catch (err) { showToast(err.message, 'error'); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
      <div className="admin-header-row">
        <h2>Manage Filters</h2>
        <button className="btn btn-success" onClick={openCreate}>+ Add Filter</button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Filter Name</th><th>Options</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filters.map((f) => (
              <tr key={f._id}>
                <td><strong>{f.name}</strong></td>
                <td>{(f.options || []).join(', ')}</td>
                <td className="actions">
                  <button className="btn btn-warning" onClick={() => openEdit(f)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(f._id)}>Delete</button>
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
            <h2>{editing ? 'Edit Filter' : 'Add Filter'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Filter Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Country, Duration, Difficulty..." required />
              </div>
              <div className="form-group">
                <label>Options (comma separated)</label>
                <input value={optionsText} onChange={(e) => setOptionsText(e.target.value)} placeholder="Indonesia, Vietnam, Thailand, Nepal..." />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Filter' : 'Create Filter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
