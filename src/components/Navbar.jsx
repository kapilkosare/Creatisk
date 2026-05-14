import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Sparkles, Menu, X, Globe, MessageCircle, Share2, Send, ArrowUpRight } from 'lucide-react';
import EditableText from './EditableText';
import { usePageContent } from '../hooks/usePageContent';

const Navbar = ({ user }) => {
  const { content } = usePageContent('home', {
    navTalk: "Let's talk",
    navLogo: 'Creatisk.'
  });
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--nav-border)' : 'none',
        padding: scrolled ? '1rem 0' : '1.5rem 0',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: scrolled ? '1rem' : '1.5rem' }}>
            <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/logo-creatiks_black.png" alt="Creatisk" style={{ height: scrolled ? '40px' : '48px', width: 'auto', transition: 'all 0.4s ease' }} />
            </Link>

            {user && (
              <div style={{
                background: 'rgba(190, 242, 100, 0.1)',
                border: '1px solid rgba(190, 242, 100, 0.2)',
                color: '#BEF264',
                padding: '0.4rem 0.8rem',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#BEF264', boxShadow: '0 0 10px #BEF264' }} />
                Admin Mode
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button 
              className="btn-talk"
              onClick={() => navigate('/contact')}
              style={{
                background: 'var(--primary-gradient)',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(255, 51, 102, 0.3)'
              }}
            >
              <EditableText pageId="home" fieldId="navTalk" initialText={content.navTalk} tagName="span" />
            </button>

            {user && (
              <button 
                onClick={() => signOut(auth)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--nav-border)',
                  padding: '0.75rem 1rem',
                  borderRadius: scrolled ? '12px' : '15px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Logout
              </button>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                padding: 0,
              }}
            >
              {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Overlay Menu */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(6, 4, 15, 0.98)', 
        backdropFilter: 'blur(20px)',
        zIndex: 999,
        transition: 'all 0.8s cubic-bezier(0.85, 0, 0.15, 1)',
        transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        visibility: isMenuOpen ? 'visible' : 'hidden',
        pointerEvents: isMenuOpen ? 'all' : 'none',
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
        overflow: 'hidden',
      }}>
        {/* Decorative Background Text */}
        <div style={{
          position: 'absolute',
          bottom: '-5%',
          right: '-5%',
          fontSize: '20vw',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.02)',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 1,
        }}>
          MENU
        </div>

        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '6rem',
          width: '100%',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Left Column: Vision & Contact */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '3rem',
            opacity: isMenuOpen ? 1 : 0,
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease 0.4s',
          }}>
            <div>
              <div style={{ color: '#BEF264', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Get in touch</div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 600, lineHeight: 1.4, color: 'rgba(255,255,255,0.9)', maxWidth: '450px' }}>
                We help brands navigate the digital landscape with <span style={{ color: '#BEF264' }}>purpose</span> and <span style={{ color: '#BEF264' }}>precision.</span>
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <a href="mailto:hello@creatisk.in" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 500, transition: 'color 0.3s' }}>hello@creatisk.in</a>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[Globe, MessageCircle, Share2, Send].map((Icon, i) => (
                  <div key={i} className="hover-scale" style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.3s'
                  }}>
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Navigation Links */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            opacity: isMenuOpen ? 1 : 0,
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease 0.5s',
          }}>
            {[
              { label: 'Home', path: '/' },
              { label: 'About us', path: '/about' },
              { label: 'Services', path: '/services' },
              { label: 'Our Work', path: '/portfolio' },
            ].map((link, i) => (
              <Link 
                key={i}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 800,
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                  textDecoration: 'none',
                  transition: 'all 0.4s ease',
                  lineHeight: 1.1,
                  display: 'inline-block',
                  width: 'fit-content',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#BEF264';
                  e.target.style.WebkitTextStroke = '1px #BEF264';
                  e.target.style.transform = 'translateX(20px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'transparent';
                  e.target.style.WebkitTextStroke = '1px rgba(255,255,255,0.3)';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
