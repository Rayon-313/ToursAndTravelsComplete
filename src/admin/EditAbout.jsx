import { useState, useEffect } from 'react';
import { api } from '../api';

export default function EditAbout() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.getAbout().then((data) => { setAbout(data); setLoading(false); });
  }, []);

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updatePhilosophyCard = (index, field, value) => {
    const cards = [...(about.philosophyCards || [])];
    cards[index] = { ...cards[index], [field]: value };
    setAbout({ ...about, philosophyCards: cards });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateAbout(about);
      showToast('About page updated!', 'success');
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
      <div className="admin-header-row">
        <h2>Edit About Us</h2>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="admin-card">
        <h2>Hero Section</h2>
        <div className="form-group">
          <label>Heading</label>
          <input value={about.heading} onChange={(e) => setAbout({ ...about, heading: e.target.value })} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Description</h2>
        <div className="form-group">
          <label>Main Description</label>
          <textarea value={about.description} onChange={(e) => setAbout({ ...about, description: e.target.value })} rows={6} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Philosophy Cards</h2>
        {(about.philosophyCards || []).map((card, index) => (
          <div key={index} style={{ background: '#f8f9fa', padding: 15, borderRadius: 8, marginBottom: 15 }}>
            <div className="form-group">
              <label>Card {index + 1} - Title</label>
              <input value={card.title} onChange={(e) => updatePhilosophyCard(index, 'title', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Card {index + 1} - Text</label>
              <textarea value={card.text} onChange={(e) => updatePhilosophyCard(index, 'text', e.target.value)} rows={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
