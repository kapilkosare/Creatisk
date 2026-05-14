import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    setIsLight(theme === 'light');
  }, []);

  const handleToggle = async () => {
    const newTheme = isLight ? 'dark' : 'light';
    
    // Update Local UI immediately
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('creatisk-theme', newTheme);
    document.body.style.backgroundColor = newTheme === 'light' ? '#ffffff' : '#06040f';
    setIsLight(!isLight);

    // Update Global Firebase (this triggers App.jsx listener)
    try {
      const globalRef = doc(db, 'content', 'global');
      await updateDoc(globalRef, { theme: newTheme });
    } catch (error) {
      console.error("Global theme update failed:", error);
      // Even if Firebase fails (e.g. no permissions), local state remains updated
    }
  };

  return (
    <div 
      className="theme-switch-wrapper" 
      onClick={handleToggle}
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        right: '2.5rem',
        zIndex: 100000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem',
        userSelect: 'none'
      }}
    >
      {/* Outer Base Plate */}
      <div style={{
        width: '60px',
        height: '90px',
        backgroundColor: isLight ? '#f5f5f5' : '#111',
        borderRadius: '10px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isLight 
          ? '0 10px 25px rgba(0,0,0,0.1), 0 2px 5px rgba(0,0,0,0.05), inset 0 1px 1px #fff'
          : '0 10px 25px rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.05)',
        border: isLight ? '1px solid #ddd' : '1px solid #222',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}>
        {/* The Rocker Switch */}
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: isLight ? '#fff' : '#1a1a1a',
          borderRadius: '4px',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isLight ? 'rotateX(-20deg) translateY(2px)' : 'rotateX(20deg) translateY(-2px)',
          boxShadow: isLight
            ? '0 4px 6px rgba(0,0,0,0.1), inset 0 1px 0 #fff'
            : '0 4px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          border: isLight ? '1px solid #ccc' : '1px solid #000'
        }}>
          {/* Top Label */}
          <div style={{ 
            fontSize: '9px', 
            fontWeight: 900, 
            color: isLight ? '#333' : '#eee',
            opacity: isLight ? 0.3 : 0.9,
            textShadow: isLight ? 'none' : '0 1px 2px rgba(0,0,0,0.5)'
          }}>
            OFF
          </div>
          
          {/* Subtle line or dot indicator */}
          <div style={{
            width: '12px',
            height: '2px',
            backgroundColor: isLight ? '#FF3366' : '#555',
            borderRadius: '2px',
            boxShadow: isLight ? '0 0 10px #FF3366' : 'none'
          }} />

          {/* Bottom Label */}
          <div style={{ 
            fontSize: '9px', 
            fontWeight: 900, 
            color: isLight ? '#333' : '#eee',
            opacity: isLight ? 0.9 : 0.3,
            textShadow: isLight ? 'none' : '0 1px 2px rgba(0,0,0,0.5)'
          }}>
            ON
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ThemeToggle;
