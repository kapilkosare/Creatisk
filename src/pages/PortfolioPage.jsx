import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowUpRight, Star, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROJECT_DATA } from './ProjectDetailPage';
import ThemeToggle from '../components/ThemeToggle';
import PageLoader from '../components/PageLoader';

const ALL_PROJECTS = PROJECT_DATA;

const FILTERS = [
  'All', 'Websites', 'Landing Pages', 'Mobile Apps',
  'Motion Design', 'WordPress', 'AI Projects', 'n8n Automation',
  'Case Studies', 'Brand Identity',
];

export default function PortfolioPage() {
  const [projects, setProjects]       = useState(ALL_PROJECTS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [displayed, setDisplayed]     = useState(ALL_PROJECTS);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        if (!db) return;
        const snap = await getDocs(collection(db, 'projects'));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setProjects(list);
          setDisplayed(list);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);
  
  useEffect(() => {
    setDisplayed(
      activeFilter === 'All'
        ? projects
        : projects.filter(p => p.tag === activeFilter || p.category === activeFilter)
    );
  }, [activeFilter, projects]);

  if (loading) return <PageLoader />;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '130px', paddingBottom: '8rem', position: 'relative' }}>
      <ThemeToggle />

      {/* Ambient orbs */}
      <div className="orb orb-purple" style={{ top: '-8%',  right: '-12%', opacity: 0.25 }} />
      <div className="orb orb-pink"   style={{ top: '45%',  left:  '-8%',  opacity: 0.2  }} />
      <div className="orb orb-orange" style={{ bottom: '8%', right: '4%',  opacity: 0.15 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ─── Hero Header ─────────────────────────────── */}
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', paddingBottom: '5rem' }}>
          <div className="section-tag" style={{ marginBottom: '1.75rem' }}>
            <Star size={12} fill="currentColor" /> Portfolio
          </div>
          <h1 style={{
            fontFamily: 'var(--font-hero)',
            fontSize: 'clamp(3.2rem, 7vw, 5.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: '1.5rem',
          }}>
            Work That{' '}
            <span className="text-gradient">Speaks</span>
            <br />for Itself
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.8, maxWidth: 520, margin: '0 auto' }}>
            Every project here is a story of bold design, precise engineering, and meaningful impact for our clients.
          </p>
        </div>

        {/* ─── Filter Bar ──────────────────────────────── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.6rem',
          justifyContent: 'center', marginBottom: '5rem',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', color:'var(--text-muted)', fontSize:'0.85rem', fontWeight:600, marginRight:'0.5rem' }}>
            <SlidersHorizontal size={14}/> Filter
          </div>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '0.55rem 1.2rem',
                borderRadius: 40,
                fontSize: '0.88rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.01em',
                background: f === activeFilter ? 'var(--primary-gradient)' : 'var(--pill-bg)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: f === activeFilter ? '#fff' : 'var(--text-main)',
                boxShadow: f === activeFilter ? '0 4px 18px rgba(255,51,102,0.35)' : 'none',
                outline: f !== activeFilter ? 'var(--pill-border)' : 'none',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ─── Project Count ────────────────────────────── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem' }}>
          <p style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>
            Showing <strong style={{ color:'var(--text-main)', fontWeight:700 }}>{displayed.length}</strong> project{displayed.length !== 1 ? 's' : ''}
            {activeFilter !== 'All' && <span style={{ color:'var(--primary)' }}> · {activeFilter}</span>}
          </p>
          <div style={{ width:1, height:1 }} />
        </div>

        {/* ─── Grid ────────────────────────────────────── */}
        {displayed.length === 0 ? (
          <div style={{ textAlign:'center', padding:'8rem 0', color:'var(--text-muted)' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✦</div>
            <p style={{ fontSize:'1.1rem' }}>No projects found for this category yet.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
            gap: '2rem',
          }}>
            {displayed.map((p, i) => (
              <ProjectCard key={p.id} project={p} featured={i === 0 && activeFilter === 'All'} />
            ))}
          </div>
        )}

        {/* ─── Footer CTA ──────────────────────────────── */}
        <div style={{ textAlign:'center', marginTop:'7rem', paddingTop:'4rem', borderTop:'1px solid var(--border-color)' }}>
          <p style={{ color:'var(--text-muted)', fontSize:'1rem', marginBottom:'2rem' }}>
            Have a project in mind? Let's build something remarkable together.
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ padding:'1rem 2.5rem', fontSize:'1.05rem', textDecoration: 'none' }}>
              Start a Project <ArrowUpRight size={18}/>
            </Link>
            <Link to="/" className="btn-outline" style={{ padding:'1rem 2.5rem', fontSize:'1.05rem', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
              ← Back to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Project Card ─────────────────────────────────────── */
function ProjectCard({ project: p, featured }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/portfolio/${p.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 32,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        transform: hovered ? 'translateY(-12px)' : 'translateY(0)',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        gridColumn: featured ? 'span 2' : 'span 1',
        boxShadow: hovered ? '0 40px 80px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)',
      }}
    >
      {/* Image Container with Padding */}
      <div style={{ padding: '1rem', position: 'relative' }}>
        <div style={{ 
          position: 'relative', 
          borderRadius: 24, 
          overflow: 'hidden',
          height: featured ? '400px' : '320px'
        }}>
          <img
            src={p.imageUrl}
            alt={p.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          />
          {/* Hover Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.2)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease'
          }} />
          
          {/* Floating Tag */}
          <div style={{
            position: 'absolute', top: '1.5rem', left: '1.5rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {p.tag || p.category}
          </div>
        </div>
      </div>

      {/* Minimalist Info Section */}
      <div style={{ 
        padding: '0.5rem 2.5rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end' 
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ 
              color: 'var(--primary)', 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.15em',
              margin: '0 0 0.4rem 0'
            }}>
              {p.category}
            </p>
            <h3 style={{
              fontSize: featured ? '2.2rem' : '1.6rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}>
              {p.title}
            </h3>
          </div>
          
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: hovered ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.4s ease',
            color: hovered ? '#fff' : 'var(--text-muted)',
            flexShrink: 0,
            transform: hovered ? 'rotate(45deg)' : 'rotate(0)'
          }}>
            <ArrowUpRight size={24} />
          </div>
        </div>
        
        {/* Subtle expansion for description */}
        <div style={{
          maxHeight: hovered ? '80px' : '0',
          opacity: hovered ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
          marginTop: hovered ? '1rem' : '0'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
            {p.description || p.category}
          </p>
        </div>
      </div>
    </Link>
  );
}
