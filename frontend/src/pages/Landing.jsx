import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="landing">
      <section className="hero-card">
        <div className="brand big"><img src="/logo.svg" alt="logo" /><span>Mini LinkedIn</span></div>
        <h1>Build your professional network with a modern MERN app.</h1>
        <p>This version converts your PHP + MySQL project into React, Node.js, Express, MongoDB, JWT authentication, media uploads, posts, comments, likes, notifications, and connections.</p>
        <div className="inline-actions">
          <Link className="primary-btn" to="/signup">Create Account</Link>
          <Link className="secondary-btn" to="/login">Login</Link>
        </div>
      </section>
    </main>
  );
}
