import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user.fullName || '', profession: user.profession || '', professionalSummary: user.professionalSummary || '',
    about: user.about || '', skills: user.skills?.join(', ') || '', education: user.education || '', experience: user.experience || '',
    college: user.college || '', company: user.company || '', location: user.location || ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (profileImage) data.append('profileImage', profileImage);
    if (coverImage) data.append('coverImage', coverImage);

    try {
      const res = await api.patch('/users/me/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(res.data);
      localStorage.setItem('miniLinkedInUser', JSON.stringify(res.data));
      navigate(`/profile/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed.');
    }
  };

  return (
    <main className="container narrow">
      <form className="card auth-form-modern grid-form" onSubmit={submit}>
        <h1>Edit Profile</h1>
        {error && <p className="alert full">{error}</p>}
        <label className="full">Full Name<input name="fullName" value={form.fullName} onChange={change} required /></label>
        <label>Profession<input name="profession" value={form.profession} onChange={change} required /></label>
        <label>Location<input name="location" value={form.location} onChange={change} /></label>
        <label>College<input name="college" value={form.college} onChange={change} /></label>
        <label>Company<input name="company" value={form.company} onChange={change} /></label>
        <label className="full">Professional Summary<textarea name="professionalSummary" value={form.professionalSummary} onChange={change} required /></label>
        <label className="full">About<textarea name="about" value={form.about} onChange={change} /></label>
        <label className="full">Skills<input name="skills" value={form.skills} onChange={change} placeholder="React, Node, MongoDB" /></label>
        <label className="full">Education<textarea name="education" value={form.education} onChange={change} /></label>
        <label className="full">Experience<textarea name="experience" value={form.experience} onChange={change} /></label>
        <label>Profile Image<input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files?.[0])} /></label>
        <label>Cover Image<input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0])} /></label>
        <button className="primary-btn full">Save Profile</button>
      </form>
    </main>
  );
}
