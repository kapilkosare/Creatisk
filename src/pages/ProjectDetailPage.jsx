import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, Globe, ExternalLink, Image as ImageIcon, Tag, Calendar, User, CheckCircle2, Zap, Target } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import PageLoader from '../components/PageLoader';

/* ─── Shared project data (Fallback) ─── */
export const PROJECT_DATA = [
  // ... (keeping existing static data for fallback/testing)
  {
    id: '1',
    title: 'NeoBank App Redesign',
    category: 'Fintech UI/UX',
    tag: 'Mobile Apps',
    year: '2025',
    client: 'NeoBank Inc.',
    description: 'A full redesign of the NeoBank mobile application focused on simplifying complex financial flows. We reduced the average user journey from 7 steps to 3, resulting in a 40% improvement in task completion rate and a 28% increase in daily active users.',
    tools: 'Figma, Protopie, React Native, Firebase',
    link: 'https://behance.net',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1400&auto=format&fit=crop',
    challenge: 'The original NeoBank app was cluttered with excessive financial terminology and a confusing navigation structure. Users often abandoned transaction flows midway due to friction in the KYC process.',
    solution: 'We implemented a "progressive disclosure" strategy, hiding complex options until needed. The KYC flow was redesigned into a gamified, step-by-step experience with real-time validation.',
    result: 'Post-launch metrics showed a 65% reduction in support tickets related to app navigation and a significant surge in younger demographics joining the platform.'
  }
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      try {
        if (!db) return;
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          const staticProj = PROJECT_DATA.find(p => p.id === id);
          if (staticProj) setProject(staticProj);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <PageLoader />;

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-hero)', fontSize: '3rem' }}>Project Not Found</h2>
        <Link to="/portfolio" className="btn-primary">← Back to Portfolio</Link>
      </div>
    );
  }

  const toolsArray = project.tools ? project.tools.split(',').map(t => t.trim()) : [];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '8rem', position: 'relative' }}>
      <ThemeToggle />
      <div className="orb orb-purple" style={{ top: '-5%', right: '-10%', opacity: 0.25 }} />
      <div className="orb orb-pink"   style={{ bottom: '20%', left: '-8%', opacity: 0.2 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <Link to="/portfolio" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', color:'var(--text-muted)', fontWeight:600, fontSize:'0.9rem', marginBottom:'3rem', transition:'color 0.2s' }}>
          <ArrowLeft size={16}/> All Projects
        </Link>

        {/* ─── Hero Image ── */}
        <div style={{ position:'relative', borderRadius:28, overflow:'hidden', marginBottom:'5rem', boxShadow:'0 30px 80px rgba(0,0,0,0.6)' }}>
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{ width:'100%', height:'clamp(300px, 60vh, 600px)', objectFit:'cover', display:'block' }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(6,4,15,0.7) 0%, transparent 60%)' }} />
          <span style={{
            position:'absolute', top:'2rem', left:'2rem',
            background:'rgba(6,4,15,0.6)', backdropFilter:'blur(12px)',
            border:'1px solid rgba(255,255,255,0.15)', borderRadius:20,
            padding:'0.5rem 1.25rem', fontSize:'0.85rem', fontWeight:700,
            color:'rgba(255,255,255,0.9)', letterSpacing:'0.08em', textTransform:'uppercase',
          }}>{project.category}</span>
        </div>

        {/* ─── Main Content ── */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', 
          gap: '6rem', 
          alignItems: 'start' 
        }}>

          {/* Left — Details */}
          <div>
            <h1 style={{
              fontFamily:'var(--font-hero)', fontSize:'clamp(3rem, 6vw, 4.5rem)',
              fontWeight:900, letterSpacing:'-0.03em', lineHeight:1, marginBottom:'2rem',
            }}>
              {project.title}
            </h1>
            <p style={{ color:'var(--text-muted)', fontSize:'1.25rem', lineHeight:1.8, marginBottom:'4rem', fontWeight: 500 }}>
              {project.description}
            </p>
            </div>

            {/* Right — Sidebar */}
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem', position:'sticky', top:'120px' }}>
              {/* Meta card */}
              <div className="glass-strong" style={{ padding:'2.5rem', borderRadius: '32px' }}>
                <h3 style={{ fontSize:'0.9rem', fontWeight:700, marginBottom:'2rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                  Project Overview
                </h3>
                {[
                  { icon:<User size={16}/>,     label:'Client',   value: project.client },
                  { icon:<Calendar size={16}/>, label:'Year',     value: project.year },
                  { icon:<Tag size={16}/>,      label:'Category', value: project.category },
                ].map(({ icon, label, value }) => value && (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', color:'var(--text-muted)', fontSize:'0.9rem' }}>
                      {icon} {label}
                    </div>
                    <span style={{ fontWeight:700, fontSize:'0.95rem' }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Tools */}
              {toolsArray.length > 0 && (
                <div className="glass-strong" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                  <h3 style={{ fontSize:'0.9rem', fontWeight:700, marginBottom:'1.5rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                    Technologies
                  </h3>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem' }}>
                    {toolsArray.map(t => (
                      <span key={t} style={{
                        padding:'0.5rem 1.25rem', borderRadius:30, fontSize:'0.85rem', fontWeight:700,
                        background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                        color:'var(--text-main)',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="btn-primary" style={{ justifyContent:'center', padding:'1.25rem', borderRadius: '20px' }}>
                    <Globe size={20}/> Visit Website
                  </a>
                )}
                <Link to="/contact" className="btn-outline" style={{ justifyContent:'center', padding:'1.25rem', borderRadius: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  Start Similar Project <ArrowUpRight size={20}/>
                </Link>
              </div>
            </div>
          </div>

        {/* ─── Case Study Sections (Full Width Row) ── */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
          gap: '2rem', 
          marginTop: '6rem' 
        }}>
          {project.challenge && (
            <div style={{ padding: '2.5rem', borderRadius: '32px', background: 'rgba(255,51,102,0.03)', border: '1px solid rgba(255,51,102,0.1)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#FF3366', marginBottom: '1.5rem' }}>
                <Target size={24} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>The Challenge</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>{project.challenge}</p>
            </div>
          )}

          {project.solution && (
            <div style={{ padding: '2.5rem', borderRadius: '32px', background: 'rgba(0,229,255,0.03)', border: '1px solid rgba(0,229,255,0.1)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#00E5FF', marginBottom: '1.5rem' }}>
                <Zap size={24} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>The Solution</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>{project.solution}</p>
            </div>
          )}

          {project.result && (
            <div style={{ padding: '2.5rem', borderRadius: '32px', background: 'rgba(138,43,226,0.03)', border: '1px solid rgba(138,43,226,0.1)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#8A2BE2', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={24} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>The Result</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>{project.result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
