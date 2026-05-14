import React from 'react';

const PageLoader = () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  
  return (
    <div style={{ 
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      background: isLight ? '#ffffff' : '#06040f',
      position: 'fixed', inset: 0, zIndex: 9999,
      pointerEvents: 'all'
    }}>
      <div style={{ textAlign: 'center' }}>
        <img 
          src="/logo-creatiks_black.png" 
          alt="Loading..." 
          style={{ 
            height: '75px', 
            width: 'auto', 
            animation: 'pulse 2s infinite' 
          }} 
        />
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.05); opacity: 1; }
              100% { transform: scale(1); opacity: 0.8; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default PageLoader;
