import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@gmail.com' && password === '123') {
      onLogin('admin', { name: 'System Admin', email });
    } else if (email === 'doctor@gmail.com' && password === '123') {
      onLogin('doctor', { name: 'Dr. John Doe', email });
    } else {
      setError('Invalid credentials. Use admin@gmail.com / 123');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '3.5rem 3rem' }}>
        <h1 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '3rem', 
          textAlign: 'center', 
          marginBottom: '0.5rem',
          color: '#1d1d1f'
        }}>Medical Vault</h1>
        
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Professional record management
        </p>

        {error && (
          <div style={{ padding: '1rem', background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: '8px', color: '#cf1322', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6e6e73' }}>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="e.g. admin@gmail.com"
              required 
              style={{ padding: '1.25rem', borderRadius: '14px' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6e6e73' }}>Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
              style={{ padding: '1.25rem', borderRadius: '14px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', fontSize: '1.1rem' }}>
            Login to System
          </button>
        </form>

        <div style={{ marginTop: '4rem', padding: '1.5rem 0 0', borderTop: '1px solid #f2f2f7', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', color: '#86868b', marginBottom: '1rem' }}>DEMO ACCESS</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#86868b' }}>
            <div>Admin: admin@gmail.com / 123</div>
            <div style={{ width: '1px', background: '#d2d2d7' }}></div>
            <div>Doctor: doctor@gmail.com / 123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
