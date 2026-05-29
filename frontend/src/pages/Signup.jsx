import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const initial = {
  fullName: '', mobile: '', email: '', password: '', profession: '', professionalSummary: '',
  about: '', skills: '', college: '', company: '', location: '', education: '', experience: ''
};

export default function Signup() {
  const [form, setForm] = useState(initial);
  const [profileImage, setProfileImage] = useState(null);
  const [otpData, setOtpData] = useState(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (profileImage) data.append('profileImage', profileImage);

    try {
      const res = await api.post('/auth/register', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setOtpData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', { userId: otpData.userId, otp });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed.');
    }
  };

  return (
    <main className="auth-page wide">
      <section className="auth-panel wide-panel">
        <div className="auth-copy"><img src="/logo.svg" /><h1>Create your professional profile.</h1><p>Signup with secure password hashing, searchable profile data, and development OTP verification.</p></div>
        {otpData ? (
          <form className="auth-form-modern" onSubmit={verify}>
            <h2>Verify OTP</h2>
            {otpData.devOtp && <p className="dev-otp">Development OTP: <strong>{otpData.devOtp}</strong></p>}
            {error && <p className="alert">{error}</p>}
            <label>OTP<input value={otp} onChange={(e) => setOtp(e.target.value)} required /></label>
            <button className="primary-btn">Verify & Continue</button>
          </form>
        ) : (
          <form className="auth-form-modern grid-form" onSubmit={submit}>
            <h2>Signup</h2>
            {error && <p className="alert full">{error}</p>}
            <label className="full">Full Name<input name="fullName" value={form.fullName} onChange={change} required /></label>
            <label>Mobile<input name="mobile" value={form.mobile} onChange={change} required /></label>
            <label>Email<input name="email" type="email" value={form.email} onChange={change} required /></label>
            <label>Password<input name="password" type="password" minLength="8" value={form.password} onChange={change} required /></label>
            <label>Profession<input name="profession" value={form.profession} onChange={change} required /></label>
            <label className="full">Professional Summary<textarea name="professionalSummary" value={form.professionalSummary} onChange={change} required /></label>
            <label className="full">About<textarea name="about" value={form.about} onChange={change} /></label>
            <label>Skills<input name="skills" value={form.skills} onChange={change} placeholder="React, Node, MongoDB" /></label>
            <label>Location<input name="location" value={form.location} onChange={change} /></label>
            <label>College<input name="college" value={form.college} onChange={change} /></label>
            <label>Company<input name="company" value={form.company} onChange={change} /></label>
            <label className="full">Education<textarea name="education" value={form.education} onChange={change} /></label>
            <label className="full">Experience<textarea name="experience" value={form.experience} onChange={change} /></label>
            <label className="full">Profile Image<input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files?.[0])} /></label>
            <button className="primary-btn full">Signup & Verify OTP</button>
            <p className="full">Already have an account? <Link to="/login">Login</Link></p>
          </form>
        )}
      </section>
    </main>
  );
}
