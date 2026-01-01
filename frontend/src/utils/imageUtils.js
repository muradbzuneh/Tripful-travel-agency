/**
 * Utility functions for handling package and destination images
 */

/**
 * Get all possible image paths for a package, in order of priority
 * @param {Object} pkg - Package object with image_url, destination, title
 * @returns {Array} Array of image paths to try
 */
export const getPackageImageFallbacks = (pkg) => {
  const fallbacks = [];
  
  // Handle null or undefined package
  if (!pkg) {
    return ['/src/assets/images/ethiopia.jpg'];
  }
  
  // First priority: Backend uploaded image
  if (pkg.image_url) {
    if (pkg.image_url.startsWith("/uploads/")) {
      fallbacks.push(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${pkg.image_url}`);
    } else {
      fallbacks.push(pkg.image_url);
    }
  }
  
  // Second priority: Destination-based images (desandatt folder)
  if (pkg.destination) {
    const destination = pkg.destination.trim();
    fallbacks.push(
      `/src/assets/desandatt/${destination}.jpg`,
      `/src/assets/desandatt/${destination.toLowerCase()}.jpg`,
      `/src/assets/desandatt/${destination.replace(/\s+/g, '')}.jpg`,
      `/src/assets/desandatt/${destination.toLowerCase().replace(/\s+/g, '')}.jpg`
    );
  }
  
  // Third priority: Package title-based images (packages folder)
  if (pkg.title) {
    const title = pkg.title.trim();
    fallbacks.push(
      `/src/assets/packages/${title}.jpg`,
      `/src/assets/packages/${title.toLowerCase()}.jpg`,
      `/src/assets/packages/${title.replace(/\s+/g, '')}.jpg`,
      `/src/assets/packages/${title.toLowerCase().replace(/\s+/g, '')}.jpg`
    );
  }
  
  // Fourth priority: Try destination in packages folder
  if (pkg.destination) {
    const destination = pkg.destination.trim();
    fallbacks.push(
      `/src/assets/packages/${destination}.jpg`,
      `/src/assets/packages/${destination.toLowerCase()}.jpg`,
      `/src/assets/packages/${destination.replace(/\s+/g, '')}.jpg`,
      `/src/assets/packages/${destination.toLowerCase().replace(/\s+/g, '')}.jpg`
    );
  }

  fallbacks.push(
    `/src/assets/images/ethiopia.jpg`,
    `/src/assets/images/mountain-home.jpg`,
    `/src/assets/images/oumer.jpg`
  );
  
  // Remove duplicates while preserving order
  return [...new Set(fallbacks)];
};

/**
 * Get the primary image URL for a package
 * @param {Object} pkg - Package object
 * @returns {string} Primary image URL
 */
export const getPackageImageUrl = (pkg) => {
  if (!pkg) {
    return '/src/assets/images/ethiopia.jpg';
  }
  
  const fallbacks = getPackageImageFallbacks(pkg);
  return fallbacks[0] || '/src/assets/images/ethiopia.jpg';
};

/**
 * Create an image error handler that tries fallback images
 * @param {Object} pkg - Package object
 * @param {Function} onAllFailed - Callback when all images fail (optional)
 * @returns {Function} Error handler function
 */
export const createImageErrorHandler = (pkg, onAllFailed = null) => {
  if (!pkg) {
    return (event) => {
      event.target.src = '/src/assets/images/ethiopia.jpg';
    };
  }
  
  const fallbacks = getPackageImageFallbacks(pkg);
  let attemptIndex = 0;
  
  return (event) => {
    attemptIndex++;
    if (attemptIndex < fallbacks.length) {
      event.target.src = fallbacks[attemptIndex];
    } else if (onAllFailed) {
      onAllFailed(event);
    }
  };
};

/**
 * Get rating image path
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Rating image path
 */
export const getRatingImageUrl = (rating) => {
  const ratingValue = Math.floor(rating * 10); // Convert 4.5 to 45
  return `/src/assets/ratings/rating-${ratingValue}.png`;
};