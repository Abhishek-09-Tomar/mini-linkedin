import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import PostCard from '../components/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fileUrl } from '../utils/fileUrl.js';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const load = () => api.get(`/users/${id}`).then((res) => { setProfile(res.data); setPosts(res.data.posts); });
  useEffect(() => { load(); }, [id]);

  if (!profile) return <main className="container"><div className="card">Loading profile...</div></main>;
  const { user, connectionCount, connectionStatus } = profile;
  const isMe = String(currentUser?._id) === String(user._id);

  const sendConnect = async () => { await api.post(`/connections/request/${user._id}`); load(); };
  const removeConnection = async () => { await api.delete(`/connections/${user._id}/remove`); load(); };

  return (
    <main className="container profile-layout">
      <section className="card profile-hero">
        <div className="cover tall" style={user.coverImage ? { backgroundImage: `url(${fileUrl(user.coverImage)})` } : {}} />
        <div className="profile-hero-body">
          <img className="profile-xl" src={fileUrl(user.profileImage)} alt={user.fullName} />
          <div>
            <h1>{user.fullName}</h1>
            <p className="muted">{user.profession}</p>
            <p>{user.location} {user.company && `• ${user.company}`}</p>
            <strong>{connectionCount} connections</strong>
          </div>
          <div className="profile-actions">
            {isMe && <Link className="primary-btn" to="/edit-profile">Edit Profile</Link>}
            {!isMe && connectionStatus === 'none' && <button className="primary-btn" onClick={sendConnect}>Connect</button>}
            {!isMe && connectionStatus === 'connected' && <button className="secondary-btn" onClick={removeConnection}>Remove Connection</button>}
            {!isMe && connectionStatus === 'request_sent' && <button className="secondary-btn" disabled>Request Sent</button>}
            {!isMe && connectionStatus === 'request_received' && <Link className="secondary-btn" to="/network">Respond in Network</Link>}
          </div>
        </div>
      </section>

      <section className="profile-two-col">
        <div className="card"><h2>About</h2><p>{user.about || user.professionalSummary}</p></div>
        <div className="card"><h2>Skills</h2><div className="chips">{user.skills?.map((s) => <span key={s}>{s}</span>)}</div></div>
        <div className="card"><h2>Education</h2><p>{user.education || user.college || 'Not added yet.'}</p></div>
        <div className="card"><h2>Experience</h2><p>{user.experience || user.company || 'Not added yet.'}</p></div>
      </section>

      <section className="feed-column centered-feed">
        <h2>{isMe ? 'Your Posts' : `${user.fullName}'s Posts`}</h2>
        {posts.length === 0 && <div className="card">No posts yet.</div>}
        {posts.map((post) => <PostCard key={post._id} post={post} onChange={(updated) => setPosts(posts.map((p) => p._id === updated._id ? updated : p))} onDelete={(postId) => setPosts(posts.filter((p) => p._id !== postId))} />)}
      </section>
    </main>
  );
}
