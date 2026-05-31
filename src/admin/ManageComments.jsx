import { useState, useEffect } from 'react';
import { api } from '../api';

export default function ManageComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('');
  const [toast, setToast] = useState(null);
  const [newComment, setNewComment] = useState({ username: '', comment: '', starRating: 5 });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { loadComments(); }, [ratingFilter]);

  const loadComments = async () => {
    try {
      const data = await api.getComments(ratingFilter || undefined);
      setComments(data);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try { await api.deleteComment(id); showToast('Comment deleted', 'success'); loadComments(); }
    catch (err) { showToast(err.message, 'error'); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await api.createComment(newComment);
      showToast('Comment added!', 'success');
      setShowAdd(false);
      setNewComment({ username: '', comment: '', starRating: 5 });
      loadComments();
    } catch (err) { showToast(err.message, 'error'); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.message}</div>}
      <div className="admin-header-row">
        <h2>Manage Comments</h2>
        <button className="btn btn-success" onClick={() => setShowAdd(true)}>+ Add Comment</button>
      </div>

      <div className="admin-card">
        <div className="form-row" style={{ alignItems: 'end', maxWidth: 400 }}>
          <div className="form-group">
            <label>Filter by Rating</label>
            <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
              <option value="">All Ratings</option>
              <option value="1">⭐ 1 Star</option>
              <option value="2">⭐ 2 Stars</option>
              <option value="3">⭐ 3 Stars</option>
              <option value="4">⭐ 4 Stars</option>
              <option value="5">⭐ 5 Stars</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Username</th><th>Comment</th><th>Rating</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c._id}>
                <td><strong>{c.username}</strong></td>
                <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.comment}</td>
                <td>{'⭐'.repeat(c.starRating)}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button className="btn btn-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {comments.length === 0 && <p className="empty-state">No comments found</p>}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>
            <h2>Add Comment</h2>
            <form onSubmit={handleAddComment}>
              <div className="form-group">
                <label>Username</label>
                <input value={newComment.username} onChange={(e) => setNewComment({ ...newComment, username: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea value={newComment.comment} onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })} rows={3} required />
              </div>
              <div className="form-group">
                <label>Star Rating</label>
                <select value={newComment.starRating} onChange={(e) => setNewComment({ ...newComment, starRating: Number(e.target.value) })}>
                  {[1,2,3,4,5].map((n) => <option key={n} value={n}>{'⭐'.repeat(n)}</option>)}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Comment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
