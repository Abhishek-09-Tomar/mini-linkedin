import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import UserCard from '../components/UserCard.jsx';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (query = q) => {
    setLoading(true);
    const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => { load(params.get('q') || ''); }, [params]);

  const submit = (e) => {
    e.preventDefault();
    setParams({ q });
  };

  return (
    <main className="container narrow">
      <section className="card search-panel">
        <h1>Search Users</h1>
        <form className="big-search" onSubmit={submit}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, profession, skill, college, company, location" />
          <button className="primary-btn">Search</button>
        </form>
      </section>
      {loading && <div className="card">Searching...</div>}
      {!loading && users.length === 0 && <div className="card">No users found.</div>}
      {users.map((person) => <UserCard key={person._id} person={person} onAction={() => load(q)} />)}
    </main>
  );
}
