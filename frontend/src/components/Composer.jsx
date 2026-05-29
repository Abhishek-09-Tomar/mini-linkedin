import { ImagePlus, Send } from 'lucide-react';
import { useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { fileUrl } from '../utils/fileUrl.js';

export default function Composer({ onCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('content', content);
    if (file) formData.append('postMedia', file);

    try {
      setLoading(true);
      const res = await api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setContent('');
      setFile(null);
      onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card composer" onSubmit={submit}>
      <div className="composer-row">
        <img src={fileUrl(user?.profileImage)} alt="profile" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share a professional update, achievement, idea, or learning..." />
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="composer-actions">
        <label className="file-chip">
          <ImagePlus size={18} /> {file ? file.name : 'Add image/video/GIF'}
          <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0])} hidden />
        </label>
        <button disabled={loading} className="primary-btn" type="submit"><Send size={17} /> {loading ? 'Posting...' : 'Post'}</button>
      </div>
    </form>
  );
}
