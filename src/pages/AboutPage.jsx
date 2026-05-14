import React from 'react';
import { usePageContent } from '../hooks/usePageContent';
import { Users, Target, Rocket, Award, Sparkles, ArrowRight, Cpu, Globe, Zap, Heart, Shield, Code, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';
import PageLoader from '../components/PageLoader';

const AboutPage = () => {
  const { content, loading } = usePageContent('about', {
    title: 'We Design The Future.',
    subtitle: "Creatisk is a boutique digital agency specialized in crafting high-end visual experiences. We don't just follow trends—we set them.",
    missionTitle: 'Our Mission',
    missionText: 'To push the boundaries of digital creativity and deliver exceptional value through innovative design and technology.',
    studioImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
    expertiseImage: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop',
    expertiseTitle: 'Specialized Expertise',
    expertiseList: 'UI/UX Design, Mobile App Design, Landing Pages, Websites, WordPress, Brand Identity, Motion Design, AI Projects, n8n Automation, Case Studies',
    studioImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
    philosophyTitle: 'Our Core Philosophy',
    philosophySub: 'Behind every pixel is a purpose. We believe in the power of meaningful design and robust engineering.',
    expertiseHeading: 'Crafting Immersive Digital Universes.',
    expertiseSub: 'We focus on creating modern, immersive and user-centered digital experiences for startups, wellness brands and modern businesses.',
    cardTitle1: 'User-Centered', cardDesc1: 'We put the user at the heart of everything, ensuring every interaction feels natural.',
    cardTitle2: 'Modern Tech', cardDesc2: 'From AI to n8n, we use the latest stack to keep your business at the forefront.',
    cardTitle3: 'Immersive Style', cardDesc3: 'We blend motion and depth to create digital worlds that capture attention.',
    phiTitle1: 'Hyper-Fast Delivery', phiDesc1: 'In a digital world, speed is the ultimate competitive advantage. We move at the speed of thought.',
    phiTitle2: 'Human Centric', phiDesc2: 'Technology should serve people, not the other way around. Every product we build starts with empathy.',
    phiTitle3: 'Unyielding Quality', phiDesc3: 'We never compromise on the technical foundation. Scalability and security are non-negotiable.',
    phiTitle4: 'Clean Architecture', phiDesc4: 'Beauty is skin deep, but great code is eternal. Our developers craft maintainable, elegant solutions.'
  });
  
  if (loading) return <PageLoader />;

  const expertiseArray = content.expertiseList ? content.expertiseList.split(',').map(s => s.trim()) : [];

  return (
    <div style={{ background: 'transparent', color: 'var(--text-main)', minHeight: '100vh', padding: '12rem 0 0', width: '100%', overflowX: 'hidden', position: 'relative' }}>
      <ThemeToggle />
      {/* Background Orbs */}
      <div className="orb orb-pink" style={{ top: '5%', left: '-10%', width: '600px', height: '600px', opacity: 0.2 }} />
      <div className="orb orb-purple" style={{ top: '30%', right: '-15%', width: '700px', height: '700px', opacity: 0.15 }} />
      <div className="orb orb-orange" style={{ bottom: '10%', left: '20%', width: '500px', height: '500px', opacity: 0.1 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* ── SECTION 1: HERO ── */}
        <div style={{ textAlign: 'center', marginBottom: '12rem' }}>
          <div className="section-tag" style={{ margin: '0 auto 2rem' }}><Sparkles size={14}/> Discover Creatisk</div>
          <EditableText 
            pageId="about" 
            fieldId="title" 
            initialText={content.title} 
            tagName="h1" 
            style={{ 
              fontFamily: 'var(--font-hero)', 
              fontSize: 'clamp(4rem, 10vw, 8.5rem)', 
              fontWeight: 900, 
              lineHeight: 0.9, 
              letterSpacing: '-0.05em',
              marginBottom: '3rem',
              background: 'linear-gradient(to bottom, var(--text-main) 40%, var(--text-muted))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }} 
          />
          <EditableText 
            pageId="about" 
            fieldId="subtitle" 
            initialText={content.subtitle} 
            tagName="p" 
            style={{ 
              fontSize: '1.5rem', 
              color: 'var(--text-muted)', 
              maxWidth: '900px', 
              margin: '0 auto',
              lineHeight: 1.6,
              fontWeight: 500
            }} 
          />
        </div>

        {/* ── SECTION 2: THE STUDIO IMAGE ── */}
        <div style={{ marginBottom: '12rem', borderRadius: '40px', overflow: 'hidden', height: 'clamp(300px, 60vh, 600px)', position: 'relative' }}>
          <EditableImage 
            pageId="about" 
            fieldId="studioImage" 
            initialUrl={content.studioImage} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            recommendedSize="1600 x 900"
          />
          <div style={{ 
            position: 'absolute', bottom: 'clamp(1rem, 5%, 4rem)', left: 'clamp(1rem, 5%, 4rem)', right: 'clamp(1rem, 5%, 4rem)',
            background: 'var(--glass-bg-strong)', backdropFilter: 'blur(20px)', 
            padding: '2rem', borderRadius: '24px', border: 'var(--glass-border)',
            boxShadow: 'var(--glass-shadow)'
          }}>
            <EditableText pageId="about" fieldId="missionTitle" initialText={content.missionTitle} tagName="h3" style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }} />
            <EditableText pageId="about" fieldId="missionText" initialText={content.missionText} tagName="p" style={{ color: 'var(--text-muted)', maxWidth: '400px' }} />
          </div>
        </div>

        <div style={{ marginBottom: '15rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', 
            gap: '5rem', 
            alignItems: 'center' 
          }}>
            {/* Left: Mission & Expertise */}
            <div>
              <div className="section-tag"><Zap size={14}/> <EditableText pageId="about" fieldId="expertiseTitle" initialText={content.expertiseTitle} tagName="span" /></div>
              <EditableText pageId="about" fieldId="expertiseHeading" initialText={content.expertiseHeading} tagName="h2" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2.5rem', lineHeight: 1.1, letterSpacing: '-0.03em' }} />
              <EditableText pageId="about" fieldId="expertiseSub" initialText={content.expertiseSub} tagName="p" style={{ fontSize: '1.3rem', color: 'var(--text-main)', opacity: 0.85, lineHeight: 1.7, marginBottom: '3rem' }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                {expertiseArray.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={18} color="var(--primary)" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Abstract Image */}
            <div className="hover-scale" style={{ borderRadius: '32px', overflow: 'hidden', height: '500px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
               <EditableImage 
                 pageId="about" 
                 fieldId="expertiseImage" 
                 initialUrl={content.expertiseImage} 
                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                 recommendedSize="800 x 800"
               />
            </div>
          </div>
          
          {/* Why Choose Us Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
            {[
              { color: 'var(--primary)', title: content.cardTitle1, desc: content.cardDesc1, id: 1 },
              { color: 'var(--accent)', title: content.cardTitle2, desc: content.cardDesc2, id: 2 },
              { color: 'var(--secondary)', title: content.cardTitle3, desc: content.cardDesc3, id: 3 }
            ].map((card, i) => (
              <div key={i} className="glass-card" style={{ padding: '3rem' }}>
                <EditableText pageId="about" fieldId={`cardTitle${card.id}`} initialText={card.title} tagName="h4" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: card.color }} />
                <EditableText pageId="about" fieldId={`cardDesc${card.id}`} initialText={card.desc} tagName="p" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: THE PHILOSOPHY ── */}
        <div style={{ marginBottom: '15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem', flexWrap: 'wrap', gap: '2rem' }}>
            <EditableText pageId="about" fieldId="philosophyTitle" initialText={content.philosophyTitle} tagName="h2" style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.03em' }} />
            <EditableText pageId="about" fieldId="philosophySub" initialText={content.philosophySub} tagName="p" style={{ maxWidth: '450px', color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1.7 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <Zap />, title: content.phiTitle1, desc: content.phiDesc1, id: 1 },
              { icon: <Heart />, title: content.phiTitle2, desc: content.phiDesc2, id: 2 },
              { icon: <Shield />, title: content.phiTitle3, desc: content.phiDesc3, id: 3 },
              { icon: <Code />, title: content.phiTitle4, desc: content.phiDesc4, id: 4 }
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: '4rem 3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '2rem' }}>{React.cloneElement(item.icon, { size: 36 })}</div>
                <EditableText pageId="about" fieldId={`phiTitle${item.id}`} initialText={item.title} tagName="h3" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }} />
                <EditableText pageId="about" fieldId={`phiDesc${item.id}`} initialText={item.desc} tagName="p" style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.1rem' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
