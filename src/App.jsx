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
    const root = document.documentElement;
    
    root.setAttribute('data-theme', cachedTheme);
    if (cachedGrad) root.style.setProperty('--bg-gradient', cachedGrad);
    root.style.setProperty('--orb-visibility', cachedIsSolid ? 'hidden' : 'visible');
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
        
        document.body.style.backgroundColor = theme === 'light' ? '#ffffff' : '#06040f';
        
        // Cache for next refresh
        localStorage.setItem('creatisk-theme', theme);
        localStorage.setItem('creatisk-gradient', colors);
        localStorage.setItem('creatisk-is-solid', isSolid ? 'true' : 'false');
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
    /*
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
    */
    setLoading(false); // Force loading to end for test
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
