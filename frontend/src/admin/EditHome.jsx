import { useState, useEffect } from 'react';
import { api } from '../api';

export default function EditHome() {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.getHome().then((data) => { setHome(data); setLoading(false); });
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateHome(home);
      showToast('Home page updated!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
      <div className="admin-header-row">
        <h2>Edit Home Page</h2>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="admin-card">
        <h2>Hero Section</h2>
        <div className="form-group">
          <label>Hero Heading</label>
          <input value={home.heroHeading} onChange={(e) => setHome({ ...home, heroHeading: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Hero Subtext</label>
          <input value={home.heroSubtext} onChange={(e) => setHome({ ...home, heroSubtext: e.target.value })} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Section Headings</h2>
        <div className="form-group">
          <label>Trending Destinations Heading</label>
          <input value={home.sections?.trendingHeading || ''} onChange={(e) => setHome({ ...home, sections: { ...home.sections, trendingHeading: e.target.value } })} />
        </div>
        <div className="form-group">
          <label>Choose Destinations Heading</label>
          <input value={home.sections?.chooseHeading || ''} onChange={(e) => setHome({ ...home, sections: { ...home.sections, chooseHeading: e.target.value } })} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Offer Text</h2>
        <div className="form-group">
          <label>Offer Banner Text</label>
          <input value={home.offerText || ''} onChange={(e) => setHome({ ...home, offerText: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
