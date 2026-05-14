import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import EditableText from './EditableText';
import { usePageContent } from '../hooks/usePageContent';

const Footer = () => {
  const { content } = usePageContent('home', {
    ctaHeading: 'Got a project that needs our magic touch?',
    ctaSub: "Leave your details and let's create something extraordinary together. We respond within 24 hours.",
    footerEmail: 'hello@creatisk.in',
    footerBy: 'by Kapil Kosare',
    footerCopyright: 'Creatisk Agency. All rights reserved.'
  });

  return (
    <>
      {/* ── PRE-FOOTER CTA ────────────────────────────────── */}
      <section style={{ padding: '8rem 0', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="orb orb-pink" style={{ bottom: '-10%', right: '-5%', opacity: 0.4 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="glass-strong" style={{ 
            padding: '4rem', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '4rem', 
            alignItems: 'center',
            borderRadius: '40px' 
          }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '1.5rem' }}><Mail size={12}/> Get in Touch</div>
              <EditableText 
                pageId="home" 
                fieldId="ctaHeading" 
                initialText={content.ctaHeading} 
                tagName="h2" 
                style={{ fontFamily: 'var(--font-hero)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.02em', marginBottom: '1.5rem', lineHeight: 1.15 }} 
              />
              <EditableText 
                pageId="home" 
                fieldId="ctaSub" 
                initialText={content.ctaSub} 
                tagName="p" 
                style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7 }} 
              />
            </div>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Your Name" className="input-glass" />
              <input type="email" placeholder="Your Email" className="input-glass" />
              <textarea placeholder="Tell us about your project..." className="input-glass" rows="4" style={{ resize: 'none' }} />
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '1.1rem' }}>
                Send Message <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── MAIN FOOTER ────────────────────────────────────── */}
      <footer style={{ padding: '4rem 0 2rem', overflow: 'hidden', background: 'var(--footer-bg)' }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderBottom: '1px solid var(--border-color)', 
            paddingBottom: '2rem', 
            marginBottom: '4rem', 
            flexWrap: 'wrap', 
            gap: '1.5rem' 
          }}>
            <div style={{ display: 'flex', gap: '2.5rem' }}>
              <a 
                href="https://www.behance.net/kapilkosare" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s' }}
                className="hover-link"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.28h-6.04c.04 1.76 1.48 2.68 3.2 2.68 1.44 0 2.48-.48 2.8-1.28h2.04c-.36 1.84-2.4 3.28-4.84 3.28-3.32 0-5.24-2.24-5.24-5.08 0-3.08 2.12-5.16 5.08-5.16 2.8 0 4.92 1.88 4.92 5.08v.48zm-2.84-2.12c-1.44 0-2.32.84-2.6 1.64h5.08c-.04-.8-.88-1.64-2.48-1.64zM11.64 12c0 2.12-1.48 2.76-3.16 2.76H3.6V5.44h4.48c1.52 0 2.76.56 2.76 1.96 0 1.04-.64 1.68-1.72 1.88 1.36.16 2.52.88 2.52 2.72zm-2.88-4.2c0-.52-.4-.76-1.12-.76H5.48v1.64h2.16c.72 0 1.12-.24 1.12-.88zm.24 4.2c0-.6-.48-.88-1.28-.88H5.48v1.88h2.16c.88 0 1.36-.28 1.36-1zm5.2-7.56h6v1.44h-6v-1.44z"/></svg>
                Behance
              </a>
              <a 
                href="https://www.linkedin.com/in/kapilkosare/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s' }}
                className="hover-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
              </a>
            </div>
            <div style={{ color: 'var(--text-muted)', textAlign: 'right' }}>
              <EditableText pageId="home" fieldId="footerEmail" initialText={content.footerEmail} tagName="div" />
              <EditableText pageId="home" fieldId="footerBy" initialText={content.footerBy} tagName="div" style={{ marginTop: '0.25rem' }} />
            </div>
          </div>
          <div className="footer-logo-text">CREATISK.</div>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '2rem' }}>
            &copy; {new Date().getFullYear()} <EditableText pageId="home" fieldId="footerCopyright" initialText={content.footerCopyright} tagName="span" />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
