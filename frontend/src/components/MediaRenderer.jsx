import React from 'react';

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
  
  // Use the backend URL for local assets
  const backendBase = 'https://queen-bay.vercel.app';
  const fullSrc = src.startsWith('http') ? src : `${backendBase}${src}`;

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
