import { useState, useEffect } from 'react';
import { api, getAssetUrl } from '../api';

const emptyDestination = {
  name: '', title: '', description: '', duration: '', maxPeople: '', languages: '',
  location: '', price: '', priceValue: 0, rating: '4.9', difficulty: '', category: '',
  destinationType: 'normal', region: '', mainImage: '', cardImage: '',
  itinerary: [], status: 'active', featured: false, order: 0,
};

export default function ManageDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyDestination });
  const [mainFile, setMainFile] = useState(null);
  const [cardFile, setCardFile] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadDestinations(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(destinations.filter((d) =>
      d.name?.toLowerCase().includes(q) || d.title?.toLowerCase().includes(q) || d.destinationType?.includes(q)
    ));
  }, [search, destinations]);

  const loadDestinations = async () => {
    try {
      const data = await api.getAllDestinations();
      setDestinations(data);
      setFiltered(data);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setForm({ ...emptyDestination });
    setEditing(null);
    setMainFile(null);
    setCardFile(null);
    setShowModal(true);
  };

  const openEdit = (dest) => {
    setForm({
      name: dest.name || '', title: dest.title || '', description: dest.description || '',
      duration: dest.duration || '', maxPeople: dest.maxPeople || '', languages: dest.languages || '',
      location: dest.location || '', price: dest.price || '', priceValue: dest.priceValue || 0,
      rating: dest.rating || '4.9', difficulty: dest.difficulty || '', category: dest.category || '',
      destinationType: dest.destinationType || 'normal', region: dest.region || '',
      itinerary: dest.itinerary || [], status: dest.status || 'active', featured: dest.featured || false,
      order: dest.order || 0,
    });
    setEditing(dest);
    setMainFile(null);
    setCardFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    try {
      await api.deleteDestination(id);
      showToast('Destination deleted', 'success');
      loadDestinations();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const addItineraryDay = () => {
    const day = form.itinerary.length + 1;
    setForm({ ...form, itinerary: [...form.itinerary, { day, title: '', text: '' }] });
  };

  const updateItinerary = (index, field, value) => {
    const items = [...form.itinerary];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, itinerary: items });
  };

  const removeItinerary = (index) => {
    if (form.itinerary.length <= 1) return;
    const items = form.itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }));
    setForm({ ...form, itinerary: items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateDestination(editing._id, form, mainFile, cardFile);
        showToast('Destination updated!', 'success');
      } else {
        await api.createDestination(form, mainFile, cardFile);
        showToast('Destination created!', 'success');
      }
      setShowModal(false);
      loadDestinations();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const imageUrl = getAssetUrl;

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
      <div className="admin-header-row">
        <h2>Manage Destinations</h2>
        <button className="btn btn-success" onClick={openCreate}>+ Add Destination</button>
      </div>

      <div className="search-bar">
        <input placeholder="Search destinations..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d._id}>
                <td><img src={imageUrl(d.mainImage || d.cardImage)} alt="" /></td>
                <td>{d.title}</td>
                <td><span className={`status-badge ${d.destinationType === 'trek' ? 'status-active' : ''}`}>{d.destinationType}</span></td>
                <td>{d.duration}</td>
                <td><span className={`status-badge ${d.status === 'active' ? 'status-active' : 'status-inactive'}`}>{d.status}</span></td>
                <td className="actions">
                  <button className="btn btn-warning" onClick={() => openEdit(d)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(d._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-state">No destinations found</p>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>{editing ? 'Edit Destination' : 'Add Destination'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Destination Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Title (Display)</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="7 days & 6 nights" />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Rs. 3,999" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price Value (numeric)</label>
                  <input type="number" value={form.priceValue} onChange={(e) => setForm({ ...form, priceValue: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Destination Type</label>
                  <select value={form.destinationType} onChange={(e) => setForm({ ...form, destinationType: e.target.value })}>
                    <option value="normal">Normal Destination</option>
                    <option value="trek">Trek Destination</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Region</label>
                  <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="Indonesia, Nepal, Trek..." />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max People</label>
                  <input value={form.maxPeople} onChange={(e) => setForm({ ...form, maxPeople: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Languages</label>
                  <input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty</label>
                  <input value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Main Picture (Hero)</label>
                  <input type="file" accept="image/*" onChange={(e) => setMainFile(e.target.files[0])} />
                  {editing?.mainImage && <img src={imageUrl(editing.mainImage)} alt="" className="image-preview" />}
                </div>
                <div className="form-group">
                  <label>Card Picture</label>
                  <input type="file" accept="image/*" onChange={(e) => setCardFile(e.target.files[0])} />
                  {editing?.cardImage && <img src={imageUrl(editing.cardImage)} alt="" className="image-preview" />}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 20 }}>
                <label style={{ fontWeight: 700, fontSize: 16, color: '#1a3c5e' }}>Itinerary</label>
                {form.itinerary.map((item, index) => (
                  <div className="itinerary-day" key={index}>
                    <h4>Day {item.day}</h4>
                    <button type="button" className="remove-btn" onClick={() => removeItinerary(index)}>Remove</button>
                    <div className="form-group">
                      <label>Title</label>
                      <input value={item.title} onChange={(e) => updateItinerary(index, 'title', e.target.value)} placeholder="Arrive in Bali" />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea value={item.text} onChange={(e) => updateItinerary(index, 'text', e.target.value)} rows={2} />
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addItineraryDay} style={{ marginTop: 10 }}>+ Add More Itinerary</button>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Update Destination' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
