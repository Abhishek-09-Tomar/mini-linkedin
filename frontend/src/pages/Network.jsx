import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import UserCard from '../components/UserCard.jsx';

export default function Network() {
  const [data, setData] = useState({ received: [], sent: [], connectedUsers: [] });

  const load = () => api.get('/connections').then((res) => setData(res.data));
  useEffect(() => { load(); }, []);

  return (
    <main className="container network-page">
      <section className="card"><h1>My Network</h1><p>Manage received requests, sent requests, and professional connections.</p></section>

      <h2>Received Requests</h2>
      {data.received.length === 0 && <div className="card">No received requests.</div>}
      {data.received.map((req) => <UserCard key={req._id} person={req.sender} requestId={req._id} variant="received" onAction={load} />)}

      <h2>Sent Requests</h2>
      {data.sent.length === 0 && <div className="card">No sent requests.</div>}
      {data.sent.map((req) => <UserCard key={req._id} person={req.receiver} variant="sent" onAction={load} />)}

      <h2>Connections</h2>
      {data.connectedUsers.length === 0 && <div className="card">No connections yet.</div>}
      {data.connectedUsers.map((person) => <UserCard key={person._id} person={person} variant="connected" onAction={load} />)}
    </main>
  );
}
