import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [otpData, setOtpData] = useState(null);
  const [otp, setOtp] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.userId) setOtpData(err.response.data);
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/verify-otp', { userId: otpData.userId, otp });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed.');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy"><img src="/logo.svg" /><h1>Welcome back.</h1><p>Login and continue building your professional network.</p></div>
        <form onSubmit={otpData ? verify : submit} className="auth-form-modern">
          <h2>{otpData ? 'Verify OTP' : 'Login'}</h2>
          {error && <p className="alert">{error}</p>}
          {otpData?.devOtp && <p className="dev-otp">Development OTP: <strong>{otpData.devOtp}</strong></p>}
          {!otpData ? (
            <>
              <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required /></label>
              <label>Password<input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required /></label>
            </>
          ) : (
            <label>OTP<input value={otp} onChange={(e) => setOtp(e.target.value)} required /></label>
          )}
          <button className="primary-btn">{otpData ? 'Verify OTP' : 'Login'}</button>
          <p>New here? <Link to="/signup">Create account</Link></p>
        </form>
      </section>
    </main>
  );
}
