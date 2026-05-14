import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const useGlobalSettings = () => {
  const [settings, setSettings] = useState({ 
    theme: 'dark', 
    gradientIndex: 0, 
    notificationEmails: 'hello@creatisk.in, kapil.webfoxtech@gmail.com' 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const unsub = onSnapshot(doc(db, 'content', 'global'), (doc) => {
      if (doc.exists()) {
        setSettings(prev => ({ ...prev, ...doc.data() }));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching global settings:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { settings, loading };
};
