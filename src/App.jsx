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

  // Apply cached theme immediately to prevent flashing
  useEffect(() => {
    const cachedTheme = localStorage.getItem('creatisk-theme') || 'dark';
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

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'content', 'global'), (snap) => {
      if (snap.exists()) {
        const toHex = (o) => {
          const h = Math.round(o * 255).toString(16);
          return h.length === 1 ? '0' + h : h;
        };
        const { theme, gradientIndex } = snap.data();
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        let colors = '';
        if (gradientIndex === -1) {
          const data = snap.data();
          const c1 = data.customColor1 || '#FF3366';
          const c2 = data.customColor2 || '#8A2BE2';
          const o1 = data.customOpacity1 ?? 0.2;
          const o2 = data.customOpacity2 ?? 0.15;
          

          colors = theme === 'dark' 
            ? `radial-gradient(circle at 20% 20%, ${c1}${toHex(o1)}, transparent 50%), radial-gradient(circle at 80% 80%, ${c2}${toHex(o2)}, transparent 50%), #06040f`
            : `radial-gradient(circle at 20% 20%, ${c1}${toHex(o1 * 0.5)}, transparent 50%), #ffffff`;
        } else {
          const grad = GRADIENTS[gradientIndex] || GRADIENTS[0];
          colors = theme === 'light' ? grad.light : grad.dark;
        }

        const data = snap.data();
        const isSolid = !colors.includes('gradient');
        
        // Use user-defined orb colors if available, otherwise fallback to theme extraction

        const orb1 = (data.orbColor1 || '#FF3366') + toHex(data.orbOpacity1 ?? 0.25);
        const orb2 = (data.orbColor2 || '#8A2BE2') + toHex(data.orbOpacity2 ?? 0.25);
        
        root.style.setProperty('--bg-gradient', colors);
        root.style.setProperty('--orb-visibility', isSolid ? 'hidden' : 'visible');
        root.style.setProperty('--orb-color-1', orb1);
        root.style.setProperty('--orb-color-2', orb2);
        
        // Extract & Pre-calculate Hero Background styles
        const heroOpacity = data.heroOpacity ?? 0.75;
        const heroBgMode = data.heroBgMode || 'theme';
        const heroBgColor = data.heroBgColor || '#ffffff';
        
        let finalBg = '';
        if (heroBgMode === 'custom' && heroBgColor) {
          const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(heroBgColor);
          finalBg = r ? `rgba(${parseInt(r[1],16)}, ${parseInt(r[2],16)}, ${parseInt(r[3],16)}, ${heroOpacity})` : `rgba(255, 255, 255, ${heroOpacity})`;
        } else {
          finalBg = theme === 'light' ? `rgba(255, 255, 255, ${heroOpacity})` : `rgba(6, 4, 15, ${heroOpacity})`;
        }
        root.style.setProperty('--hero-bg-color', finalBg);
        
        document.body.style.backgroundColor = theme === 'light' ? '#ffffff' : '#06040f';
        
        // Cache for next refresh
        localStorage.setItem('creatisk-theme', theme);
        localStorage.setItem('creatisk-gradient', colors);
        localStorage.setItem('creatisk-is-solid', isSolid ? 'true' : 'false');
        localStorage.setItem('creatisk-hero-opacity', heroOpacity);
        localStorage.setItem('creatisk-hero-bg-mode', heroBgMode);
        localStorage.setItem('creatisk-hero-bg-color', heroBgColor);
      }
      setThemeLoading(false);
    });
    return () => unsub();
  }, []);

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
