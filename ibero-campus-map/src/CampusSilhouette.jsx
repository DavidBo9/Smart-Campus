import React from 'react';

const CampusSilhouette = () => {
  return (
    <div className="absolute right-0 top-0 h-full w-1/3 z-0 overflow-hidden pointer-events-none">
      {/* Campus buildings silhouette SVG */}
      <svg 
        className="absolute right-0 bottom-0 h-full w-full opacity-10"
        viewBox="0 0 400 600" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main building */}
        <path 
          d="M350 400 L400 400 L400 200 L350 180 Z" 
          fill="#C8102E" 
          className="opacity-70"
        />
        {/* Library tower */}
        <path 
          d="M300 400 L350 400 L350 150 L300 170 Z" 
          fill="#333333" 
          className="opacity-70"
        />
        {/* Modern building */}
        <path 
          d="M250 400 L300 400 L300 230 L250 210 Z" 
          fill="#C8102E" 
          className="opacity-70"
        />
        {/* Sports complex */}
        <path 
          d="M180 400 L250 400 L250 250 L180 280 Z" 
          fill="#333333" 
          className="opacity-70"
        />
        {/* Auditorium dome */}
        <path 
          d="M150 400 L200 400 L200 300 C200 270 150 270 150 300 Z" 
          fill="#C8102E" 
          className="opacity-70"
        />
        {/* Student center */}
        <path 
          d="M100 400 L150 400 L150 320 L100 320 Z" 
          fill="#333333" 
          className="opacity-70"
        />
        {/* Ground/base */}
        <path 
          d="M0 400 L400 400 L400 430 L0 430 Z" 
          fill="#555555" 
          className="opacity-70"
        />
      </svg>
      
      {/* Decorative elements */}
      <div className="absolute right-8 top-1/4 w-24 h-24 rounded-full bg-red-700 opacity-5"></div>
      <div className="absolute right-32 top-1/3 w-16 h-16 rounded-full bg-red-700 opacity-5"></div>
      <div className="absolute right-12 top-1/2 w-32 h-32 rounded-full bg-red-700 opacity-5"></div>
    </div>
  );
};

export default CampusSilhouette;