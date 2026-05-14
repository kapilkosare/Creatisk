import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight, Sparkles, Globe, Share2, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import EditableText from '../components/EditableText';
import { usePageContent } from '../hooks/usePageContent';
import PageLoader from '../components/PageLoader';

const ContactPage = () => {
  const { content, loading } = usePageContent('contact', {
    heroTitle: "Let's Talk Business.",
    heroSub: "Ready to start a revolution? Drop us a line and let's discuss how we can bring your vision to life.",
    nextTitle: "What Happens Next?",
    nextStep1: '1. Discovery Call: We dive deep into your project goals.',
    nextStep2: '2. Strategy Phase: We craft a custom roadmap for success.',
    nextStep3: '3. Proposal: You receive a detailed scope and timeline.',
    nextStep4: '4. Kickoff: Our creative team begins the magic.',
    formTitle: 'Project Planner',
    globalTitle: 'Global Footprint.',
    globalSub: 'We operate as a remote-first agency with a team spanning 4 continents. Distance is never a barrier to brilliance.'
  });
  
  if (loading) return <PageLoader />;

  return (
    <div style={{ background: 'transparent', color: '#fff', minHeight: '100vh', padding: '12rem 0 0', width: '100%', overflowX: 'hidden', position: 'relative' }}>
      <ThemeToggle />
      {/* Dynamic Background Elements */}
      <div className="orb orb-pink" style={{ top: '10%', right: '-10%', width: '600px', height: '600px', opacity: 0.2 }} />
      <div className="orb orb-purple" style={{ bottom: '20%', left: '-20%', width: '900px', height: '900px', opacity: 0.15 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* ── SECTION 1: HERO & INTRO ── */}
        <div style={{ marginBottom: '10rem' }}>
          <div className="section-tag" style={{ marginBottom: '2rem' }}><Sparkles size={14}/> Reach Out</div>
          <EditableText 
            pageId="contact" 
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
            pageId="contact" 
            fieldId="heroSub" 
            initialText={content.heroSub} 
            tagName="p" 
            style={{ fontSize: '1.5rem', color: 'var(--text-muted)', maxWidth: '800px', lineHeight: 1.6 }} 
          />
        </div>

        {/* ── SECTION 2: THE CONTACT HUB ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '6rem', marginBottom: '12rem', alignItems: 'start' }}>
          
          {/* Left Side: Detail & Trust */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '5rem' }}>
              {[
                { icon: <Mail />, label: 'Email', val: 'hello@creatisk.in', color: '#FF3366' },
                { icon: <MessageCircle />, label: 'WhatsApp', val: '+1 (555) 000-0000', color: '#25D366' },
                { icon: <Clock />, label: 'Response Time', val: 'Within 24 Hours', color: '#00E5FF' },
                { icon: <Calendar />, label: 'Office Hours', val: 'Mon - Fri, 9am - 6pm', color: '#FF9933' }
              ].map((item, i) => (
                <div key={i} className="glass-card" style={{ padding: '2rem', borderRadius: 24 }}>
                  <div style={{ color: item.color, marginBottom: '1rem' }}>{React.cloneElement(item.icon, { size: 24 })}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.val}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '5rem' }}>
              <EditableText pageId="contact" fieldId="nextTitle" initialText={content.nextTitle} tagName="h3" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)', opacity: 0.9, fontSize: '1.1rem' }}>
                    <CheckCircle2 size={20} color="var(--primary)" /> 
                    <EditableText pageId="contact" fieldId={`nextStep${i}`} initialText={content[`nextStep${i}`]} tagName="span" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Follow our updates</h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[Share2, Globe, Send].map((Icon, i) => (
                  <div key={i} className="hover-scale" style={{ 
                    width: 50, height: 50, borderRadius: '50%', 
                    background: 'var(--pill-bg)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: 'var(--pill-border)'
                  }}>
                    <Icon size={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: The Premium Form */}
          <div className="glass-strong" style={{ 
            padding: '5rem 4rem', 
            borderRadius: 48, 
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
            position: 'sticky',
            top: '120px'
          }}>
            <EditableText pageId="contact" fieldId="formTitle" initialText={content.formTitle} tagName="h3" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-0.02em' }} />
            <form style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Name</label>
                  <input type="text" placeholder="John Wick" className="input-glass" style={{ width: '100%', fontSize: '1.1rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</label>
                  <input type="email" placeholder="john@continental.com" className="input-glass" style={{ width: '100%', fontSize: '1.1rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Budget</label>
                <input type="text" placeholder="e.g. $10,000 or Open for discussion" className="input-glass" style={{ width: '100%', fontSize: '1.1rem' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tell us about your vision</label>
                <textarea placeholder="The next big thing is..." className="input-glass" rows="6" style={{ width: '100%', resize: 'none', fontSize: '1.1rem' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '1.5rem', width: '100%', fontSize: '1.2rem', marginTop: '1rem' }}>
                Send Proposal <ArrowRight size={24} />
              </button>
            </form>
          </div>
        </div>

        {/* ── SECTION 3: MAP / LOCATION DECOR ── */}
        <div style={{ 
          padding: '8rem', 
          borderRadius: 48, 
          background: 'var(--pill-bg)', 
          textAlign: 'center',
          marginBottom: '10rem',
          border: 'var(--pill-border)'
        }}>
           <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><Globe size={48} /></div>
           <EditableText pageId="contact" fieldId="globalTitle" initialText={content.globalTitle} tagName="h2" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }} />
           <EditableText 
             pageId="contact" 
             fieldId="globalSub" 
             initialText={content.globalSub} 
             tagName="p" 
             style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }} 
           />
        </div>
      </div>

      {/* FOOTER PADDING */}
      <div style={{ padding: '4rem 0' }}></div>
    </div>
  );
};

export default ContactPage;
