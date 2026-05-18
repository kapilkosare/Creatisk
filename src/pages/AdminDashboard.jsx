import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Settings, Layout, Moon, Sun, Palette, LogOut, Save, Loader2, Edit2, Trash2, Zap, Home, Info, Briefcase, Folder, Target, Mail, Images } from 'lucide-react';
import { GRADIENTS } from '../constants/theme';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [pagesData, setPagesData] = useState({
    home: { 
      heroTitle: 'Precision Design for <br /> Business Growth.', 
      heroSub: 'Creatisk is a boutique digital agency specialized in crafting high-end visual experiences. We blend strategic thinking with bold aesthetics to create digital products that stand out.', 
      heroCTA: 'Start a Project',
      statsProjects: '120', statsClients: '4', statsExperience: '15',
      whyTitle: 'Crafted for bold Design & Product Experiences',
      whySub: 'We focus on creating modern, immersive and user-centered digital experiences for startups, wellness brands and modern businesses.',
      specialties: 'Motion Design, WordPress, n8n Automation, Mobile App Design, Websites, Landing Pages, Case Studies, AI Projects, UI/UX Design, Brand Identity'
    },
    about: { 
      title: 'We Design The Future.', 
      subtitle: "Creatisk is a boutique digital agency specialized in crafting high-end visual experiences. We don't just follow trends—we set them.", 
      missionTitle: 'Our Mission', 
      missionText: 'To push the boundaries of digital creativity and deliver exceptional value through innovative design and technology.', 
      expertiseTitle: 'Specialized Expertise', 
      expertiseList: 'UI/UX Design, Mobile App Design, Landing Pages, Websites, WordPress, Brand Identity, Motion Design, AI Projects, n8n Automation, Case Studies', 
      studioImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop' 
    },
    services: { 
      heroTitle: 'Our Specialized <span class="text-gradient">Expertise</span>', 
      heroSub: 'From pixel-perfect UI/UX to complex AI-driven automations, we deliver excellence at every layer of the digital stack.' 
    },
    portfolio: {
      heroTitle: 'Final Works For <span class="text-gradient">Our Clients</span>',
      heroSub: 'Explore our latest projects where strategy meets stunning design.'
    },
    contact: { 
      heroTitle: "Let's Talk Business.", 
      heroSub: 'Ready to start a revolution? Drop us a line and let\'s discuss how we can bring your vision to life.', 
      email: 'hello@creatisk.in', 
      address: 'Global Operations', 
      formTitle: 'Project Planner' 
    }
  });
  const [globalSettings, setGlobalSettings] = useState({ 
    theme: 'dark', 
    gradientIndex: 0,
    notificationEmails: 'hello@creatisk.in, kapil.webfoxtech@gmail.com',
    heroBgMode: 'theme',
    heroBgColor: '#ffffff',
    heroOpacity: 0.75,
    logoLight: '',
    logoDark: ''
  });
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ 
    title: '', category: '', imageUrl: '', link: '', 
    description: '', client: '', year: '', tools: '',
    challenge: '', solution: '', result: ''
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const pageDocs = ['home', 'about', 'services', 'portfolio', 'contact'];
      const fetchedPages = { ...pagesData };
      for (const page of pageDocs) {
        const snap = await getDoc(doc(db, 'content', page));
        if (snap.exists()) fetchedPages[page] = snap.data();
      }
      setPagesData(fetchedPages);
      const settingsSnap = await getDoc(doc(db, 'content', 'global'));
      if (settingsSnap.exists()) setGlobalSettings(prev => ({ ...prev, ...settingsSnap.data() }));
      const querySnapshot = await getDocs(collection(db, 'projects'));
      setProjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const inquiriesSnapshot = await getDocs(collection(db, 'inquiries'));
      setInquiries(inquiriesSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })).sort((a, b) => b.timestamp - a.timestamp));

      if (activeTab === 'media') fetchMedia();
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchMedia = async () => {
    setMediaLoading(true);
    try {
      // We now fetch from Firestore instead of listAll to avoid CORS issues
      const querySnapshot = await getDocs(collection(db, 'media'));
      const files = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setMediaFiles(files);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setMediaLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'media') fetchMedia();
  }, [activeTab]);

  const handleDeleteMedia = async (file) => {
    if (!window.confirm(`Permanently delete this image?`)) return;
    setLoading(true);
    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, 'media', file.id));
      
      // 2. Try to delete from Storage if it's a cloud file
      if (file.url.includes('firebasestorage')) {
        try {
          // Extract path from URL or use a stored fullPath
          // For simplicity, we just delete the database entry. 
          // If you want to delete the actual file, we'd need the path.
          // Since the user is having CORS issues, deleting from DB is the safe start.
        } catch (e) { console.warn("Storage file delete skipped"); }
      }
      
      setSuccess('Image removed from library!');
      fetchMedia();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert("Error removing: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePage = async (page) => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'content', page), pagesData[page]);
      setSuccess('Updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) { alert(error.message); } finally { setLoading(false); }
  };

  const handleSaveGlobal = async () => {
    setLoading(true);
    setSuccess('');
    try {
      await setDoc(doc(db, 'content', 'global'), globalSettings);
      setSuccess('Settings saved!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) { alert("Error: " + error.message); } finally { setLoading(false); }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/login'); };

  return (
    <div style={{ background: 'var(--bg-gradient)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', backgroundAttachment: 'fixed' }}>
      <div style={{ width: '280px', background: 'var(--glass-bg)', borderRight: 'var(--glass-border)', padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem', padding: '0 0.5rem' }}>
          <img src="/logo-creatiks_black.png" alt="Creatisk" style={{ height: '40px', width: 'auto' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
          {[
            { id: 'home', icon: <Home size={18}/> },
            { id: 'about', icon: <Info size={18}/> },
            { id: 'services', icon: <Briefcase size={18}/> },
            { id: 'portfolio', icon: <Folder size={18}/> },
            { id: 'projects', icon: <Target size={18}/> },
            { id: 'media', icon: <Images size={18}/> },
            { id: 'inquiries', icon: <Mail size={18}/>, label: 'Mails' },
            { id: 'contact', icon: <Mail size={18}/> },
            { id: 'global', icon: <Palette size={18}/> }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', 
                padding: '0.85rem 1.25rem', 
                background: activeTab === tab.id ? 'var(--glass-bg-strong)' : 'transparent', 
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)', 
                border: activeTab === tab.id ? '1px solid var(--border-color)' : '1px solid transparent', 
                borderRadius: '12px', cursor: 'pointer', fontWeight: 600,
                transition: 'all 0.2s ease',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
              }}
              onMouseEnter={(e) => { if(activeTab !== tab.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={(e) => { if(activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; }}
            >
              {tab.icon} 
              <span style={{ fontSize: '0.9rem' }}>{tab.label || tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}</span>
            </button>
          ))}
        </div>

        <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleLogout} style={{ 
            display: 'flex', alignItems: 'center', gap: '1rem', 
            padding: '1rem', width: '100%',
            color: '#FF3366', background: 'rgba(255, 51, 102, 0.05)', 
            border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700,
            fontSize: '0.9rem', transition: 'all 0.2s ease'
          }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
      <div style={{ marginLeft: '280px', flex: 1, padding: '4rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{activeTab.toUpperCase()}</h1>
            {success && <div style={{ color: '#BEF264', fontWeight: 600 }}>{success}</div>}
          </div>
          {activeTab === 'global' && (
            <div className="glass-strong" style={{ padding: '3rem', borderRadius: '30px' }}>
              <h3 style={{ marginBottom: '2rem' }}>Mode</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
                <button onClick={() => setGlobalSettings({...globalSettings, theme: 'dark'})} style={{ flex: 1, padding: '2rem', borderRadius: '24px', background: globalSettings.theme === 'dark' ? 'rgba(190, 242, 100, 0.1)' : 'var(--pill-bg)', border: globalSettings.theme === 'dark' ? '1px solid var(--primary)' : 'var(--glass-border)', color: 'var(--text-main)' }}><Moon size={24}/> Dark</button>
                <button onClick={() => setGlobalSettings({...globalSettings, theme: 'light'})} style={{ flex: 1, padding: '2rem', borderRadius: '24px', background: globalSettings.theme === 'light' ? 'rgba(190, 242, 100, 0.1)' : 'var(--pill-bg)', border: globalSettings.theme === 'light' ? '1px solid var(--primary)' : 'var(--glass-border)', color: 'var(--text-main)' }}><Sun size={24}/> Light</button>
              </div>
              <h3 style={{ marginBottom: '1.5rem', opacity: 0.7, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Standard Styles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '4rem' }}>
                {GRADIENTS.slice(0, 20).map((g, i) => (
                  <div 
                    key={i} 
                    onClick={() => setGlobalSettings({...globalSettings, gradientIndex: i})} 
                    style={{ 
                      height: '100px', borderRadius: '15px', 
                      background: globalSettings.theme === 'dark' ? g.dark : g.light, 
                      border: globalSettings.gradientIndex === i ? '3px solid #BEF264' : '1px solid rgba(255,255,255,0.1)', 
                      cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:800,
                      color: globalSettings.theme === 'light' ? '#000' : '#fff', textAlign: 'center', padding: '0.5rem'
                    }}
                  >
                    {g.name}
                  </div>
                ))}
              </div>

              <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Advanced Color Categories</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                {GRADIENTS.slice(20).map((g, i) => {
                  const realIndex = i + 20;
                  return (
                    <div 
                      key={realIndex} 
                      onClick={() => setGlobalSettings({...globalSettings, gradientIndex: realIndex})} 
                      style={{ 
                        height: '100px', borderRadius: '15px', 
                        background: globalSettings.theme === 'dark' ? g.dark : g.light, 
                        border: globalSettings.gradientIndex === realIndex ? '3px solid #BEF264' : '1px solid rgba(255,255,255,0.1)', 
                        cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:800,
                        color: globalSettings.theme === 'light' ? '#000' : '#fff', textAlign: 'center', padding: '0.5rem'
                      }}
                    >
                      {g.name}
                    </div>
                  );
                })}
              </div>
              <h3 style={{ marginBottom: '1.5rem', color: '#00E5FF', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Solid Professional Colors</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                {GRADIENTS.slice(30).map((g, i) => {
                  const realIndex = i + 30;
                  return (
                    <div 
                      key={realIndex} 
                      onClick={() => setGlobalSettings({...globalSettings, gradientIndex: realIndex})} 
                      style={{ 
                        height: '100px', borderRadius: '15px', 
                        background: globalSettings.theme === 'dark' ? g.dark : g.light, 
                        border: globalSettings.gradientIndex === realIndex ? '3px solid var(--primary)' : '1px solid var(--border-color)', 
                        cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:800,
                        color: globalSettings.theme === 'light' ? '#000' : '#fff', textAlign: 'center', padding: '0.5rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      {g.name}
                    </div>
                  );
                })}
              </div>
              <h3 style={{ marginBottom: '1.5rem', color: '#BEF264', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Custom Color Studio</h3>
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '2rem', 
                borderRadius: '20px', 
                border: '1px solid var(--border-color)',
                marginBottom: '3rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Gradient Color 1</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                      <input 
                        type="color" 
                        value={globalSettings.customColor1 || '#FF3366'} 
                        onChange={(e) => setGlobalSettings({...globalSettings, customColor1: e.target.value})}
                        style={{ width: '50px', height: '50px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                      />
                      <input 
                        type="text" 
                        value={globalSettings.customColor1 || '#FF3366'} 
                        onChange={(e) => setGlobalSettings({...globalSettings, customColor1: e.target.value})}
                        className="input-glass"
                        style={{ flexGrow: 1, padding: '0.75rem 1.25rem' }}
                      />
                    </div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Opacity: {Math.round((globalSettings.customOpacity1 || 0.2) * 100)}%</label>
                    <input 
                      type="range" min="0" max="1" step="0.05"
                      value={globalSettings.customOpacity1 || 0.2}
                      onChange={(e) => setGlobalSettings({...globalSettings, customOpacity1: parseFloat(e.target.value)})}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Gradient Color 2</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                      <input 
                        type="color" 
                        value={globalSettings.customColor2 || '#8A2BE2'} 
                        onChange={(e) => setGlobalSettings({...globalSettings, customColor2: e.target.value})}
                        style={{ width: '50px', height: '50px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                      />
                      <input 
                        type="text" 
                        value={globalSettings.customColor2 || '#8A2BE2'} 
                        onChange={(e) => setGlobalSettings({...globalSettings, customColor2: e.target.value})}
                        className="input-glass"
                        style={{ flexGrow: 1, padding: '0.75rem 1.25rem' }}
                      />
                    </div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Opacity: {Math.round((globalSettings.customOpacity2 || 0.15) * 100)}%</label>
                    <input 
                      type="range" min="0" max="1" step="0.05"
                      value={globalSettings.customOpacity2 || 0.15}
                      onChange={(e) => setGlobalSettings({...globalSettings, customOpacity2: parseFloat(e.target.value)})}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setGlobalSettings({...globalSettings, gradientIndex: -1})} 
                  style={{ 
                    width: '100%', padding: '1rem', borderRadius: '12px', 
                    background: `linear-gradient(135deg, ${globalSettings.customColor1 || '#FF3366'}, ${globalSettings.customColor2 || '#8A2BE2'})`,
                    color: '#fff', border: globalSettings.gradientIndex === -1 ? '3px solid #BEF264' : 'none',
                    fontWeight: 700, cursor: 'pointer', fontSize: '1rem'
                  }}
                >
                  Apply Custom Gradient
                </button>
              </div>

              <h3 style={{ marginBottom: '1.5rem', color: '#00E5FF', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Atmospheric Glow Studio</h3>
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '2rem', 
                borderRadius: '20px', 
                border: '1px solid var(--border-color)',
                marginBottom: '3rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Glow Color 1</label>
                    <input 
                      type="color" 
                      value={globalSettings.orbColor1 || '#FF3366'} 
                      onChange={(e) => setGlobalSettings({...globalSettings, orbColor1: e.target.value})}
                      style={{ width: '100%', height: '50px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '1rem' }}
                    />
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Glow Opacity: {Math.round((globalSettings.orbOpacity1 ?? 0.25) * 100)}%</label>
                    <input 
                      type="range" min="0" max="1" step="0.05"
                      value={globalSettings.orbOpacity1 ?? 0.25}
                      onChange={(e) => setGlobalSettings({...globalSettings, orbOpacity1: parseFloat(e.target.value)})}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Glow Color 2</label>
                    <input 
                      type="color" 
                      value={globalSettings.orbColor2 || '#8A2BE2'} 
                      onChange={(e) => setGlobalSettings({...globalSettings, orbColor2: e.target.value})}
                      style={{ width: '100%', height: '50px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '1rem' }}
                    />
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Glow Opacity: {Math.round((globalSettings.orbOpacity2 ?? 0.25) * 100)}%</label>
                    <input 
                      type="range" min="0" max="1" step="0.05"
                      value={globalSettings.orbOpacity2 ?? 0.25}
                      onChange={(e) => setGlobalSettings({...globalSettings, orbOpacity2: parseFloat(e.target.value)})}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              <h3 style={{ marginBottom: '1.5rem', color: '#BEF264', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Logo Brand Studio</h3>
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '2rem', 
                borderRadius: '20px', 
                border: '1px solid var(--border-color)',
                marginBottom: '3rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Light Theme Logo URL</label>
                    <input 
                      type="text" 
                      value={globalSettings.logoLight || ''} 
                      onChange={(e) => setGlobalSettings({...globalSettings, logoLight: e.target.value})}
                      placeholder="/logo-creatiks_black.png or https://example.com/logo-light.png"
                      className="input-glass"
                      style={{ padding: '0.75rem 1.25rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Dark Theme Logo URL</label>
                    <input 
                      type="text" 
                      value={globalSettings.logoDark || ''} 
                      onChange={(e) => setGlobalSettings({...globalSettings, logoDark: e.target.value})}
                      placeholder="/logo-creatiks_black.png or https://example.com/logo-dark.png"
                      className="input-glass"
                      style={{ padding: '0.75rem 1.25rem' }}
                    />
                  </div>
                </div>
                
                {/* Brand Preview */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                  <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', fontWeight: 600 }}>Light Theme Preview</div>
                    <img 
                      src={globalSettings.logoLight || '/logo-creatiks_black.png'} 
                      alt="Light Logo Preview" 
                      style={{ maxHeight: '48px', maxWidth: '100%', objectFit: 'contain' }}
                      onError={(e) => { e.target.src = '/logo-creatiks_black.png'; }}
                    />
                  </div>
                  <div style={{ background: '#06040f', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', fontWeight: 600 }}>Dark Theme Preview</div>
                    <img 
                      src={globalSettings.logoDark || '/logo-creatiks_black.png'} 
                      alt="Dark Logo Preview" 
                      style={{ maxHeight: '48px', maxWidth: '100%', objectFit: 'contain' }}
                      onError={(e) => { e.target.src = '/logo-creatiks_black.png'; }}
                    />
                  </div>
                </div>
              </div>

              <h3 style={{ marginBottom: '1.5rem', color: '#FF9933', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hero & Header Background Studio</h3>
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '2rem', 
                borderRadius: '20px', 
                border: '1px solid var(--border-color)',
                marginBottom: '3rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Background Mode</label>
                    <select 
                      value={globalSettings.heroBgMode || 'theme'} 
                      onChange={(e) => setGlobalSettings({...globalSettings, heroBgMode: e.target.value})}
                      className="input-glass"
                      style={{ padding: '0.75rem 1.25rem' }}
                    >
                      <option value="theme" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>Adaptive Theme Background (White/Black)</option>
                      <option value="custom" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>Custom Solid Background</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Custom Background Color</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input 
                        type="color" 
                        value={globalSettings.heroBgColor || '#ffffff'} 
                        onChange={(e) => setGlobalSettings({...globalSettings, heroBgColor: e.target.value})}
                        disabled={globalSettings.heroBgMode === 'theme'}
                        style={{ width: '50px', height: '44px', border: 'none', borderRadius: '8px', cursor: 'pointer', opacity: globalSettings.heroBgMode === 'theme' ? 0.4 : 1 }}
                      />
                      <input 
                        type="text" 
                        value={globalSettings.heroBgColor || '#ffffff'} 
                        onChange={(e) => setGlobalSettings({...globalSettings, heroBgColor: e.target.value})}
                        disabled={globalSettings.heroBgMode === 'theme'}
                        className="input-glass"
                        style={{ flexGrow: 1, padding: '0.75rem 1.25rem', opacity: globalSettings.heroBgMode === 'theme' ? 0.4 : 1 }}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Hero Background Opacity: {Math.round((globalSettings.heroOpacity ?? 0.75) * 100)}%</label>
                  <input 
                    type="range" min="0" max="1" step="0.01"
                    value={globalSettings.heroOpacity ?? 0.75}
                    onChange={(e) => setGlobalSettings({...globalSettings, heroOpacity: parseFloat(e.target.value)})}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    0% makes the Hero completely transparent (full background gradient). 100% makes it fully solid (hides background gradient completely).
                  </p>
                </div>
              </div>

              <h3 style={{ marginBottom: '1.5rem', color: '#BEF264', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Inquiry Notifications</h3>
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '2rem', 
                borderRadius: '20px', 
                border: '1px solid var(--border-color)',
                marginBottom: '3rem'
              }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Recipient Emails (Comma separated)</label>
                <input 
                  type="text" 
                  value={globalSettings.notificationEmails || ''} 
                  onChange={(e) => setGlobalSettings({...globalSettings, notificationEmails: e.target.value})}
                  placeholder="hello@creatisk.in, kapil.webfoxtech@gmail.com"
                  className="input-glass"
                  style={{ padding: '0.75rem 1.25rem' }}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>These emails will receive all form submissions from the website.</p>
              </div>

              <button onClick={handleSaveGlobal} className="btn-primary" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>} Save Settings
              </button>
            </div>
          )}
          {activeTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <div className="glass-strong" style={{ padding: '3rem', borderRadius: '30px' }}>
                <h3 style={{ marginBottom: '2rem' }}>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <input type="text" placeholder="Title" className="input-glass" value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} />
                  <input type="text" placeholder="Category" className="input-glass" value={projectForm.category} onChange={(e) => setProjectForm({...projectForm, category: e.target.value})} />
                  <input type="text" placeholder="Client Name" className="input-glass" value={projectForm.client} onChange={(e) => setProjectForm({...projectForm, client: e.target.value})} />
                  <input type="text" placeholder="Year (e.g. 2025)" className="input-glass" value={projectForm.year} onChange={(e) => setProjectForm({...projectForm, year: e.target.value})} />
                  <input type="text" placeholder="Image URL" className="input-glass" value={projectForm.imageUrl} onChange={(e) => setProjectForm({...projectForm, imageUrl: e.target.value})} />
                  <input type="text" placeholder="Tools (comma separated)" className="input-glass" value={projectForm.tools} onChange={(e) => setProjectForm({...projectForm, tools: e.target.value})} />
                  <input type="text" placeholder="Live Link" className="input-glass" value={projectForm.link} onChange={(e) => setProjectForm({...projectForm, link: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                  <textarea placeholder="Brief Description" className="input-glass" rows="3" value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} style={{ resize: 'none' }} />
                  <textarea placeholder="The Challenge" className="input-glass" rows="4" value={projectForm.challenge} onChange={(e) => setProjectForm({...projectForm, challenge: e.target.value})} style={{ resize: 'none' }} />
                  <textarea placeholder="The Solution" className="input-glass" rows="4" value={projectForm.solution} onChange={(e) => setProjectForm({...projectForm, solution: e.target.value})} style={{ resize: 'none' }} />
                  <textarea placeholder="The Result" className="input-glass" rows="4" value={projectForm.result} onChange={(e) => setProjectForm({...projectForm, result: e.target.value})} style={{ resize: 'none' }} />
                </div>
                {projectForm.imageUrl && (
                  <img src={projectForm.imageUrl} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px', marginBottom: '2rem' }} />
                )}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={async () => {
                    setLoading(true);
                    try {
                      if (editingProject) {
                        await updateDoc(doc(db, 'projects', editingProject.id), projectForm);
                      } else {
                        await addDoc(collection(db, 'projects'), projectForm);
                      }
                      setProjectForm({ 
                        title: '', category: '', imageUrl: '', link: '', 
                        description: '', client: '', year: '', tools: '',
                        challenge: '', solution: '', result: ''
                      });
                      setEditingProject(null);
                      fetchAllData();
                      setSuccess('Project saved!');
                    } catch (e) { alert(e.message); } finally { setLoading(false); }
                  }} className="btn-primary">{editingProject ? 'Update' : 'Add'} Project</button>
                  {editingProject && <button onClick={() => { setEditingProject(null); setProjectForm({ title: '', category: '', imageUrl: '', link: '', description: '', client: '', year: '', tools: '', challenge: '', solution: '', result: '' }); }} style={{ padding: '1rem 2rem', background: 'var(--pill-bg)', border: '1px solid var(--border-color)', borderRadius: '40px', color: 'var(--text-main)', cursor: 'pointer' }}>Cancel</button>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {projects.map(p => (
                  <div key={p.id} className="glass-card" style={{ padding: '1.5rem' }}>
                    <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1rem' }} />
                    <h4 style={{ marginBottom: '0.5rem' }}>{p.title}</h4>
                    <p style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '1.5rem' }}>{p.category}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={() => { 
                        setEditingProject(p); 
                        setProjectForm({
                          title: '', category: '', imageUrl: '', link: '', 
                          description: '', client: '', year: '', tools: '',
                          challenge: '', solution: '', result: '',
                          ...p
                        }); 
                      }} style={{ flex: 1, padding: '0.75rem', background: 'var(--pill-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}><Edit2 size={16}/> Edit Project</button>
                      <button onClick={async () => {
                        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
                        setLoading(true);
                        try {
                          await deleteDoc(doc(db, 'projects', p.id));
                          fetchAllData();
                          setSuccess('Project permanently deleted');
                        } catch (e) { alert(e.message); } finally { setLoading(false); }
                      }} style={{ flex: 1, padding: '0.75rem', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.2)', borderRadius: '12px', color: '#FF3366', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}><Trash2 size={16}/> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'media' && (
            <div className="glass-strong" style={{ padding: '3rem', borderRadius: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0 }}>Cloud Storage Library</h3>
                <button onClick={fetchMedia} style={{ padding: '0.5rem 1rem', background: 'var(--pill-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.8rem' }}>Refresh</button>
              </div>

              {mediaLoading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" size={40} style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '1rem', opacity: 0.5 }}>Loading media...</p>
                </div>
              ) : mediaFiles.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
                  <p style={{ opacity: 0.5 }}>No images found in your Cloud Storage.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                  {mediaFiles.map((file, i) => (
                    <div key={i} className="hover-scale" style={{ 
                      borderRadius: '16px', overflow: 'hidden', 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      position: 'relative'
                    }}>
                      <div style={{ aspectRatio: '1/1' }}>
                        <img src={file.url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '0.75rem', position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{file.name}</div>
                        <button 
                          onClick={() => handleDeleteMedia(file)}
                          style={{ background: 'rgba(255, 51, 102, 0.2)', border: 'none', color: '#FF3366', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'inquiries' && (
            <div className="glass-strong" style={{ padding: '3rem', borderRadius: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h3 style={{ margin: 0 }}>Form Inquiries ({inquiries.length})</h3>
                <button onClick={fetchAllData} style={{ padding: '0.5rem 1rem', background: 'var(--pill-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.8rem' }}>Refresh</button>
              </div>

              {inquiries.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
                  <Mail size={48} style={{ margin: '0 auto 1.5rem', display: 'block' }} />
                  <p>No messages received yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {inquiries.map((iq) => (
                    <div key={iq.id} className="glass-card" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{iq.name}</div>
                          <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>{iq.email}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{iq.timestamp?.toLocaleString()}</div>
                          <div style={{ 
                            fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', 
                            color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', 
                            padding: '0.2rem 0.6rem', borderRadius: '10px', marginTop: '0.5rem',
                            display: 'inline-block'
                          }}>Source: {iq.source}</div>
                        </div>
                      </div>
                      
                      {iq.budget && (
                        <div style={{ marginBottom: '1.5rem', background: 'rgba(190, 242, 100, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(190, 242, 100, 0.1)' }}>
                          <span style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', marginRight: '0.5rem' }}>Budget:</span>
                          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{iq.budget}</span>
                        </div>
                      )}

                      <div style={{ 
                        background: 'rgba(0,0,0,0.2)', 
                        padding: '1.5rem', 
                        borderRadius: '16px', 
                        fontSize: '1rem', 
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        marginBottom: '1.5rem'
                      }}>
                        {iq.message}
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href={`mailto:${iq.email}`} className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Reply via Email</a>
                        <button onClick={async () => {
                          if (!window.confirm('Delete this inquiry?')) return;
                          setLoading(true);
                          try {
                            await deleteDoc(doc(db, 'inquiries', iq.id));
                            fetchAllData();
                            setSuccess('Inquiry deleted');
                            setTimeout(() => setSuccess(''), 3000);
                          } catch (e) { alert(e.message); } finally { setLoading(false); }
                        }} style={{ padding: '0.6rem 1.2rem', background: 'rgba(255, 51, 102, 0.1)', color: '#FF3366', border: 'none', borderRadius: '40px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab !== 'projects' && activeTab !== 'global' && activeTab !== 'media' && activeTab !== 'inquiries' && (
            <div className="glass-strong" style={{ padding: '3rem', borderRadius: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {Object.keys(pagesData[activeTab] || {}).map(key => (
                  <div key={key}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5, textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</label>
                    <textarea className="input-glass" value={pagesData[activeTab][key]} onChange={(e) => setPagesData({...pagesData, [activeTab]: { ...pagesData[activeTab], [key]: e.target.value }})} style={{ width: '100%', minHeight: '80px' }} />
                    {key.toLowerCase().includes('image') && pagesData[activeTab][key] && (
                      <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.5rem' }}>Image Preview:</p>
                        <img src={pagesData[activeTab][key]} alt="Preview" style={{ maxWidth: '100%', height: '150px', objectFit: 'contain', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }} />
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={() => handleSavePage(activeTab)} className="btn-primary" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>} Update {activeTab}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
