import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import Composer from '../components/Composer.jsx';
import PostCard from '../components/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fileUrl } from '../utils/fileUrl.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = () => api.get('/posts/feed').then((res) => setPosts(res.data)).finally(() => setLoading(false));

  useEffect(() => { fetchFeed(); }, []);

  const updatePost = (updated) => setPosts((prev) => prev.map((p) => p._id === updated._id ? updated : p));
  const deletePost = (id) => setPosts((prev) => prev.filter((p) => p._id !== id));

  return (
    <main className="container dashboard-grid">
      <aside className="card profile-summary">
        <div className="cover" style={user?.coverImage ? { backgroundImage: `url(${fileUrl(user.coverImage)})` } : {}} />
        <img className="profile-large" src={fileUrl(user?.profileImage)} alt={user?.fullName} />
        <h2>{user?.fullName}</h2>
        <p className="muted">{user?.profession}</p>
        <p>{user?.professionalSummary}</p>
        <Link className="secondary-btn" to={`/profile/${user?._id}`}>View Full Profile</Link>
        <Link className="primary-btn" to="/edit-profile">Edit Profile</Link>
      </aside>

      <section className="feed-column">
        <Composer onCreated={(post) => setPosts([post, ...posts])} />
        {loading && <div className="card">Loading feed...</div>}
        {!loading && posts.length === 0 && <div className="card">No posts yet. Create the first professional update.</div>}
        {posts.map((post) => <PostCard key={post._id} post={post} onChange={updatePost} onDelete={deletePost} />)}
      </section>
    </main>
  );
}
