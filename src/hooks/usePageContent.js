import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export const usePageContent = (pageId, defaultContent) => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    // Use onSnapshot for real-time updates if possible, or just getDoc
    const unsub = onSnapshot(doc(db, 'content', pageId), (doc) => {
      if (doc.exists()) {
        setContent({ ...defaultContent, ...doc.data() });
      }
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching ${pageId} content:`, error);
      setLoading(false);
    });

    return () => unsub();
  }, [pageId]);

  return { content, loading };
};
