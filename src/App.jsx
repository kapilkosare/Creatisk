import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { GRADIENTS } from './constants/theme';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PortfolioPage from './pages/PortfolioPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Layout = ({ children, user }) => {
  const location = useLocation();
  const hide = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');
  return (
    <>
      {!hide && <Navbar user={user} />}
      {children}
      {!hide && <Footer />}
    </>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeLoading, setThemeLoading] = useState(true);
  const [globalData, setGlobalData] = useState(null);

  // Apply cached theme immediately to prevent flashing
  useEffect(() => {
    const userTheme = localStorage.getItem('creatisk-user-theme');
    const cachedTheme = userTheme || localStorage.getItem('creatisk-theme') || 'dark';
    const cachedGrad = localStorage.getItem('creatisk-gradient');
    const cachedIsSolid = localStorage.getItem('creatisk-is-solid') === 'true';
    const cachedHeroOpacity = localStorage.getItem('creatisk-hero-opacity') || '0.75';
    const cachedHeroBgMode = localStorage.getItem('creatisk-hero-bg-mode') || 'theme';
    const cachedHeroBgColor = localStorage.getItem('creatisk-hero-bg-color') || '#ffffff';
    const root = document.documentElement;
    
    root.setAttribute('data-theme', cachedTheme);
    if (cachedGrad) root.style.setProperty('--bg-gradient', cachedGrad);
    root.style.setProperty('--orb-visibility', cachedIsSolid ? 'hidden' : 'visible');
    
    let cachedBg = '';
    if (cachedHeroBgMode === 'custom' && cachedHeroBgColor) {
      const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cachedHeroBgColor);
      cachedBg = r ? `rgba(${parseInt(r[1],16)}, ${parseInt(r[2],16)}, ${parseInt(r[3],16)}, ${cachedHeroOpacity})` : `rgba(255, 255, 255, ${cachedHeroOpacity})`;
    } else {
      cachedBg = cachedTheme === 'light' ? `rgba(255, 255, 255, ${cachedHeroOpacity})` : `rgba(6, 4, 15, ${cachedHeroOpacity})`;
    }
    root.style.setProperty('--hero-bg-color', cachedBg);
    
    document.body.style.backgroundColor = cachedTheme === 'light' ? '#ffffff' : '#06040f';
  }, []);

  // Fetch settings from Firestore
  useEffect(() => {
    if (!db) {
      setThemeLoading(false);
      return;
    }
    const unsub = onSnapshot(doc(db, 'content', 'global'), (snap) => {
      if (snap.exists()) {
        setGlobalData(snap.data());
      }
      setThemeLoading(false);
    });
    return () => unsub();
  }, []);

  // Theme & Colors Rendering Engine (Runs on Firestore changes OR local toggle events)
  useEffect(() => {
    if (!globalData) return;

    const applyThemeAndColors = () => {
      const toHex = (o) => {
        const h = Math.round(o * 255).toString(16);
        return h.length === 1 ? '0' + h : h;
      };
      
      const { theme, gradientIndex } = globalData;
      const root = document.documentElement;
      
      // Prioritize user preference over the site owner's default theme choice
      const userTheme = localStorage.getItem('creatisk-user-theme');
      const activeTheme = userTheme || theme || 'dark';
      
      root.setAttribute('data-theme', activeTheme);
      
      let colors = '';
      if (gradientIndex === -1) {
        const c1 = globalData.customColor1 || '#FF3366';
        const c2 = globalData.customColor2 || '#8A2BE2';
        const o1 = globalData.customOpacity1 ?? 0.2;
        const o2 = globalData.customOpacity2 ?? 0.15;
        
        colors = activeTheme === 'dark' 
          ? `radial-gradient(circle at 20% 20%, ${c1}${toHex(o1)}, transparent 50%), radial-gradient(circle at 80% 80%, ${c2}${toHex(o2)}, transparent 50%), #06040f`
          : `radial-gradient(circle at 20% 20%, ${c1}${toHex(o1 * 0.5)}, transparent 50%), #ffffff`;
      } else {
        const grad = GRADIENTS[gradientIndex] || GRADIENTS[0];
        colors = activeTheme === 'light' ? grad.light : grad.dark;
      }
      
      const isSolid = !colors.includes('gradient');
      const orb1 = (globalData.orbColor1 || '#FF3366') + toHex(globalData.orbOpacity1 ?? 0.25);
      const orb2 = (globalData.orbColor2 || '#8A2BE2') + toHex(globalData.orbOpacity2 ?? 0.25);
      
      root.style.setProperty('--bg-gradient', colors);
      root.style.setProperty('--orb-visibility', isSolid ? 'hidden' : 'visible');
      root.style.setProperty('--orb-color-1', orb1);
      root.style.setProperty('--orb-color-2', orb2);
      
      // Extract & Pre-calculate Hero Background styles
      const heroOpacity = globalData.heroOpacity ?? 0.75;
      const heroBgMode = globalData.heroBgMode || 'theme';
      const heroBgColor = globalData.heroBgColor || '#ffffff';
      
      let finalBg = '';
      if (heroBgMode === 'custom' && heroBgColor) {
        const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(heroBgColor);
        finalBg = r ? `rgba(${parseInt(r[1],16)}, ${parseInt(r[2],16)}, ${parseInt(r[3],16)}, ${heroOpacity})` : `rgba(255, 255, 255, ${heroOpacity})`;
      } else {
        finalBg = activeTheme === 'light' ? `rgba(255, 255, 255, ${heroOpacity})` : `rgba(6, 4, 15, ${heroOpacity})`;
      }
      root.style.setProperty('--hero-bg-color', finalBg);
      
      document.body.style.backgroundColor = activeTheme === 'light' ? '#ffffff' : '#06040f';
      
      // Cache for next refresh
      localStorage.setItem('creatisk-theme', activeTheme);
      localStorage.setItem('creatisk-gradient', colors);
      localStorage.setItem('creatisk-is-solid', isSolid ? 'true' : 'false');
      localStorage.setItem('creatisk-hero-opacity', heroOpacity);
      localStorage.setItem('creatisk-hero-bg-mode', heroBgMode);
      localStorage.setItem('creatisk-hero-bg-color', heroBgColor);
    };

    applyThemeAndColors();

    window.addEventListener('creatisk-theme-changed', applyThemeAndColors);
    return () => {
      window.removeEventListener('creatisk-theme-changed', applyThemeAndColors);
    };
  }, [globalData]);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || themeLoading) {
    const isLight = localStorage.getItem('creatisk-theme') === 'light';
    return (
      <div style={{ 
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        background: isLight ? '#ffffff' : '#06040f', 
        color: isLight ? '#000000' : '#ffffff' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/logo-creatiks_black.png" alt="Loading..." style={{ height: '75px', width: 'auto', animation: 'pulse 2s infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={user ? <Navigate to="/admin" /> : <LoginPage />} />
          <Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
