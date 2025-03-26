import React, { useState, useEffect, useRef } from 'react';
import SmartCampusMap from './SmartCampusMap';
import CampusSilhouette from './CampusSilhouette';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

// Logo component for IBERO
const IberoLogo = () => (
  <div className="flex items-center">
    <div className="text-3xl font-serif font-bold mr-2">
      <span className="text-red-700">IBERO</span>
    </div>
    <span className="text-gray-700">Viewbook</span>
  </div>
);

// Hand icon for drag instruction
const HandIcon = () => (
  <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400">
    <span className="text-2xl">👋</span>
  </div>
);

// Cursor icon for selection instruction
const CursorIcon = () => (
  <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400">
    <span className="text-2xl">👆</span>
  </div>
);



const App = () => {
  const [showMap, setShowMap] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Initialize background map on component mount
  useEffect(() => {
    if (mapContainerRef.current) {
      // Set the access token
      mapboxgl.accessToken = 'pk.eyJ1IjoidGlsaW4yIiwiYSI6ImNtOG9wMzU4ZjAybnAyanE0dDdmY2x4cncifQ.YxHF3nxLS7LQX6ZlofvnGQ';
      
      // Create the map instance with low zoom for background effect
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-98.24159, 19.03056], // IBERO Puebla coordinates
        zoom: 15,
        pitch: 30,
        bearing: -17.6,
        interactive: false, // Disable interaction for background map
        attributionControl: false
      });
      
      // Save the map reference
      mapRef.current = map;
      
      map.on('load', () => {
        // Add 3D buildings with low opacity
        const layers = map.getStyle().layers;
        const labelLayerId = layers.find(
          (layer) => layer.type === 'symbol' && layer.layout['text-field']
        )?.id;
        
        if (labelLayerId) {
          map.addLayer(
            {
              id: 'add-3d-buildings',
              source: 'composite',
              'source-layer': 'building',
              filter: ['==', 'extrude', 'true'],
              type: 'fill-extrusion',
              minzoom: 15,
              paint: {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.4
              }
            },
            labelLayerId
          );
        }
      });
      
      // Cleanup function
      return () => {
        if (mapRef.current && !showMap) {
          mapRef.current.remove();
        }
      };
    }
  }, []);

  // Handle map transition
  const handleShowMap = () => {
    setTransitioning(true);
    
    // If we have a background map, animate it before transitioning
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [-98.24159, 19.03056],
        zoom: 16.5,
        pitch: 45,
        bearing: -17.6,
        duration: 1500,
        essential: true
      });
    }
    
    // After animation, show the full interactive map
    setTimeout(() => {
      setShowMap(true);
      setTransitioning(false);
    }, 1500);
  };

  // Handle returning from map view
  const handleBackFromMap = () => {
    setTransitioning(true);
    setTimeout(() => {
      setShowMap(false);
      setTransitioning(false);
    }, 500);
  };

  if (showMap) {
    return (
      <div className={`transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
        <SmartCampusMap onBack={handleBackFromMap} />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-beige transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background map */}
      <div 
        ref={mapContainerRef}
        className="absolute inset-0 z-0 opacity-40 transition-opacity duration-500"
      ></div>

      {/* Campus Silhouette Background */}
      <CampusSilhouette />

      {/* Decorative campus points */}
      

      {/* Decorative dotted grid pattern */}
      <div className="absolute right-0 top-0 w-1/2 h-full z-0 opacity-20 pointer-events-none">
        <div className="grid grid-cols-10 gap-8 w-full h-full">
          {Array(100).fill().map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-red-700"></div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <IberoLogo />
        
        <div className="flex items-center bg-yellow-400 rounded-full px-6 py-2">
          <button className="mr-4 px-3 py-1 rounded bg-white text-gray-800 flex items-center font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 5a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
            </svg>
            Menú
          </button>
          
          <button className="px-3 py-1 rounded bg-white text-gray-800 flex items-center font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Elegir Guía
          </button>

          <div className="hidden md:flex items-center ml-6 space-x-6">
            <a className="text-black hover:text-white font-bold" href="https://www.iberopuebla.mx/?gad_source=1&gclid=Cj0KCQjwqIm_BhDnARIsAKBYcmtR8F_z_i6wTjnW6PoTLPqguBml0zBpXUJNmx6mgdH0IXf1iLtX4jMaAkQuEALw_wcB">Solicitar Info</a>
            <a className="text-black hover:text-white font-bold" href="https://www.iberopuebla.mx/conocenos">Visitar</a>
            <a className="text-black hover:text-white font-bold flex items-center" href="https://www.iberopuebla.mx/admisiones">
              Aplicar
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pt-16 md:pt-24">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 text-gray-900 animate-fade-in">
            Explora SmartCampus
          </h1>
          
          <p className="text-xl mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Conoce nuestras tecnologías en red para facilitar la comunicación y la utilización de recursos en nuestro campus.
          </p>
          <p className="text-xl mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            
          </p>

          {/* Instructions */}
          <div className="flex flex-col md:flex-row mb-12 space-y-8 md:space-y-0 md:space-x-16">
            <div className="flex items-start animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <HandIcon />
              <div className="ml-4">
                <p className="text-lg font-medium">Arrastra para mover</p>
                <p className="text-gray-600">alrededor del mapa</p>
              </div>
            </div>
            
            <div className="flex items-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CursorIcon />
              <div className="ml-4">
                <p className="text-lg font-medium">Selecciona un objeto</p>
                <p className="text-gray-600">para más información</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <button 
              onClick={handleShowMap}
              className="px-8 py-3 bg-yellow-400 hover:text-white text-black font-bold rounded-full text-lg transition-colors duration-200 cursor-pointer "
            >
              Entrar al Mapa
            </button>
            
            <button className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-full border border-gray-300 text-lg transition-colors duration-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Ver IBERO Puebla desde Arriba
            </button>
          </div>
        </div>
      </main>

      {/* Floating badges - new visual elements */}
      <div className="absolute bottom-10 right-10 z-10 flex flex-col space-y-4 animate-fade-in" style={{ animationDelay: '0.9s' }}>
        <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-3 transform hover:scale-105 transition-transform">
          <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center">
            <span className="text-white text-xl">🎓</span>
          </div>
          <div>
            <a className="flex text-sm font-medium" href="https://www.iberopuebla.mx/oferta-academica">Programas</a>
            <p className="flex text-xs text-gray-500">Licenciaturas y Posgrados</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-3 transform hover:scale-105 transition-transform">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-white text-xl">📱</span>
          </div>
          <div>
            <a className="text-sm font-medium" href="https://www.iberopuebla.mx/OAT/servicios">App IBERO</a>
            <p className="text-xs text-gray-500">Descarga en tu móvil</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;