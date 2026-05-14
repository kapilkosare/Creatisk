import React from 'react';
import { X, Search, Image as ImageIcon } from 'lucide-react';
import { MEDIA_LIBRARY } from '../constants/media';

const MediaLibraryModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'var(--bg-main)',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '85vh',
        borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>Media Library</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose from images in <code>/public/custom_images/</code></p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            color: '#fff',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}><X /></button>
        </div>

        {/* Content */}
        <div style={{
          padding: '2rem',
          flex: 1,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {MEDIA_LIBRARY.map((item, i) => (
            <div 
              key={i} 
              className="hover-scale"
              onClick={() => onSelect(`/custom_images/${item.filename}`)}
              style={{
                cursor: 'pointer',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ aspectRatio: '16/10', position: 'relative' }}>
                <img 
                  src={`/custom_images/${item.filename}`} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(255,255,255,0.2);">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        <span style="font-size: 0.7rem; margin-top: 0.5rem;">Missing File</span>
                      </div>
                    `;
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.filename}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem 2rem',
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          Add more images to <code>/public/custom_images/</code> to see them here.
        </div>
      </div>
    </div>
  );
};

export default MediaLibraryModal;
