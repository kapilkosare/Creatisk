/**
 * cleanImageUrl - Removes localhost prefix from URLs to ensure they work in production.
 * @param {string} url - The image URL to clean.
 * @returns {string} - The cleaned URL.
 */
export const cleanImageUrl = (url) => {
  if (!url) return '';
  
  // If it's a localhost URL, remove the domain part to make it relative
  if (url.includes('localhost:5173') || url.includes('localhost:5174')) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch (e) {
      // Fallback if URL is malformed
      return url.replace(/^https?:\/\/localhost:\d+/, '');
    }
  }
  
  return url;
};
