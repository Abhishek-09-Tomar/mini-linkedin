import { Bell, LogOut, Network, Search, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { fileUrl } from '../utils/fileUrl.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [q, setQ] = useState('');
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/notifications').then((res) => setUnread(res.data.unreadCount)).catch(() => {});
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="topbar">
      <Link className="brand" to="/dashboard">
        <img src="/logo.svg" alt="logo" />
        <span>Mini LinkedIn</span>
      </Link>

      <form className="nav-search" onSubmit={submitSearch}>
        <Search size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people, skills, company..." />
      </form>

      <nav className="nav-links">
        <NavLink to="/dashboard">Feed</NavLink>
        <NavLink to="/network"><Network size={17} /> Network</NavLink>
        <NavLink to={`/profile/${user?._id}`}><UserRound size={17} /> Profile</NavLink>
        <button className="icon-btn" onClick={() => api.patch('/notifications/read').then(() => setUnread(0))} title="Mark notifications read">
          <Bell size={19} /> {unread > 0 && <span className="badge">{unread}</span>}
        </button>
        <img className="nav-avatar" src={fileUrl(user?.profileImage)} alt={user?.fullName} />
        <button className="logout-btn" onClick={logout}><LogOut size={17} /> Logout</button>
      </nav>
    </header>
  );
}
