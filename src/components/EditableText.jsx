import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

/**
 * EditableText Component
 * Allows admins to click and edit text directly on the page.
 * Saves automatically to Firebase on blur.
 */
const EditableText = ({ 
  pageId, 
  fieldId, 
  initialText, 
  tagName: Tag = 'span',
  displayTransform,
  style = {},
  className = ""
}) => {
  const [text, setText] = useState(initialText);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Sync with initialText when it loads from Firebase, but ONLY if not currently editing
  useEffect(() => {
    if (initialText !== undefined && !isFocused) {
      setText(initialText);
    }
  }, [initialText, isFocused]);

  // Check if current user is an admin
  useEffect(() => {
    if (!auth) return;
    const unsub = auth.onAuthStateChanged(user => setIsAdmin(!!user));
    return () => unsub();
  }, []);

  const handleBlur = async (e) => {
    setIsFocused(false);
    if (!isAdmin) return;
    
    const newText = e.target.innerText.trim();
    if (newText === initialText) return;

    setIsSaving(true);
    setText(newText);

    try {
      const docRef = doc(db, 'content', pageId);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        await updateDoc(docRef, { [fieldId]: newText });
      } else {
        await setDoc(docRef, { [fieldId]: newText }, { merge: true });
      }
      console.log(`Saved "${fieldId}" to "${pageId}"`);
    } catch (err) {
      console.error("Error saving text:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <Tag
      contentEditable={isAdmin}
      suppressContentEditableWarning={true}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} ${isAdmin ? 'admin-editable' : ''}`}
      style={{
        ...style,
        position: 'relative',
        outline: 'none',
        transition: 'all 0.2s ease',
        minWidth: '20px',
        minHeight: '1em',
        display: (Tag === 'div' || Tag === 'h1' || Tag === 'h2' || Tag === 'h3' || Tag === 'p') ? 'block' : 'inline-block'
      }}
    >
      {(isFocused || !displayTransform) ? (text || initialText || "Type something...") : displayTransform(text || initialText)}
      
      {isAdmin && (
        <style>{`
          .admin-editable:hover {
            background: rgba(255, 153, 51, 0.05);
            box-shadow: 0 0 0 4px rgba(255, 153, 51, 0.05);
            border-radius: 4px;
            cursor: text;
          }
          .admin-editable:focus {
            background: rgba(255, 153, 51, 0.1);
            box-shadow: 0 0 0 4px rgba(255, 153, 51, 0.1);
            border-radius: 4px;
          }
        `}</style>
      )}
    </Tag>
  );
};

export default EditableText;
