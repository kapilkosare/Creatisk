import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight, Sparkles, Globe, Share2, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import EditableText from '../components/EditableText';
import { usePageContent } from '../hooks/usePageContent';
import { useGlobalSettings } from '../hooks/useGlobalSettings';
import PageLoader from '../components/PageLoader';
import { submitContactForm } from '../utils/formHandler';
import { useState } from 'react';

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

  const { settings } = useGlobalSettings();
  const [formData, setFormData] = useState({ name: '', email: '', budget: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const result = await submitContactForm(formData, 'contact_page', settings.notificationEmails);
    
    if (result.success) {
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', budget: '', message: '' });
    } else {
      setStatus({ type: 'error', message: result.message || 'Something went wrong. Please try again.' });
    }
    setIsSubmitting(false);
  };
  
  const isLight = settings.theme === 'light';

  if (loading) return <PageLoader />;

  return (
    <div style={{ background: 'transparent', color: 'var(--text-main)', minHeight: '100vh', padding: '12rem 0 0', width: '100%', overflowX: 'hidden', position: 'relative' }}>
      <ThemeToggle />
      {/* Dynamic Background Elements */}
      <div className="orb orb-pink" style={{ top: '10%', right: '-10%', width: '600px', height: '600px', opacity: isLight ? 0.05 : 0.2 }} />
      <div className="orb orb-purple" style={{ bottom: '20%', left: '-20%', width: '900px', height: '900px', opacity: isLight ? 0.04 : 0.15 }} />

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
              WebkitTextFillColor: 'transparent',
              color: 'var(--text-main)' // Fallback
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

          <div className="glass-strong" style={{ 
            padding: '5rem 4rem', 
            borderRadius: 48, 
            border: 'var(--glass-border)',
            boxShadow: 'var(--card-shadow)',
            background: 'var(--glass-bg-strong)',
            position: 'sticky',
            top: '120px'
          }}>
            <EditableText pageId="contact" fieldId="formTitle" initialText={content.formTitle} tagName="h3" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-0.02em' }} />
            
            {status.type === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ color: '#BEF264', marginBottom: '1.5rem' }}><CheckCircle2 size={64} style={{ margin: '0 auto' }} /></div>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button onClick={() => setStatus({ type: '', message: '' })} className="btn-primary" style={{ margin: '0 auto' }}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="John Wick" 
                      value={formData.name}
                      onChange={handleChange}
                      className="input-glass" 
                      style={{ width: '100%', fontSize: '1.1rem' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="john@continental.com" 
                      value={formData.email}
                      onChange={handleChange}
                      className="input-glass" 
                      style={{ width: '100%', fontSize: '1.1rem' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Budget</label>
                  <input 
                    type="text" 
                    name="budget"
                    placeholder="Enter your estimated budget" 
                    value={formData.budget}
                    onChange={handleChange}
                    className="input-glass" 
                    style={{ width: '100%', fontSize: '1.1rem' }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tell us about your vision</label>
                  <textarea 
                    name="message"
                    required
                    placeholder="The next big thing is..." 
                    value={formData.message}
                    onChange={handleChange}
                    className="input-glass" 
                    rows="6" 
                    style={{ width: '100%', resize: 'none', fontSize: '1.1rem' }} 
                  />
                </div>

                {status.type === 'error' && (
                  <div style={{ color: '#FF3366', fontSize: '0.9rem', fontWeight: 600 }}>{status.message}</div>
                )}

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isSubmitting}
                  style={{ justifyContent: 'center', padding: '1.5rem', width: '100%', fontSize: '1.2rem', marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Sending Proposal...' : 'Send Proposal'} <ArrowRight size={24} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── SECTION 3: MAP / LOCATION DECOR ── */}
        <div style={{ 
          padding: '8rem', 
          borderRadius: 48, 
          background: 'var(--pill-bg)', 
          textAlign: 'center',
          marginBottom: '4rem',
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
    </div>
  );
};

export default ContactPage;
