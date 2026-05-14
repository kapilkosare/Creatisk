import React, { useState, useEffect, useRef } from 'react';
import { db, auth, storage } from '../firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ImagePlus, Link2, Loader2, UploadCloud, Library } from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';

/**
 * EditableImage - Supports Direct URL, Firebase Upload, and Local Media Library.
 */
const EditableImage = ({ 
  pageId, 
  fieldId, 
  initialUrl, 
  style = {}, 
  className = "",
  recommendedSize = "1200 x 800 (.webp)",
  labelFieldId = null,
  initialLabel = ""
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [label, setLabel] = useState(initialLabel);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialUrl) setUrl(initialUrl);
    if (initialLabel) setLabel(initialLabel);
  }, [initialUrl, initialLabel]);

  useEffect(() => {
    if (!auth) return;
    const unsub = auth.onAuthStateChanged(user => setIsAdmin(!!user));
    return () => unsub();
  }, []);

  const saveToFirestore = async (newUrl) => {
    const docRef = doc(db, 'content', pageId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, { [fieldId]: newUrl });
    } else {
      await setDoc(docRef, { [fieldId]: newUrl }, { merge: true });
    }
    setUrl(newUrl);

    // Track in media library
    try {
      const mediaRef = doc(db, 'media', fieldId + '_' + Date.now());
      await setDoc(mediaRef, {
        name: fieldId,
        url: newUrl,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Media sync skipped");
    }
  };

  const handleUrlPaste = async (e) => {
    e.stopPropagation();
    if (!isAdmin) return;
    const newUrl = window.prompt("Paste Image URL:", url);
    if (newUrl === null || newUrl === url) return;

    setIsProcessing(true);
    try {
      await saveToFirestore(newUrl);
    } catch (err) {
      alert("Failed to save URL");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLabelChange = async (e) => {
    e.stopPropagation();
    if (!isAdmin || !labelFieldId) return;

    const newLabel = window.prompt("Enter new Label Text:", label);
    if (newLabel === null || newLabel === label) return;

    setIsProcessing(true);
    try {
      const docRef = doc(db, 'content', pageId);
      await updateDoc(docRef, { [labelFieldId]: newLabel });
      setLabel(newLabel);
    } catch (err) {
      alert("Failed to save label");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !isAdmin || !storage) return;

    setIsProcessing(true);
    
    // Add a 15-second safety timeout
    const timeout = setTimeout(() => {
      if (isProcessing) {
        setIsProcessing(false);
        alert("Upload timed out. Please check your internet and Firebase configuration.");
      }
    }, 15000);

    try {
      const storagePath = `images/${pageId}/${fieldId}_${Date.now()}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await saveToFirestore(downloadURL);
      clearTimeout(timeout);
    } catch (err) {
      clearTimeout(timeout);
      console.error("Storage Error:", err);
      if (err.code === 'storage/unauthorized') {
        alert("Upload Denied: Please check your Firebase Storage Rules.");
      } else if (err.code === 'storage/project-not-found') {
        alert("Error: Firebase Storage is not enabled. Go to Firebase Console -> Storage -> Get Started.");
      } else {
        alert("Upload failed: " + err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLibrarySelect = async (selectedPath) => {
    setIsLibraryOpen(false);
    setIsProcessing(true);
    try {
      await saveToFirestore(selectedPath);
    } catch (err) {
      alert("Failed to save selection");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div 
        className={`editable-image-container ${className}`}
        onMouseEnter={() => isAdmin && setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
        style={{
          position: 'relative', width: '100%', height: '100%',
          overflow: 'hidden', cursor: isAdmin ? 'default' : 'default',
          borderRadius: style.borderRadius || 'inherit'
        }}
      >
        <img 
          src={url || 'https://via.placeholder.com/800x600?text=No+Image'} 
          alt={fieldId}
          style={{
            ...style, width: '100%', height: '100%',
            objectFit: style.objectFit || 'cover', display: 'block',
            transition: 'filter 0.3s ease'
          }} 
        />

        {isAdmin && (
          <>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
            
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              opacity: showOverlay || isProcessing ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: showOverlay || isProcessing ? 'all' : 'none',
              zIndex: 10, padding: '1rem'
            }}>
              {isProcessing ? (
                <div style={{ color: '#fff', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" size={32} style={{ marginBottom: '1rem' }} />
                  <div style={{ fontWeight: 700 }}>Saving...</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', maxWidth: '210px' }}>
                  <div style={{ fontSize:'0.7rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, textAlign: 'center', marginBottom: '0.15rem' }}>
                    RECOMMENDED: {recommendedSize}
                  </div>
                  
                  <button onClick={() => setIsLibraryOpen(true)} style={{ ...btnStyle, background: 'var(--accent-gradient)', boxShadow: '0 4px 15px rgba(190, 242, 100, 0.2)' }}>
                    <Library size={16} /> Media Library
                  </button>

                  <button onClick={() => fileInputRef.current.click()} style={btnStyle}>
                    <UploadCloud size={16} /> Upload File
                  </button>
                  
                  {labelFieldId && (
                    <button onClick={handleLabelChange} style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'none' }}>
                      <ImagePlus size={16} /> Edit Label Text
                    </button>
                  )}

                  <button onClick={handleUrlPaste} style={{ ...btnStyle, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'none' }}>
                    <Link2 size={16} /> Paste URL
                  </button>
                </div>
              )}
            </div>

            <style>{`
              .editable-image-container:hover img {
                filter: brightness(0.6);
              }
            `}</style>
          </>
        )}
      </div>

      <MediaLibraryModal 
        isOpen={isLibraryOpen} 
        onClose={() => setIsLibraryOpen(false)} 
        onSelect={handleLibrarySelect} 
      />
    </>
  );
};

const btnStyle = {
  background: 'var(--primary-gradient)',
  color: '#fff',
  border: 'none',
  padding: '0.75rem 1rem',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.6rem',
  fontWeight: 700,
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 15px rgba(255, 51, 102, 0.2)'
};

export default EditableImage;
