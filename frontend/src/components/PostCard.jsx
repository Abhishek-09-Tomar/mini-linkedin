import { Edit3, Heart, MessageCircle, Send, Share2, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { fileUrl } from '../utils/fileUrl.js';

export default function PostCard({ post, onChange, onDelete }) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');
  const [editFile, setEditFile] = useState(null);
  const isOwner = String(post.user?._id) === String(user?._id);
  const liked = post.likes?.some((id) => String(id) === String(user?._id));

  const replacePost = (updated) => onChange(updated);

  const like = async () => {
    const res = await api.post(`/posts/${post._id}/like`);
    replacePost(res.data);
  };

  const share = async () => {
    const res = await api.post(`/posts/${post._id}/share`);
    replacePost(res.data);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const res = await api.post(`/posts/${post._id}/comment`, { comment });
    setComment('');
    replacePost(res.data);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', editContent);
    if (editFile) formData.append('postMedia', editFile);
    const res = await api.patch(`/posts/${post._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setEditing(false);
    setEditFile(null);
    replacePost(res.data);
  };

  const remove = async () => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${post._id}`);
    onDelete(post._id);
  };

  return (
    <article className="card post-card">
      <div className="post-head">
        <Link to={`/profile/${post.user?._id}`}><img src={fileUrl(post.user?.profileImage)} alt={post.user?.fullName} /></Link>
        <div>
          <Link to={`/profile/${post.user?._id}`} className="post-author">{post.user?.fullName}</Link>
          <p>{post.user?.profession} • {new Date(post.createdAt).toLocaleString()}</p>
        </div>
        {isOwner && <div className="post-menu"><button onClick={() => setEditing(true)}><Edit3 size={16} /></button><button onClick={remove}><Trash2 size={16} /></button></div>}
      </div>

      {editing ? (
        <form className="edit-box" onSubmit={saveEdit}>
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
          <label className="file-chip">Replace media<input type="file" accept="image/*,video/*" onChange={(e) => setEditFile(e.target.files?.[0])} hidden /></label>
          <div className="inline-actions"><button className="primary-btn">Save</button><button type="button" className="secondary-btn" onClick={() => setEditing(false)}><X size={16} /> Cancel</button></div>
        </form>
      ) : (
        <>
          {post.content && <p className="post-text">{post.content}</p>}
          {post.mediaPath && post.mediaType === 'image' && <img className="post-media" src={fileUrl(post.mediaPath)} alt="post media" />}
          {post.mediaPath && post.mediaType === 'video' && <video className="post-media" src={fileUrl(post.mediaPath)} controls />}
        </>
      )}

      <div className="post-stats">
        <span>{post.likes?.length || 0} likes</span>
        <span>{post.comments?.length || 0} comments</span>
        <span>{post.shares?.length || 0} shares</span>
      </div>

      <div className="post-actions">
        <button className={liked ? 'active' : ''} onClick={like}><Heart size={18} /> Like</button>
        <button onClick={() => document.getElementById(`comment-${post._id}`)?.focus()}><MessageCircle size={18} /> Comment</button>
        <button onClick={share}><Share2 size={18} /> Share</button>
      </div>

      <div className="comments">
        {post.comments?.slice(-3).map((c) => (
          <div className="comment" key={c._id}>
            <img src={fileUrl(c.user?.profileImage)} alt={c.user?.fullName} />
            <div><strong>{c.user?.fullName}</strong><p>{c.comment}</p></div>
          </div>
        ))}
        <form onSubmit={submitComment} className="comment-form">
          <input id={`comment-${post._id}`} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." />
          <button><Send size={16} /></button>
        </form>
      </div>
    </article>
  );
}
