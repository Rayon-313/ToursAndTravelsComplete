import { useState, useEffect } from 'react';
import { api } from '../api';

export default function EditContact() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.getContact().then((data) => { setContact(data); setLoading(false); });
  }, []);

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateHelpTopic = (index, field, value) => {
    const topics = [...(contact.helpTopics || [])];
    topics[index] = { ...topics[index], [field]: value };
    setContact({ ...contact, helpTopics: topics });
  };

  const updateFaq = (index, field, value) => {
    const faqs = [...(contact.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: value };
    setContact({ ...contact, faqs });
  };

  const addFaq = () => {
    setContact({ ...contact, faqs: [...(contact.faqs || []), { question: '', answer: '' }] });
  };

  const removeFaq = (index) => {
    const faqs = contact.faqs.filter((_, i) => i !== index);
    setContact({ ...contact, faqs });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateContact(contact);
      showToast('Contact page updated!', 'success');
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
      <div className="admin-header-row">
        <h2>Edit Contact / Help Page</h2>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="admin-card">
        <h2>Contact Information</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>Address</label>
          <input value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Help Topics</h2>
        {(contact.helpTopics || []).map((topic, index) => (
          <div key={index} style={{ background: '#f8f9fa', padding: 15, borderRadius: 8, marginBottom: 12 }}>
            <div className="form-row">
              <div className="form-group">
                <label>Topic {index + 1} - Title</label>
                <input value={topic.title} onChange={(e) => updateHelpTopic(index, 'title', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={topic.text} onChange={(e) => updateHelpTopic(index, 'text', e.target.value)} rows={2} />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>FAQ Section</h2>
        {(contact.faqs || []).map((faq, index) => (
          <div key={index} style={{ background: '#f8f9fa', padding: 15, borderRadius: 8, marginBottom: 12, position: 'relative' }}>
            <button type="button" className="remove-btn" onClick={() => removeFaq(index)} style={{ position: 'absolute', top: 10, right: 10 }}>Remove</button>
            <div className="form-group">
              <label>Question {index + 1}</label>
              <input value={faq.question} onChange={(e) => updateFaq(index, 'question', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Answer</label>
              <textarea value={faq.answer} onChange={(e) => updateFaq(index, 'answer', e.target.value)} rows={2} />
            </div>
          </div>
        ))}
        <button className="btn btn-secondary" onClick={addFaq}>+ Add FAQ</button>
      </div>
    </div>
  );
}
