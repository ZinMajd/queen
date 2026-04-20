import React from 'react';
import { BASE_URL } from '../api/api';

/**
 * MediaRenderer component handles both image and video rendering
 * with automatic base URL prefixing for local assets.
 */
const MediaRenderer = ({ src, alt, className }) => {
  if (!src) {
    return <div className={`${className} bg-slate-200 animate-pulse rounded-2xl`} />;
  }

  const srcString = String(src || '').toLowerCase();
  const isVideo = srcString.endsWith('.mp4') || srcString.endsWith('.webm');
  
  // Use the dynamic base URL from api.js
  // We remove '/api' from the end of BASE_URL for asset paths
  const backendBase = BASE_URL.replace(/\/api$/, '');
  let fullSrc = src || '';
  
  if (src && !src.startsWith('http')) {
    // Ensure leading slash and encode URI for Arabic characters
    const path = src.startsWith('/') ? src : `/${src}`;
    fullSrc = `${backendBase}${encodeURI(path)}`;
  }

  if (isVideo) {
    return (
      <video 
        src={fullSrc} 
        className={className} 
        autoPlay 
        muted 
        loop 
        playsInline
        controls={false}
      />
    );
  }

  return (
    <img 
      src={fullSrc} 
      alt={alt} 
      className={className} 
      loading="lazy"
      onError={(e) => {
        e.target.src = 'https://placehold.co/600x800?text=Image+Not+Found';
      }}
    />
  );
};

export default MediaRenderer;
