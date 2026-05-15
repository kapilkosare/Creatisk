import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Sparkles, ArrowRight, Info, CheckCircle, XCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('kapil.webfoxtech@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if Firebase is configured
    if (auth && auth.app) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('disconnected');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (connectionStatus !== 'connected') {
      setError('Firebase is not configured properly in your .env file.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError(`Login Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset link sent to your email!');
    } catch (err) {
      setError(`Reset Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-main)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Orbs */}
      <div className="orb orb-purple" style={{ top: '10%', right: '10%', width: '500px', height: '500px', opacity: 0.15 }} />
      <div className="orb orb-pink" style={{ bottom: '10%', left: '10%', width: '400px', height: '400px', opacity: 0.1 }} />

      <div className="glass-strong" style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '4rem 3rem', 
        borderRadius: '40px',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <img src="/logo-creatiks_black.png" alt="Creatisk" style={{ height: '63px', width: 'auto', marginBottom: '1.5rem' }} />
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.2)',
            color: '#FF3366', padding: '1rem', borderRadius: '16px', marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ 
            background: 'rgba(190, 242, 100, 0.1)', border: '1px solid rgba(190, 242, 100, 0.2)',
            color: '#BEF264', padding: '1rem', borderRadius: '16px', marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}>
            <Info size={16}/> {message}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input
              type="email"
              className="input-glass"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ paddingLeft: '3.5rem', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input
              type="password"
              className="input-glass"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingLeft: '3.5rem', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
            <button 
              type="button"
              onClick={handleForgotPassword}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
              className="hover-link"
            >
              Forgot password?
            </button>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || connectionStatus !== 'connected'}
            style={{ 
              width: '100%', justifyContent: 'center', padding: '1.2rem', 
              fontSize: '1.1rem', fontWeight: 700, marginTop: '1rem',
              opacity: connectionStatus !== 'connected' ? 0.5 : 1
            }}
          >
            {loading ? 'Processing...' : (
              <>Access Dashboard <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} /></>
            )}
          </button>
        </form>
        
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s' }} className="hover-link">
            Return to website
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
