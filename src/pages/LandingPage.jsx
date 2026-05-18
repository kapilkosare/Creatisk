import React, { useEffect, useState, useRef, useCallback } from 'react';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';
import { usePageContent } from '../hooks/usePageContent';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowRight, Star, MonitorSmartphone, PenTool, LayoutTemplate, Layers, Target, Rocket, Lightbulb, TrendingUp, Mail, ChevronLeft, ChevronRight, Clapperboard, Globe, FileText, Cpu, Workflow, Smartphone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cleanImageUrl } from '../utils/urlHelper';
import ThemeToggle from '../components/ThemeToggle';
import PageLoader from '../components/PageLoader';

const CAROUSEL_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=900&auto=format&fit=crop', label: 'Fintech App' },
  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=900&auto=format&fit=crop', label: 'Development' },
  { src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=900&auto=format&fit=crop', label: 'Wireframing' },
  { src: 'https://images.unsplash.com/photo-1542744094-24638ea0b56c?q=80&w=900&auto=format&fit=crop', label: 'Branding' },
  { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop', label: 'Analytics' },
  { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop', label: 'E-commerce' },
  { src: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=900&auto=format&fit=crop', label: 'UI Design' },
];

/* ── Infinite Auto-Scroll Strip ─────────────────── */
function HeroCarousel({ content }) {
  // Inject keyframe animation once
  useEffect(() => {
    const id = 'carousel-keyframes';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = `
        @keyframes skateAcross {
          0% { left: -150px; opacity: 1; }
          45% { left: 100%; opacity: 1; }
          48% { left: 100%; opacity: 0; }
          50% { left: 100%; opacity: 0; }
          52% { left: 100%; opacity: 0; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes skateBack {
          0% { right: -150px; opacity: 0; }
          50% { right: -150px; opacity: 0; }
          52% { right: -150px; opacity: 1; }
          95% { right: 100%; opacity: 1; }
          100% { right: 100%; opacity: 0; }
        }
        @keyframes flyAcrossLeft {
          0% { left: 5%; top: 20%; transform: rotate(15deg); }
          25% { left: 30%; top: 60%; transform: rotate(-5deg); }
          50% { left: 70%; top: 10%; transform: rotate(10deg); }
          75% { left: 40%; top: 80%; transform: rotate(-15deg); }
          100% { left: 5%; top: 20%; transform: rotate(15deg); }
        }
        @keyframes flyAcrossRight {
          0% { right: 5%; top: 40%; transform: scaleX(-1) rotate(-10deg); }
          25% { right: 40%; top: 10%; transform: scaleX(-1) rotate(5deg); }
          50% { right: 80%; top: 70%; transform: scaleX(-1) rotate(-20deg); }
          75% { right: 30%; top: 20%; transform: scaleX(-1) rotate(15deg); }
          100% { right: 5%; top: 40%; transform: scaleX(-1) rotate(-10deg); }
        }
        @keyframes flap {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.2); }
        }
        .bird-wing {
          animation: flap 0.3s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes scroll-carousel {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .carousel-track:hover {
        animation-play-state: paused !important;
      }
        .carousel-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: scroll-carousel 28s linear infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Duplicate for seamless loop
  const items = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];

  return (
    <div style={{
      width: '100vw',
      position: 'relative',
      left: '50%',
      transform: 'translateX(-50%)',
      overflow: 'hidden',
      marginTop: '4rem',
      paddingBottom: '2.5rem',
      maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
    }}>
      <div className="carousel-track" style={{ padding: '1.5rem 0' }}>
        {items.map((img, idx) => (
          <div
            key={idx}
            style={{
              flexShrink: 0,
              width: 320,
              height: 220,
              borderRadius: 20,
              overflow: 'hidden',
              position: 'relative',
              border: 'var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            <EditableImage 
              pageId="home" 
              fieldId={`carouselImage${idx % CAROUSEL_IMAGES.length}`} 
              initialUrl={content[`carouselImage${idx % CAROUSEL_IMAGES.length}`] || img.src} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              recommendedSize="1200 x 800"
              labelFieldId={`carouselLabel${idx % CAROUSEL_IMAGES.length}`}
              initialLabel={content[`carouselLabel${idx % CAROUSEL_IMAGES.length}`] || img.label}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '1.25rem 1rem 0.85rem',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            }}>
              <span style={{
                fontWeight: 700, fontSize: '0.8rem',
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff',
              }}>
                <EditableText 
                  pageId="home" 
                  fieldId={`carouselLabel${idx % CAROUSEL_IMAGES.length}`} 
                  initialText={content[`carouselLabel${idx % CAROUSEL_IMAGES.length}`] || img.label} 
                  tagName="span" 
                />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





const DEFAULT_PROJECTS = [
  { id: 1, title: 'NeoBank App Redesign', category: 'Fintech UI/UX', imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, title: 'E-commerce Evolution', category: 'Web Platform', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop' },
  { id: 3, title: 'AI Marketing Tool', category: 'SaaS Dashboard', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' },
];

const TESTIMONIALS = [
  { name: 'Paul M.', role: 'Build a static website', rating: 5, avatar: '/testimonials/paul.webp', review: 'I hired Kapil Kosare to build a simple website. He kept it clean, elegant and exactly what I wanted. He is courteous, prompt and understood my needs. Swift changes and creative content. Very impressed.' },
  { name: 'Steve O.', role: 'Interactive Website Brochure', rating: 5, avatar: '/testimonials/steve_o.webp', review: '5* Performance. Kapil understood project requirements, he had excellent communication and I would happily employ him to work on future projects. Thank you.' },
  { name: 'Pascal K.', role: 'E-commerce Platform', rating: 5, avatar: '/testimonials/pascal.webp', review: 'All went perfectly. Kapil Kosare is very efficient and communicative. The project was delivered ahead of schedule with top quality.' },
  { name: 'Chris D.', role: 'WordPress Site Design', rating: 5, avatar: '/testimonials/chris.webp', review: 'Excellent work, client is very happy. Did a number of revisions to get it just right. Highly recommended for any web project.' },
  { name: 'Diana R.', role: 'Redesign and Code', rating: 5, avatar: '/testimonials/diana.webp', review: 'Great designer! Fast and understood in a glance what I was looking for! AAAAA++++. The coding was clean and very efficient.' },
  { name: 'Geoff T.', role: 'Auction Site Platform', rating: 5, avatar: '/testimonials/geoff.webp', review: 'I came back to Kapil Kosare due to his work on a prior project, and he did not disappoint again. Great work and extremely reliable.' },
  { name: 'Sam M.', role: 'Website for Construction', rating: 5, avatar: '/testimonials/sam_m.webp', review: 'The designer showed a very great design through contest. He provided a clean and wonderful work, he is also a very lovely person. Excellent work on the construction site.' },
  { name: 'Josh W.', role: 'WordPress Pet Food Site', rating: 5, avatar: '/testimonials/josh_w.webp', review: 'Really great designer for my wordpress mockup. Very creative and understood the niche requirements perfectly.' },
  { name: 'Greenlight W.', role: 'WordPress Site Refresh', rating: 4.4, avatar: "/testimonials/greenlight'.webp", review: 'Extremely patient while we worked out many little details. He never complained and kept showing us alternatives until we were satisfied.' },
];

const hexToRgb = (hex) => {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)}, ${parseInt(r[2],16)}, ${parseInt(r[3],16)}` : '255,255,255';
};

const SERVICES = [
  { icon: <MonitorSmartphone size={28}/>, title:'UI/UX Design',     desc:'Intuitive, user-centric interfaces that drive conversions.', color:'#FF3366', fieldId: 'service1' },
  { icon: <Smartphone size={28}/>,        title:'Mobile App Design', desc:'Premium iOS & Android interfaces focused on user experience.', color:'#00E5FF', fieldId: 'service2' },
  { icon: <Globe size={28}/>,             title:'Websites',          desc:'Fast, scalable custom websites built to impress.', color:'#8A2BE2', fieldId: 'service3' },
  { icon: <LayoutTemplate size={28}/>,    title:'Landing Pages',     desc:'High-converting landing pages that turn visitors into leads.', color:'#FF9933', fieldId: 'service4' },
  { icon: <Clapperboard size={28}/>,      title:'Motion Design',     desc:'Eye-catching animations, reels & video graphics.', color:'#A855F7', fieldId: 'service5' },
  { icon: <FileText size={28}/>,          title:'WordPress',         desc:'Blazing-fast, customised WordPress sites & themes.', color:'#21759B', fieldId: 'service6' },
  { icon: <Cpu size={28}/>,              title:'AI Projects',        desc:'LLM integrations, AI tools & intelligent automation.', color:'#EC4899', fieldId: 'service7' },
  { icon: <Workflow size={28}/>,          title:'n8n Automation',    desc:'End-to-end workflow automation with n8n & APIs.', color:'#FF6B35', fieldId: 'service8' },
  { icon: <FileText size={28}/>,          title:'Case Studies',      desc:'Deep-dive decks & reports that showcase your impact.', color:'#10B981', fieldId: 'service9' },
  { icon: <PenTool size={28}/>,           title:'Brand Identity',    desc:'Striking logos, visual systems & brand guidelines.', color:'#F59E0B', fieldId: 'service10' },
];

const SPECIALTIES = [
  'UI/UX Design', 'Motion Design', 'WordPress', 'n8n Automation',
  'Mobile App Design', 'Websites', 'Landing Pages', 'Case Studies',
  'AI Projects', 'Brand Identity', 'SaaS Dashboards', 'Workflow Automation',
];

const PROCESS = [
  { icon: <Target size={42} strokeWidth={1.5} />, title:'Solid Strategy', desc:'We understand your objectives and audience to build a foolproof roadmap.', color:'#FF3366' },
  { icon: <Lightbulb size={42} strokeWidth={1.5} />, title:'Ideation & Design', desc:'Bold, innovative concepts aligned with your brand identity.', color:'#8A2BE2' },
  { icon: <Rocket size={42} strokeWidth={1.5} />, title:'Build & Launch', desc:'Clean code, stunning design, and optimized performance.', color:'#FF9933' },
  { icon: <TrendingUp size={42} strokeWidth={1.5} />, title:'Evaluate & Grow', desc:'Rigorous testing and continuous iteration for lasting impact.', color:'#00E5FF' },
];


const Counter = ({ end, duration }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const endVal = parseInt(end);
    if (start === endVal) return;
    let totalMilisecDur = duration;
    let incrementTime = (totalMilisecDur / endVal);
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= endVal) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{count}</span>;
};

export default function LandingPage() {
  const { content, loading } = usePageContent('home', {
    heroTitle: 'We Build Digital Partners for Your Business Growth',
    heroSub: 'Elevating brands through stunning, high-performance web experiences and bold digital strategies that drive results.',
    heroCTA: 'Start a Project',
    clientPortal: 'Client Portal',
    uiuxTitle: 'UI/UX',
    uiuxDesc: 'Beautiful, responsive designs that engage.',
    devTitle: 'Development',
    devDesc: 'Fast, scalable websites built with clean code.',
    brandTitle: 'Branding',
    brandDesc: 'Strong identities that leave a lasting impact.',
    statsSectionTitle: 'Our Impact in Numbers',
    statsSectionSub: 'Crafting digital success stories across the globe',
    statsTitle1: 'Years Experience',
    statsSub1: 'Crafting digital excellence',
    statsTitle2: 'Expert Members',
    statsSub2: 'Top-tier creative minds',
    statsTitle3: 'Projects Done',
    statsSub3: 'Delivering results globally',
    statsTitle4: 'Global Clients',
    statsSub4: 'Trusted by industry leaders',
    servicesHeading: 'Crafted for bold Design & Product Experiences',
    servicesSub: 'We blend strategic thinking with bold aesthetics to create digital products that stand out.',
    portfolioTag: 'Featured Work',
    portfolioTitle: 'Final Works For Our Clients',
    whyTitle: 'High Impact Results',
    whySub: 'Our systematic approach ensures every project delivers measurable growth and stunning visual appeal.',
    clientLoveTag: 'Client Love',
    clientLoveTitle: 'What Our Clients Say About Us',
    clientLoveSub: 'Real words from real partners who trusted us with their vision.',
    ctaHeading: 'Got a project that needs our magic touch?',
    ctaSub: "Leave your details and let's create something extraordinary together. We respond within 24 hours.",
    processTitle1: 'Solid Strategy',
    processDesc1: 'We understand your objectives and audience to build a foolproof roadmap.',
    processTitle2: 'Ideation & Design',
    processDesc2: 'Bold, innovative concepts aligned with your brand identity.',
    processTitle3: 'Build & Launch',
    processDesc3: 'Clean code, stunning design, and optimized performance.',
    processTitle4: 'Evaluate & Grow',
    processDesc4: 'Rigorous testing and continuous iteration for lasting impact.',
    service1Title: 'UI/UX Design', service1Desc: 'Intuitive, user-centric interfaces that drive conversions.',
    service2Title: 'Mobile App Design', service2Desc: 'Premium iOS & Android interfaces focused on user experience.',
    service3Title: 'Websites', service3Desc: 'Fast, scalable custom websites built to impress.',
    service4Title: 'Landing Pages', service4Desc: 'High-converting landing pages that turn visitors into leads.',
    service5Title: 'Motion Design', service5Desc: 'Eye-catching animations, reels & video graphics.',
    service6Title: 'WordPress', service6Desc: 'Blazing-fast, customised WordPress sites & themes.',
    service7Title: 'AI Projects', service7Desc: 'LLM integrations, AI tools & intelligent automation.',
    service8Title: 'n8n Automation', service8Desc: 'End-to-end workflow automation with n8n & APIs.',
    service9Title: 'Case Studies', service9Desc: 'Deep-dive decks & reports that showcase your impact.',
    service10Title: 'Brand Identity', service10Desc: 'Striking logos, visual systems & brand guidelines.',
    whyTag: 'High Impact Results',
    whyImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    carouselImage0: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    carouselImage1: 'https://images.unsplash.com/photo-1581291518151-0107e7448817?q=80&w=800&auto=format&fit=crop',
    carouselImage2: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
    carouselImage3: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop',
    carouselImage4: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    carouselImage5: 'https://images.unsplash.com/photo-1626785774625-ddc7c82a1e5e?q=80&w=800&auto=format&fit=crop',
    carouselImage6: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop'
  });

  const [projects, setProjects] = useState(DEFAULT_PROJECTS);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!db) return;
        const snap = await getDocs(collection(db, 'projects'));
        if (!snap.empty) setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {}
    };
    fetch();
  }, []);

  if (loading) return <PageLoader />;
  if (!content) return null;

  return (
    <div style={{ width: '100%', overflowX: 'hidden', position: 'relative' }}>
      
      {/* ── 1. HERO ─────────────────────────────────────── */}
      <section style={{ ...S.hero, backgroundColor: 'var(--bg-main)', backgroundAttachment: 'fixed' }}>
        <ThemeToggle />
        {/* Orbs */}
        <div className="orb orb-pink"  style={{ top: '10%',  left: '-5%', filter: 'blur(120px)', opacity: 0.4 }} />
        <div className="orb orb-purple" style={{ top: '20%', right: '-10%', filter: 'blur(120px)', opacity: 0.3 }} />
        <div className="orb orb-orange" style={{ bottom: '15%', left: '40%', filter: 'blur(100px)', opacity: 0.2 }} />

        {/* Large Birds Flying Across the Hero */}
        <div style={{ position: 'absolute', width: '70px', height: '70px', animation: 'flyAcrossLeft 90s linear infinite', zIndex: 1, pointerEvents: 'none' }}>
          <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%' }}>
            <path className="bird-wing" d="M12 12c-4-4-8-1-8-1s3 4 8 1z" fill="#FF9933" />
            <path className="bird-wing" d="M12 12c4-4 8-1 8-1s-3 4-8 1z" fill="#FF9933" />
            <circle cx="12" cy="12" r="1.5" fill="#FF3366" />
          </svg>
        </div>
        <div style={{ position: 'absolute', width: '70px', height: '70px', animation: 'flyAcrossRight 55s linear infinite', zIndex: 1, pointerEvents: 'none' }}>
          <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%' }}>
            <path className="bird-wing" d="M12 12c-4-4-8-1-8-1s3 4 8 1z" fill="#FF9933" />
            <path className="bird-wing" d="M12 12c4-4 8-1 8-1s-3 4-8 1z" fill="#FF9933" />
            <circle cx="12" cy="12" r="1.5" fill="#FF3366" />
          </svg>
        </div>

        {/* Skating Boy Animation - Fixed at Browser Bottom */}
        <div style={{ position: 'fixed', bottom: '0', left: 0, right: 0, height: '220px', zIndex: 10000, pointerEvents: 'none', overflow: 'hidden' }}>
          <img 
            src="/right-direction.png" 
            alt="Skating Boy Right" 
            style={{ position: 'absolute', bottom: '0', height: '200px', animation: 'skateAcross 60s linear infinite' }} 
          />
          <img 
            src="/left-direction-direction.png" 
            alt="Skating Boy Left" 
            style={{ position: 'absolute', bottom: '0', height: '200px', animation: 'skateBack 60s linear infinite' }} 
          />
        </div>

        {/* Dot Pattern - Bottom Left */}
        <div style={{
          position: 'absolute',
          left: '0',
          top: '35%',
          width: '140px',
          height: '168px',
          opacity: 0.35,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: `radial-gradient(#FF9933 2px, transparent 2px)`,
          backgroundSize: '24px 24px'
        }} />

        {/* Dot Pattern - Top Right */}
        <div style={{
          position: 'absolute',
          right: '-20px',
          top: '15%',
          width: '140px',
          height: '168px',
          opacity: 0.35,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: `radial-gradient(#FF9933 2px, transparent 2px)`,
          backgroundSize: '24px 24px'
        }} />

        <div className="container" style={{ textAlign:'center', position:'relative', zIndex:10 }}>
          <EditableText 
            pageId="home" 
            fieldId="heroTitle" 
            initialText={content.heroTitle} 
            tagName="h1" 
            className="reveal-up"
            style={S.heroTitle}
            displayTransform={(val) => {
              const text = val || "";
              const words = text.split(' ');
              if (words.length < 2) return text;
              const mainPart = words.slice(0, -2).join(' ');
              const lastTwo = words.slice(-2).join(' ');
              return (
                <React.Fragment>
                  {mainPart}{' '}
                  <span className="text-gradient" style={{ position: 'relative', display: 'inline-block' }}>
                    {lastTwo}
                    <svg style={{ position: 'absolute', bottom: '-15px', left: 0, width: '100%', height: '20px', zIndex: -1 }} viewBox="0 0 300 20" fill="none">
                      <path d="M5 15C50 12 150 12 295 18" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
                      <path d="M20 18C80 15 220 15 285 19" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                    </svg>
                  </span>
                </React.Fragment>
              );
            }}
          />

          <EditableText 
            pageId="home" 
            fieldId="heroSub" 
            initialText={content.heroSub} 
            tagName="p" 
            className="reveal-up delay-1"
            style={S.heroSub}
          />

          <div className="reveal-up delay-2" style={{ display:'flex', gap:'2.5rem', justifyContent:'center', alignItems: 'center', marginTop:'3rem', flexWrap:'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ padding:'1.1rem 2.8rem', fontSize:'1.05rem', textDecoration:'none', borderRadius: '50px' }}>
              <EditableText pageId="home" fieldId="heroCTA" initialText={content.heroCTA} tagName="span" /> <ArrowRight size={20} style={{ marginLeft:'0.5rem' }} />
            </Link>
            <Link to="/login" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              textDecoration:'none', 
              fontSize: '1.05rem', 
              fontWeight: 600,
              color: 'var(--text-main)',
              borderBottom: '1.5px solid var(--primary)',
              paddingBottom: '2px'
            }}>
              <EditableText pageId="home" fieldId="clientPortal" initialText={content.clientPortal} tagName="span" />
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'rgba(255,51,102,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>

          {/* Bottom Services Glass Card */}
          <div style={{ 
            marginTop: '5rem',
            display: 'flex',
            justifyContent: 'center',
            padding: '0 1rem'
          }}>
            <div className="glass-strong" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              padding: '1.5rem',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '1100px',
              textAlign: 'left',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '0.75rem 1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${hexToRgb('#FF3366')}, 0.15)`, color: '#FF3366', border: `1px solid rgba(${hexToRgb('#FF3366')}, 0.3)` }}>
                  <MonitorSmartphone size={24} />
                </div>
                <div>
                  <EditableText pageId="home" fieldId="uiuxTitle" initialText={content.uiuxTitle} tagName="h4" style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }} />
                  <EditableText pageId="home" fieldId="uiuxDesc" initialText={content.uiuxDesc} tagName="p" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', lineHeight: 1.4 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '0.75rem 1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${hexToRgb('#8A2BE2')}, 0.15)`, color: '#8A2BE2', border: `1px solid rgba(${hexToRgb('#8A2BE2')}, 0.3)` }}>
                  <Cpu size={24} />
                </div>
                <div>
                  <EditableText pageId="home" fieldId="devTitle" initialText={content.devTitle} tagName="h4" style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }} />
                  <EditableText pageId="home" fieldId="devDesc" initialText={content.devDesc} tagName="p" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', lineHeight: 1.4 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '0.75rem 1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${hexToRgb('#FF9933')}, 0.15)`, color: '#FF9933', border: `1px solid rgba(${hexToRgb('#FF9933')}, 0.3)` }}>
                  <PenTool size={24} />
                </div>
                <div>
                  <EditableText pageId="home" fieldId="brandTitle" initialText={content.brandTitle} tagName="h4" style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }} />
                  <EditableText pageId="home" fieldId="brandDesc" initialText={content.brandDesc} tagName="p" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', lineHeight: 1.4 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Carousel */}
          <HeroCarousel content={content} />
        </div>
      </section>

      {/* ── 2. HIGHLIGHT STATS (Designer Blueprint Style) ── */}
      <section style={{ padding: '1.5rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Creative Background Elements */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 2px 2px, var(--border-color) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.5, pointerEvents: 'none'
        }} />
        
        {/* Animated Pen Tool Path (SVG) */}
        <svg style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '200px', opacity: 0.1, pointerEvents: 'none' }} viewBox="0 0 200 100">
          <path d="M10,80 Q50,10 90,80 T170,80" fill="none" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="10s" repeatCount="indefinite" />
          </path>
          <circle cx="10" cy="80" r="2" fill="var(--primary)" />
          <circle cx="90" cy="80" r="2" fill="var(--primary)" />
          <circle cx="170" cy="80" r="2" fill="var(--primary)" />
        </svg>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            position: 'relative',
            padding: '2rem 0',
          }}>
            {/* Glossy shine effect */}
            <div style={{
              position: 'absolute', top: '-150%', left: '-50%', width: '200%', height: '200%',
              background: 'linear-gradient(45deg, transparent, rgba(255,51,102,0.03), transparent)',
              transform: 'rotate(35deg)',
              animation: 'shine 8s infinite linear'
            }} />

            <div style={{ maxWidth: '800px', margin: '0 auto 3rem', textAlign: 'center' }}>
              <EditableText 
                pageId="home" 
                fieldId="statsSectionTitle" 
                initialText={content.statsSectionTitle} 
                tagName="h2" 
                style={{ 
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                  fontWeight: 900, 
                  lineHeight: 1,
                  fontFamily: 'var(--font-hero)',
                  color: 'var(--text-main)',
                  marginBottom: '1rem'
                }}
                displayTransform={(val) => {
                  const text = val || "";
                  const words = text.split(' ');
                  if (words.length < 2) return text;
                  const mainPart = words.slice(0, -2).join(' ');
                  const lastTwo = words.slice(-2).join(' ');
                  return (
                    <React.Fragment>
                      {mainPart}{' '}
                      <span className="text-gradient" style={{ position: 'relative', display: 'inline-block' }}>
                        {lastTwo}
                        <svg style={{ position: 'absolute', bottom: '-15px', left: 0, width: '100%', height: '20px', zIndex: -1 }} viewBox="0 0 300 20" fill="none">
                          <path d="M5 15C50 12 150 12 295 18" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                      </span>
                    </React.Fragment>
                  );
                }}
              />
              <EditableText 
                pageId="home" 
                fieldId="statsSectionSub" 
                initialText={content.statsSectionSub} 
                tagName="p" 
                style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              textAlign: 'center',
              position: 'relative',
              maxWidth: '1100px',
              margin: '0 auto'
            }}>
              {[
                { n: 15, suffix: '+', l: 'Years Experience', icon: <PenTool size={24} />, sub: 'Crafting digital excellence', color: '#FF3366' },
                { n: 200, suffix: '+', l: 'Projects Done', icon: <Target size={24} />, sub: 'Delivering results globally', color: '#FF9933' },
                { n: 100, suffix: '+', l: 'Global Clients', icon: <Globe size={24} />, sub: 'Trusted by industry leaders', color: '#00E5FF' }
              ].map((item, i) => (
                <div key={i} className="hover-scale" style={{ 
                  position: 'relative', 
                  padding: '2.5rem 2rem',
                  borderRadius: '35px',
                  background: `rgba(${hexToRgb(item.color)}, 0.04)`,
                  backdropFilter: 'blur(15px)',
                  border: `1px solid rgba(${hexToRgb(item.color)}, 0.2)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: `0 20px 40px rgba(0,0,0,0.1), 0 0 20px rgba(${hexToRgb(item.color)}, 0.05)`,
                  overflow: 'hidden'
                }}>
                  {/* Decorative corner light */}
                  <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-20%',
                    width: '100px',
                    height: '100px',
                    background: item.color,
                    filter: 'blur(40px)',
                    opacity: 0.15,
                    zIndex: 0
                  }} />

                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '52px', height: '52px', borderRadius: '16px',
                    background: `rgba(${hexToRgb(item.color)}, 0.12)`, 
                    border: `1px solid rgba(${hexToRgb(item.color)}, 0.3)`,
                    color: item.color, marginBottom: '1.5rem',
                    boxShadow: `0 8px 25px rgba(${hexToRgb(item.color)}, 0.15)`,
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {item.icon}
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-hero)',
                    fontSize: 'clamp(3rem, 6vw, 4rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: '-0.06em',
                    background: `linear-gradient(to bottom, var(--text-main) 20%, ${item.color})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(0 15px 30px rgba(${hexToRgb(item.color)}, 0.4))`,
                    marginBottom: '1rem',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Counter end={item.n} duration={2000} />{item.suffix}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'relative', zIndex: 1 }}>
                    <EditableText 
                      pageId="home" 
                      fieldId={i === 0 ? 'statsTitle1' : i === 1 ? 'statsTitle3' : 'statsTitle4'} 
                      initialText={i === 0 ? content.statsTitle1 : i === 1 ? content.statsTitle3 : content.statsTitle4} 
                      tagName="div" 
                      style={{
                        color: 'var(--text-main)',
                        fontSize: '1.1rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        textAlign: 'center'
                      }}
                    />
                    
                    <EditableText 
                      pageId="home" 
                      fieldId={i === 0 ? 'statsSub1' : i === 1 ? 'statsSub3' : 'statsSub4'} 
                      initialText={i === 0 ? content.statsSub1 : i === 1 ? content.statsSub3 : content.statsSub4} 
                      tagName="div" 
                      style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </section>

      {/* ── 3. SERVICES ──────────────────────────────────── */}
      <section id="services" style={{ padding:'4rem 0 8rem', position:'relative' }}>
        <div className="orb orb-purple" style={{ bottom:0, right:'-10%', opacity:0.5 }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'4rem', flexWrap:'wrap', gap:'2rem' }}>
            <EditableText 
              pageId="home" 
              fieldId="servicesHeading" 
              initialText={content.servicesHeading} 
              tagName="h2" 
              style={{ fontFamily:'var(--font-hero)', fontSize:'clamp(2.5rem, 4vw, 3.5rem)', maxWidth:'560px', letterSpacing:'-0.02em' }}
            />
            <EditableText 
              pageId="home" 
              fieldId="servicesSub" 
              initialText={content.servicesSub} 
              tagName="p" 
              style={{ color:'var(--text-muted)', maxWidth:'380px', fontSize:'1.05rem' }}
            />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'2rem' }}>
            {SERVICES.map((s,i)=>(
              <div key={i} className="glass-card hover-scale" style={{ 
                padding:'2.5rem', 
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: `linear-gradient(135deg, rgba(${hexToRgb(s.color)}, 0.03) 0%, var(--glass-bg) 100%)`,
                border: '1px solid var(--border-color)',
                borderRadius: '24px',
                boxShadow: `0 8px 30px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.05)`
              }}>
                {/* Decorative background glow */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '140px',
                  height: '140px',
                  background: `radial-gradient(circle, rgba(${hexToRgb(s.color)}, 0.12) 0%, transparent 70%)`,
                  borderRadius: '50%',
                  zIndex: 0,
                  pointerEvents: 'none',
                }} />

                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '18px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: `linear-gradient(135deg, rgba(${hexToRgb(s.color)}, 0.15) 0%, rgba(${hexToRgb(s.color)}, 0.05) 100%)`, 
                  color: s.color, 
                  marginBottom: '1.75rem', 
                  border: `1px solid rgba(${hexToRgb(s.color)}, 0.2)`,
                  boxShadow: `inset 0 2px 10px rgba(${hexToRgb(s.color)}, 0.1), 0 8px 16px rgba(${hexToRgb(s.color)}, 0.05)`,
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{ filter: `drop-shadow(0 2px 4px rgba(${hexToRgb(s.color)}, 0.4))` }}>
                    {React.cloneElement(s.icon, { size: 30, strokeWidth: 1.5 })}
                  </div>
                </div>
                
                <EditableText pageId="home" fieldId={`${s.fieldId}Title`} initialText={content[`${s.fieldId}Title`]} tagName="h3" style={{ fontSize:'1.35rem', fontWeight: 800, marginBottom:'0.75rem', color: 'var(--text-main)', position: 'relative', zIndex: 1 }} />
                
                <EditableText pageId="home" fieldId={`${s.fieldId}Desc`} initialText={content[`${s.fieldId}Desc`]} tagName="p" style={{ color:'var(--text-muted)', lineHeight:1.7, fontSize:'1rem', position: 'relative', zIndex: 1 }} />
              </div>
            ))}
          </div>

          {/* Specialty pill tags */}
          <div style={{ marginTop:'4rem', textAlign:'center' }}>
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'1.5rem' }}>Everything We Offer</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem', justifyContent:'center' }}>
              {SPECIALTIES.map((tag, i) => (
                <span key={i} style={{
                  padding:'0.6rem 1.25rem',
                  borderRadius:40,
                  fontSize:'0.9rem',
                  fontWeight:600,
                  background:'var(--pill-bg)',
                  backdropFilter:'blur(8px)',
                  border:'var(--pill-border)',
                  color:'var(--text-main)',
                  transition:'all 0.3s ease',
                  cursor:'default',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. MARQUEE ───────────────────────────────────── */}
      <div className="marquee-container">
        <div className="marquee-content">
          {['Motion Design','WordPress','n8n Automation','Mobile Apps','Landing Pages','AI Projects','Case Studies','Websites','Motion Design','WordPress','n8n Automation','Mobile Apps','Landing Pages','AI Projects','Case Studies','Websites'].map((t,i)=>(
            <span key={i} className="marquee-item">{t}</span>
          ))}
        </div>
      </div>

      {/* ── 5. PORTFOLIO ─────────────────────────────────── */}
      <section id="portfolio" style={{ padding:'8rem 0', position:'relative' }}>
        <div className="orb orb-pink" style={{ top:'20%', left:'-5%', opacity:0.4 }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
            <div className="section-tag" style={{ margin: '0 auto 2rem' }}>
              <Sparkles size={14}/> <EditableText pageId="home" fieldId="portfolioTag" initialText={content.portfolioTag} tagName="span" />
            </div>
            <EditableText 
              pageId="home" 
              fieldId="portfolioTitle" 
              initialText={content.portfolioTitle} 
              tagName="h2" 
              style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 }}
            />
          </div>
          <div style={S.portfolioGrid}>
            {projects.map((p, i) => (
              <div key={p.id} className="glass-card hover-scale" style={{ ...S.portfolioCard, gridColumn: i===0 ? 'span 2' : 'span 1' }}>
                <div style={{ position:'relative', paddingTop: i===0 ? '40%' : '60%', overflow:'hidden', borderRadius:'16px 16px 0 0' }}>
                  <img src={cleanImageUrl(p.imageUrl)} alt={p.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s ease' }} />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(6,4,15,0.7) 0%, transparent 60%)' }} />
                </div>
                <div style={{ padding:'1.75rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <span style={{ color:'var(--primary)', fontSize:'0.8rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>{p.category}</span>
                    <h3 style={{ fontSize:'1.6rem', marginTop:'0.3rem' }}>{p.title}</h3>
                  </div>
                  <button className="btn-outline" style={{ padding:'0.75rem', borderRadius:'50%', flexShrink:0 }}>
                    <ArrowRight size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View More CTA */}
          <div style={{ textAlign:'center', marginTop:'3.5rem' }}>
            <Link to="/portfolio" className="btn-outline" style={{ padding:'1rem 2.5rem', fontSize:'1.05rem', display:'inline-flex', gap:'0.5rem', alignItems:'center' }}>
              View All Projects <ArrowRight size={20}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. PROCESS ───────────────────────────────────── */}
      <section id="about" style={{ padding:'4rem 0 8rem', position:'relative' }}>
        <div className="orb orb-purple" style={{ top:'0%', left:'50%', opacity:0.4 }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:'4rem' }}>
            <div className="section-tag"><EditableText pageId="home" fieldId="whyTag" initialText={content.whyTag} tagName="span" /></div>
            <EditableText pageId="home" fieldId="whyTitle" initialText={content.whyTitle} tagName="h2" style={{ fontFamily:'var(--font-hero)', fontSize:'3.2rem', letterSpacing:'-0.03em' }} />
            <EditableText pageId="home" fieldId="whySub" initialText={content.whySub} tagName="p" style={{ color:'var(--text-muted)', maxWidth:'620px', margin:'1rem auto 0', fontSize:'1.1rem' }} />
          </div>
          <div style={{ maxWidth:780, margin:'0 auto', position:'relative' }}>
            {PROCESS.map((step, i) => (
              <div key={i} className="glass-strong sticky-card hover-scale" style={{ 
                padding:'2.5rem', 
                display:'flex', 
                gap:'2rem', 
                marginBottom:'1.5rem',
                alignItems: 'center',
                background: `linear-gradient(135deg, rgba(${hexToRgb(step.color)}, 0.05) 0%, var(--glass-bg-strong) 100%)`,
                border: `1px solid rgba(${hexToRgb(step.color)}, 0.15)`,
                borderRadius: '24px',
                boxShadow: `0 10px 40px rgba(${hexToRgb(step.color)}, 0.08), inset 0 0 0 1px rgba(255,255,255,0.05)`
              }}>
                <div style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '24px', 
                  background: `linear-gradient(135deg, rgba(${hexToRgb(step.color)}, 0.15) 0%, rgba(${hexToRgb(step.color)}, 0.05) 100%)`, 
                  boxShadow: `inset 0 0 20px rgba(${hexToRgb(step.color)}, 0.2), 0 10px 20px rgba(${hexToRgb(step.color)}, 0.1)`,
                  display:'flex', 
                  alignItems:'center', 
                  justifyContent:'center', 
                  color:step.color, 
                  flexShrink:0 
                }}>
                  <div style={{ filter: `drop-shadow(0 4px 8px rgba(${hexToRgb(step.color)}, 0.4))` }}>
                    {step.icon}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <EditableText pageId="home" fieldId={`processTitle${i+1}`} initialText={content[`processTitle${i+1}`]} tagName="h3" style={{ fontSize:'1.8rem', fontWeight: 800, fontFamily: 'var(--font-hero)', marginBottom:'0.5rem', color: 'var(--text-main)' }} />
                  <EditableText pageId="home" fieldId={`processDesc${i+1}`} initialText={content[`processDesc${i+1}`]} tagName="p" style={{ color:'var(--text-muted)', fontSize:'1.1rem', lineHeight:1.6 }} />
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--bg-main)',
                  boxShadow: `0 4px 15px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(${hexToRgb(step.color)}, 0.2)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: step.color,
                  flexShrink: 0
                }}>
                  <ArrowRight size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. MARQUEE 2 ─────────────────────────────────── */}
      <div className="marquee-container marquee-muted">
        <div className="marquee-content">
          {['5-Star Reviews','Trusted Worldwide','Award Winning','Client First','5-Star Reviews','Trusted Worldwide','Award Winning','Client First'].map((t,i)=>(
            <span key={i} className="marquee-item marquee-item-brand-star" style={{ color:'var(--text-muted)' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── 8. TESTIMONIALS ──────────────────────────────── */}
      <section style={{ padding:'8rem 0', position:'relative', overflow:'hidden' }}>
        <div className="orb orb-purple" style={{ top:'10%', right:'-10%', opacity:0.35 }} />
        <div className="orb orb-pink"   style={{ bottom:'5%', left:'-8%',  opacity:0.25 }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:'5rem' }}>
            <div className="section-tag"><EditableText pageId="home" fieldId="clientLoveTag" initialText={content.clientLoveTag} tagName="span" /></div>
            <EditableText pageId="home" fieldId="clientLoveTitle" initialText={content.clientLoveTitle} tagName="h2" style={{ fontFamily:'var(--font-hero)', fontSize:'clamp(2.5rem, 4vw, 3.5rem)', letterSpacing:'-0.02em', marginBottom:'1rem' }} />
            <EditableText pageId="home" fieldId="clientLoveSub" initialText={content.clientLoveSub} tagName="p" style={{ color:'var(--text-muted)', fontSize:'1.1rem' }} />
            <div style={{ display:'inline-flex', alignItems:'center', gap:'0.75rem', marginTop:'2rem', background:'rgba(255,255,255,0.05)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:40, padding:'0.75rem 1.75rem' }}>
              <div style={{ display:'flex', gap:'3px' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={20} color="#FF9933" fill="#FF9933" />)}
              </div>
              <span style={{ fontWeight:700, fontSize:'1.1rem' }}>4.9</span>
              <span style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>/ 5 &middot; 120+ Reviews</span>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:'1.75rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass-card" style={{ padding:'2.25rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={18}
                      color={s <= t.rating ? '#FF9933' : 'rgba(255,255,255,0.15)'}
                      fill={s <= t.rating  ? '#FF9933' : 'transparent'}
                    />
                  ))}
                  <span style={{ marginLeft:'0.5rem', color:'var(--text-muted)', fontSize:'0.85rem', fontWeight:600 }}>{t.rating}.0 / 5</span>
                </div>
                <EditableText pageId="home" fieldId={`testimonialReview${i}`} initialText={content[`testimonialReview${i}`] || t.review} tagName="p" style={{ color:'var(--text-main)', opacity: 0.9, lineHeight:1.8, fontSize:'1rem', flexGrow:1 }} />
                <div style={{ display:'flex', alignItems:'center', gap:'1rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <img src={t.avatar} alt={t.name} style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(255,51,102,0.3)' }} />
                  <div>
                    <EditableText pageId="home" fieldId={`testimonialName${i}`} initialText={content[`testimonialName${i}`] || t.name} tagName="div" style={{ fontWeight:700, fontSize:'1rem', color: 'var(--text-main)' }} />
                    <EditableText pageId="home" fieldId={`testimonialRole${i}`} initialText={content[`testimonialRole${i}`] || t.role} tagName="div" style={{ color:'var(--text-muted)', fontSize:'0.85rem' }} />
                  </div>
                  <div style={{ marginLeft:'auto', background:'var(--primary-gradient)', borderRadius:8, padding:'0.3rem 0.75rem', fontSize:'0.75rem', fontWeight:700 }}>Verified</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

const S = {
  hero: {
    padding: '12rem 0 4rem',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  },
  heroTitle: {
    fontFamily:'var(--font-hero)',
    fontSize:'clamp(3.5rem, 6vw, 5.8rem)',
    maxWidth:'1050px',
    margin:'0 auto 1.5rem',
    letterSpacing:'-0.03em',
    lineHeight:1.05,
    fontWeight:800,
  },
  heroSub: {
    fontSize:'1.25rem',
    color:'var(--text-muted)',
    maxWidth:'620px',
    margin:'0 auto',
    lineHeight:1.7,
  },
  heroImgGrid: {
    display:'grid',
    gridTemplateColumns:'1fr 1.4fr 1fr',
    gap:'1.5rem',
    marginTop:'5rem',
    alignItems:'center',
  },
  heroImgWrap: {
    overflow:'hidden',
    padding:0,
    borderRadius:20,
  },
  heroImg: {
    width:'100%',
    height:'260px',
    objectFit:'cover',
    display:'block',
  },
  portfolioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
    gap: '2rem',
  },
  portfolioCard: {
    overflow:'hidden',
    display:'flex',
    flexDirection:'column',
  },
};
