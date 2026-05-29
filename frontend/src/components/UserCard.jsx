import { Check, UserMinus, UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { fileUrl } from '../utils/fileUrl.js';

export default function UserCard({ person, onAction, requestId, variant = 'search' }) {
  const sendRequest = async () => { await api.post(`/connections/request/${person._id}`); onAction?.(); };
  const cancelRequest = async () => { await api.delete(`/connections/request/${person._id}/cancel`); onAction?.(); };
  const removeConnection = async () => { await api.delete(`/connections/${person._id}/remove`); onAction?.(); };
  const accept = async () => { await api.patch(`/connections/${requestId}/accept`); onAction?.(); };
  const reject = async () => { await api.patch(`/connections/${requestId}/reject`); onAction?.(); };

  const renderButton = () => {
    if (variant === 'received') return <div className="inline-actions"><button className="primary-btn" onClick={accept}><Check size={16} /> Accept</button><button className="secondary-btn" onClick={reject}><X size={16} /> Reject</button></div>;
    if (variant === 'sent') return <button className="secondary-btn" onClick={cancelRequest}>Cancel Request</button>;
    if (variant === 'connected') return <button className="secondary-btn" onClick={removeConnection}><UserMinus size={16} /> Remove</button>;
    if (person.connectionStatus === 'connected') return <button className="secondary-btn" onClick={removeConnection}>Connected</button>;
    if (person.connectionStatus === 'request_sent') return <button className="secondary-btn" onClick={cancelRequest}>Request Sent</button>;
    if (person.connectionStatus === 'request_received') return <Link className="secondary-btn" to="/network">Respond</Link>;
    return <button className="primary-btn" onClick={sendRequest}><UserPlus size={16} /> Connect</button>;
  };

  return (
    <div className="card user-card">
      <img src={fileUrl(person.profileImage)} alt={person.fullName} />
      <div className="user-card-info">
        <Link to={`/profile/${person._id}`}><h3>{person.fullName}</h3></Link>
        <p>{person.profession}</p>
        <small>{person.location || person.company || person.college || 'Mini LinkedIn member'}</small>
      </div>
      {renderButton()}
    </div>
  );
}
