import React from 'react';

const CampusSilhouette = () => {
  return (
    <div className="absolute right-0 bottom-0 w-1/2 h-70 opacity-25 pointer-events-none campus-silhouette">
      {/* This is a simplified SVG silhouette of a campus building */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="silhouette-reveal"
      >
        <path
          d="M700 600H100V400H150V350H200V300H250V250H350V200H400V150H450V200H500V250H550V300H600V350H650V400H700V600Z"
          fill="#C8102E"
          fillOpacity="0.2"
        />
        <path
          d="M400 150V50H450V0H500V50H550V100H600V150H650V200H700V600H650V350H600V300H550V250H500V200H450V150H400Z"
          fill="#C8102E"
          fillOpacity="0.2"
        />
        <path
          d="M200 300H250V350H200V300Z"
          fill="#C8102E"
          fillOpacity="0.3"
        />
        <path
          d="M300 250H350V300H300V250Z"
          fill="#C8102E"
          fillOpacity="0.3"
        />
        <path
          d="M450 200H500V250H450V200Z"
          fill="#C8102E"
          fillOpacity="0.3"
        />
        <path
          d="M550 300H600V350H550V300Z"
          fill="#C8102E"
          fillOpacity="0.3"
        />
        <path
          d="M650 400H700V450H650V400Z"
          fill="#C8102E"
          fillOpacity="0.3"
        />
      </svg>
    </div>
  );
};

export default CampusSilhouette;