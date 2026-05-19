import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Handles form submissions by saving to Firestore and sending an email via Web3Forms.
 * @param {Object} formData - The data from the form.
 * @param {string} source - Where the form was submitted from (e.g., 'contact_page', 'footer').
 * @returns {Promise<Object>} - Success/Error status.
 */
export const submitContactForm = async (formData, source = 'unknown', recipients = '') => {
  try {
    // 1. Save to Firestore for record keeping (Internal to your project)
    if (db) {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        source,
        timestamp: serverTimestamp(),
        status: 'new'
      });
    }

    // 2. Generate mailto link (No external API needed)
    // Use the provided recipients if available, otherwise fallback to hardcoded defaults
    const mailTo = recipients || 'hello@creatisk.in';
    
    const subject = encodeURIComponent(`New Inquiry from ${formData.name || 'Creatisk Website'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Budget: ${formData.budget || 'N/A'}\n` +
      `Source: ${source}\n\n` +
      `Message:\n${formData.message}`
    );

    const mailtoLink = `mailto:${mailTo}?subject=${subject}&body=${body}`;
    
    // Open the default email client
    window.location.href = mailtoLink;

    return { success: true, message: 'Opening email client...' };
  } catch (error) {
    console.error("Form submission error:", error);
    return { success: false, message: error.message };
  }
};
