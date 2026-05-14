import React from 'react';
import { Link } from 'react-router-dom';
import { MonitorSmartphone, Globe, LayoutTemplate, Smartphone, Clapperboard, Workflow, Cpu, Layers, FileText, PenTool, ArrowUpRight, Sparkles, CheckCircle2, Zap, BarChart3, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import EditableText from '../components/EditableText';
import { usePageContent } from '../hooks/usePageContent';
import PageLoader from '../components/PageLoader';

const SERVICES_DATA = [
  { icon: <MonitorSmartphone />, title: 'UI/UX Design', desc: 'Crafting pixel-perfect, intuitive interfaces that people love to use. We focus on conversion and user delight.', color: '#FF3366', details: ['User Research', 'Wireframing', 'Prototyping', 'Visual Identity'] },
  { icon: <Smartphone />, title: 'Mobile App Design', desc: 'Stunning, user-centered mobile interfaces that focus on intuitive navigation and visual excellence. We design premium iOS and Android experiences.', color: '#00E5FF', details: ['App UI Design', 'UX Strategy', 'High-Fidelity Prototyping', 'Mobile Design Systems'] },
  { icon: <Globe />, title: 'Websites', desc: 'High-performance, scalable custom websites built with the latest technologies like React, Next.js, and Vite.', color: '#8A2BE2', details: ['Custom React Apps', 'Next.js SEO', 'Vite Speed', 'API Integration'] },
  { icon: <LayoutTemplate />, title: 'Landing Pages', desc: 'Conversion-optimized landing pages designed to turn visitors into loyal customers for your brand.', color: '#FF9933', details: ['A/B Testing', 'Copywriting', 'Heatmap Analysis', 'Fast Loading'] },
  { icon: <Clapperboard />, title: 'Motion Design', desc: 'Bringing your brand to life with stunning animations, social reels, and high-impact video graphics.', color: '#A855F7', details: ['Lottie Animations', 'Video Editing', '3D Graphics', 'Social Media Ads'] },
  { icon: <FileText />, title: 'WordPress', desc: 'Custom WordPress solutions that are fast, secure, and easy for you to manage without any technical headache.', color: '#21759B', details: ['Custom Themes', 'WooCommerce', 'Speed Optimization', 'Security Hardening'] },
  { icon: <Cpu />, title: 'AI Projects', desc: 'Integrating LLMs, AI agents, and intelligent automation into your existing workflows for maximum efficiency.', color: '#EC4899', details: ['LLM Integration', 'AI Chatbots', 'Workflow Automation', 'Data Analysis'] },
  { icon: <Workflow />, title: 'n8n Automation', desc: 'Automating repetitive tasks by connecting your tools with custom n8n workflows and API integrations.', color: '#FF6B35', details: ['API Connections', 'Error Handling', 'Scalable Workflows', 'Tool Integration'] },
];

const ServicesPage = () => {
  const { content, loading } = usePageContent('services', {
    heroTitle: 'Solutions That Defy Gravity.',
    heroSub: 'We provide a comprehensive suite of digital services designed to take your business from vision to market-leading reality.',
    propTitle1: 'Blazing Speed', propDesc1: 'Our solutions are optimized for maximum performance and instant loading.',
    propTitle2: 'Enterprise Security', propDesc2: 'We build with a security-first mindset to protect your data and reputation.',
    propTitle3: 'Data Driven', propDesc3: 'Every creative decision is backed by analytics and user behavior research.',
    propTitle4: 'Premium Design', propDesc4: 'We deliver high-end aesthetics that make your brand stand out instantly.',
    ctaHeading: 'Ready to elevate your digital presence?',
    ctaButton: 'Book a Strategy Call'
  });
  
  if (loading) return <PageLoader />;

  return (
    <div style={{ background: 'transparent', color: 'var(--text-main)', minHeight: '100vh', padding: '12rem 0 0', width: '100%', overflowX: 'hidden', position: 'relative' }}>
      <ThemeToggle />
      <div className="orb orb-purple" style={{ top: '10%', right: '-10%', width: '600px', height: '600px', opacity: 0.2 }} />
      <div className="orb orb-pink" style={{ bottom: '20%', left: '-15%', width: '800px', height: '800px', opacity: 0.15 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* ── SECTION 1: HERO ── */}
        <div style={{ textAlign: 'center', marginBottom: '12rem' }}>
          <div className="section-tag" style={{ margin: '0 auto 2rem' }}><Sparkles size={14}/> Specialized Services</div>
          <EditableText 
            pageId="services" 
            fieldId="heroTitle" 
            initialText={content.heroTitle} 
            tagName="h1" 
            style={{ 
              fontFamily: 'var(--font-hero)', 
              fontSize: 'clamp(4rem, 10vw, 8rem)', 
              fontWeight: 900, 
              lineHeight: 0.9, 
              letterSpacing: '-0.05em',
              marginBottom: '3rem',
              background: 'linear-gradient(to right, var(--text-main), var(--text-muted))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }} 
          />
          <EditableText 
            pageId="services" 
            fieldId="heroSub" 
            initialText={content.heroSub} 
            tagName="p" 
            style={{ fontSize: '1.5rem', color: 'var(--text-muted)', maxWidth: '850px', margin: '0 auto', lineHeight: 1.6 }} 
          />
        </div>

        {/* ── SECTION 2: WHY CHOOSE US (Value Props) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '15rem' }}>
           {[
             { icon: <Zap />, title: content.propTitle1, desc: content.propDesc1, field1: 'propTitle1', field2: 'propDesc1' },
             { icon: <ShieldCheck />, title: content.propTitle2, desc: content.propDesc2, field1: 'propTitle2', field2: 'propDesc2' },
             { icon: <BarChart3 />, title: content.propTitle3, desc: content.propDesc3, field1: 'propTitle3', field2: 'propDesc3' },
             { icon: <Sparkles />, title: content.propTitle4, desc: content.propDesc4, field1: 'propTitle4', field2: 'propDesc4' }
           ].map((prop, i) => (
             <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
               <div style={{ color: 'var(--primary)' }}>{React.cloneElement(prop.icon, { size: 32 })}</div>
               <div>
                 <EditableText pageId="services" fieldId={prop.field1} initialText={prop.title} tagName="h4" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }} />
                 <EditableText pageId="services" fieldId={prop.field2} initialText={prop.desc} tagName="p" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }} />
               </div>
             </div>
           ))}
        </div>

        {/* ── SECTION 3: SERVICES GRID (Expanded) ── */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', 
          gap: '3rem',
          marginBottom: '15rem'
        }}>
          {SERVICES_DATA.map((service, i) => (
            <div key={i} className="glass-card" style={{ 
              padding: '4rem 3rem', 
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              {/* Floating Number Label */}
              <div style={{ position: 'absolute', top: '2rem', right: '3rem', fontSize: '6rem', fontWeight: 900, color: 'var(--text-main)', opacity: 0.05, pointerEvents: 'none' }}>0{i+1}</div>
              
              <div style={{ 
                width: 70, height: 70, borderRadius: 20, 
                background: 'var(--pill-bg)', 
                border: `1px solid ${service.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '3rem',
                color: service.color,
                boxShadow: `0 15px 40px ${service.color}11`
              }}>
                {React.cloneElement(service.icon, { size: 32 })}
              </div>

              <h3 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>{service.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '3rem' }}>
                {service.desc}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
                {service.details.map((detail, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', opacity: 0.8, fontSize: '0.95rem' }}>
                    <CheckCircle2 size={16} color={service.color} /> {detail}
                  </div>
                ))}
              </div>
              
              <button style={{ 
                background: 'transparent', border: 'none', color: 'var(--text-main)', 
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                fontWeight: 700, cursor: 'pointer', padding: 0
              }}>
                View Case Studies <ArrowUpRight size={20} color={service.color} />
              </button>
            </div>
          ))}
        </div>

        {/* ── SECTION 4: PACKAGES (Pricing Table) ── */}
        <div style={{ marginBottom: '15rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 900 }}>Transparent <span className="text-gradient">Engagement</span></h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Flexible models tailored to your business needs.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2.5rem' }}>
            {[
              { type: 'Project Based', price: 'Fixed', desc: 'Best for specific projects with a clear scope and deadline.', features: ['Full Project Discovery', 'Dedicated Design Team', 'Unlimited Revisions', 'Launch Support'] },
              { type: 'Retainer', price: 'Monthly', desc: 'Continuous support for growing brands that need ongoing creative.', features: ['Priority Support', 'Weekly Strategy Sync', 'Flexible Scope', 'Monthly Audit'] },
              { type: 'Staff Aug', price: 'On-Demand', desc: 'Inject expert talent directly into your existing team.', features: ['Scalable Resources', 'Technical Expertise', 'Seamless Integration', 'Immediate Start'] }
            ].map((pkg, i) => (
              <div key={i} className="glass-strong" style={{ padding: '4rem 3rem', borderRadius: 32, border: i === 1 ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                {i === 1 && <div style={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#fff', padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Most Popular</div>}
                <div style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem' }}>{pkg.price}</div>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>{pkg.type}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', minHeight: '60px' }}>{pkg.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
                  {pkg.features.map((f, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.05rem' }}>
                      <CheckCircle2 size={18} color="var(--primary)" /> {f}
                    </div>
                  ))}
                </div>
                <button className={i === 1 ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'center', padding: '1.2rem' }}>Get Started</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER CTA ── */}
      {/* FOOTER CTA ── */}
      <section style={{ padding: '10rem 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <EditableText pageId="services" fieldId="ctaHeading" initialText={content.ctaHeading} tagName="h2" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2.5rem' }} />
          <Link to="/contact" className="btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1.2rem', textDecoration: 'none' }}>
            <EditableText pageId="services" fieldId="ctaButton" initialText={content.ctaButton} tagName="span" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
