import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// ==================== STYLES ====================
const styles = {
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: '100vh'
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '20px',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    maxWidth: '300px',
  },
  markerButtons: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '10px',
    borderRadius: '5px',
    display: 'flex',
    gap: '10px'
  },
  popup: {
    maxWidth: '300px',
    padding: '10px'
  }
};

// ==================== CAMPUS DATA ====================
const campusLocations = [
  {
    id: 'library',
    name: 'Biblioteca',
    description: 'Centro de recursos y estudio con más de 50,000 volúmenes.',
    category: 'academic',
    coordinates: [-98.24259, 19.03156]
  },
  {
    id: 'cafeteria',
    name: 'Cafetería Central',
    description: 'Amplia selección de alimentos y bebidas para estudiantes y personal.',
    category: 'dining',
    coordinates: [-98.24059, 19.03056]
  },
  {
    id: 'auditorio',
    name: 'Auditorio Principal',
    description: 'Espacio para eventos académicos y presentaciones culturales.',
    category: 'services',
    coordinates: [-98.24359, 19.03256]
  },
  {
    id: 'sports',
    name: 'Centro Deportivo',
    description: 'Instalaciones para actividades físicas y deportivas.',
    category: 'athletics',
    coordinates: [-98.23959, 19.02956]
  },
  {
    id: 'admissions',
    name: 'Oficina de Admisiones',
    description: 'Información para futuros estudiantes y proceso de inscripción.',
    category: 'services',
    coordinates: [-98.24159, 19.03356]
  },
  {
    id: 'artes',
    name: 'Edificio de Artes',
    description: 'Espacios para clases de música, pintura y otras disciplinas artísticas.',
    category: 'academic',
    coordinates: [-98.24459, 19.03056]
  },
  {
    id: 'parking',
    name: 'Estacionamiento Principal',
    description: 'Área de estacionamiento para estudiantes y visitantes.',
    category: 'services',
    coordinates: [-98.23859, 19.03156]
  },
  {
    id: 'dormitories',
    name: 'Residencias Estudiantiles',
    description: 'Alojamiento para estudiantes foráneos.',
    category: 'residential',
    coordinates: [-98.24559, 19.02856]
  }
];

// ==================== MAIN COMPONENT ====================
const SmartCampusMap = ({ onBack }) => {
  // ========== STATE AND REFS ==========
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(false);

  // ========== MARKER FUNCTIONS ==========
  // Helper function to create a custom marker element
  const createMarkerElement = (location) => {
    const markerEl = document.createElement('div');
    markerEl.className = 'custom-marker';
    markerEl.style.width = '30px';
    markerEl.style.height = '30px';
    markerEl.style.borderRadius = '50%';
    markerEl.style.cursor = 'pointer';
    markerEl.style.opacity = '0';
    markerEl.style.willChange = 'transform, opacity';
    
    // Critical: ensure z-index is high enough to be visible
    markerEl.style.zIndex = '5';
    
    // Improve transition properties for smoother animations
    markerEl.style.transition = 'opacity 0.5s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    // Set color based on category - using IBERO red for primary categories
    let color;
    switch (location.category) {
      case 'academic':
        color = '#C8102E'; // IBERO Red
        break;
      case 'dining':
        color = '#FFC72C'; // Yellow
        break;
      case 'services':
        color = '#0078D4'; // Blue
        break;
      case 'athletics':
        color = '#107C10'; // Green
        break;
      case 'residential':
        color = '#5C2D91'; // Purple
        break;
      default:
        color = '#C8102E'; // Default to IBERO Red
    }
    
    markerEl.style.backgroundColor = color;
    markerEl.style.boxShadow = '0 0 0 2px white';
    
    // Add inner dot for visual appeal
    const innerDot = document.createElement('div');
    innerDot.style.position = 'absolute';
    innerDot.style.top = '50%';
    innerDot.style.left = '50%';
    innerDot.style.transform = 'translate(-50%, -50%)';
    innerDot.style.width = '10px';
    innerDot.style.height = '10px';
    innerDot.style.borderRadius = '50%';
    innerDot.style.backgroundColor = 'white';
    innerDot.style.transition = 'transform 0.3s ease'; // Add transition for the inner dot too
    
    markerEl.appendChild(innerDot);
    
    return markerEl;
  };

  // Add markers to the map with staggered animation and performance optimizations
  const addMarkers = () => {
    campusLocations.forEach((location, index) => {
      // Create marker element
      const markerEl = createMarkerElement(location);
      
      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true,
        maxWidth: '300px'
      }).setHTML(
        `<div>
          <h3 style="font-weight: bold; margin-bottom: 5px;">${location.name}</h3>
          <p>${location.description}</p>
        </div>`
      );
      
      // IMPORTANT FIX: Use the simplest marker creation to ensure custom styling works
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(mapRef.current);
      
      // Store marker reference
      markersRef.current[location.id] = marker;
      
      // Add event listeners
      markerEl.addEventListener('click', () => {
        setSelectedLocation(location);
      });
      
      // Animate markers entrance with staggered delay
      setTimeout(() => {
        markerEl.style.opacity = '1';
      }, 1000 + index * 100);
    });
  };

  // Filter markers by category
  const filterMarkers = (category) => {
    if (!mapLoaded) return;
    
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const location = campusLocations.find(loc => loc.id === id);
      
      if (!location) return;
      
      if (category === 'all' || location.category === category) {
        marker.getElement().style.display = 'block';
      } else {
        marker.getElement().style.display = 'none';
      }
    });
  };

  // ========== MAP INITIALIZATION ==========
  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && mapboxgl) {
      // Set the access token
      mapboxgl.accessToken = 'pk.eyJ1IjoidGlsaW4yIiwiYSI6ImNtOG9wMzU4ZjAybnAyanE0dDdmY2x4cncifQ.YxHF3nxLS7LQX6ZlofvnGQ';
      
      // Campus center coordinates
      const campusCenter = [-98.24159, 19.03056]; // IBERO Puebla coordinates
      
      // Define bounds constraints (approximately 1km around campus center)
      // These values create a bounding box around the campus
      const maxBounds = [
        [campusCenter[0] - 0.008, campusCenter[1] - 0.008], // Southwest coordinates
        [campusCenter[0] + 0.008, campusCenter[1] + 0.008]  // Northeast coordinates
      ];
      
      // Create the map instance with performance optimizations and constraints
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: campusCenter,
        zoom: 16,
        pitch: 45,
        bearing: -17.6,
        antialias: true,
        fadeDuration: 1000, // Smooth transitions
        renderWorldCopies: false, // Improves performance by not rendering multiple world copies
        maxPitch: 60, // Limit pitch to improve performance
        attributionControl: false, // Remove attribution for cleaner UI
        preserveDrawingBuffer: false, // Improve performance
        
        // Set zoom constraints
        minZoom: 15, // Prevent zooming out too far
        maxZoom: 18, // Prevent zooming in too far
        
        // Set maximum bounds to restrict panning
        maxBounds: maxBounds
      });
      
      // Save the map reference
      mapRef.current = map;
      
      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl());
      
      // Add optimization and anti-jitter events
      map.on('movestart', () => {
        // When map starts moving, apply CSS to reduce jitter
        if (mapContainerRef.current) {
          mapContainerRef.current.style.willChange = 'transform';
        }
        
        // Temporarily reduce marker animation complexity during movement
        Object.values(markersRef.current).forEach(marker => {
          const markerEl = marker.getElement();
          markerEl.style.transition = 'none'; // Disable transitions during movement
          markerEl.style.willChange = 'transform'; // Optimize for GPU
        });
      });
      
      map.on('moveend', () => {
        // Restore marker animations after movement
        if (mapContainerRef.current) {
          mapContainerRef.current.style.willChange = 'auto';
        }
        
        setTimeout(() => {
          Object.values(markersRef.current).forEach(marker => {
            const markerEl = marker.getElement();
            markerEl.style.transition = 'opacity 0.5s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            markerEl.style.willChange = 'auto';
          });
        }, 100); // Small delay to ensure smooth completion
      });
      
      // When map loads, add buildings and markers
      map.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        
        // Add 3D buildings with optimized rendering
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
                'fill-extrusion-opacity': 0.6
              }
            },
            labelLayerId
          );
        }
        
        // Add campus markers
        addMarkers();
        
        // Fade in map
        setIsMapVisible(true);
        
        // Fade in controls after map is visible
        setTimeout(() => {
          setAreControlsVisible(true);
        }, 1000);
      });
      
      // Cleanup function
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    }
  }, []);

  // ========== LOCATION SELECTION ==========
  // Completely reworked implementation to fix popup positioning issue
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      // First, close any open popups
      Object.values(markersRef.current).forEach(marker => {
        // Remove any existing popups
        if (marker.getPopup() && marker.getPopup().isOpen()) {
          marker.togglePopup();
        }
        
        // Reset marker appearance
        const markerEl = marker.getElement();
        markerEl.style.transform = 'scale(1)';
        markerEl.style.zIndex = '5';
        markerEl.style.boxShadow = '0 0 0 2px white';
        markerEl.classList.remove('marker-selected');
        markerEl.style.opacity = '0.7'; // Dim all markers
      });
      
      // Get the selected marker
      const selectedMarker = markersRef.current[selectedLocation.id];
      if (!selectedMarker) return;
      
      // First move the map to center on the location
      mapRef.current.flyTo({
        center: selectedLocation.coordinates,
        zoom: 17,
        duration: 500, 
        essential: true
      });
      
      // Then handle what happens after the movement ends
      const moveEndHandler = () => {
        // Restore all markers appearance
        Object.values(markersRef.current).forEach(marker => {
          const markerEl = marker.getElement();
          markerEl.style.opacity = '1';
        });
        
        // Highlight the selected marker
        const selectedMarkerEl = selectedMarker.getElement();
        selectedMarkerEl.style.transform = 'scale(1.2)';
        selectedMarkerEl.style.zIndex = '10';
        selectedMarkerEl.style.boxShadow = '0 0 0 2px #C8102E'; // IBERO Red
        selectedMarkerEl.classList.add('marker-selected');
        
        // CRITICAL FIX: Instead of using togglePopup, create and set a new popup
        // This ensures proper positioning relative to the marker
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: true
        }).setHTML(
          `<div>
            <h3 style="font-weight: bold; margin-bottom: 5px;">${selectedLocation.name}</h3>
            <p>${selectedLocation.description}</p>
          </div>`
        );
        
        // Set and open the popup directly on the marker
        selectedMarker.setPopup(popup);
        
        // Short delay to ensure proper positioning
        setTimeout(() => {
          selectedMarker.togglePopup();
        }, 50);
        
        // Remove this event listener
        mapRef.current.off('moveend', moveEndHandler);
      };
      
      // Listen for the end of map movement
      mapRef.current.on('moveend', moveEndHandler);
    }
  }, [selectedLocation]);

  // Handle back button click with animation
  const handleBack = () => {
    // Start fade out animation
    setAreControlsVisible(false);
    setTimeout(() => {
      setIsMapVisible(false);
      setTimeout(() => {
        onBack();
      }, 500); // Wait for fade out animation to complete
    }, 300);
  };

  // ========== RENDER ==========
  return (
    <div className="smart-campus-map">
      {/* Map Container with fade-in animation */}
      <div 
        ref={mapContainerRef} 
        style={{
          ...styles.mapContainer,
          opacity: isMapVisible ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }} 
      />
      
      {/* Back Button */}
      <button 
        onClick={handleBack} 
        className={`absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all cursor-pointer duration-300 ${areControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        aria-label="Volver"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      
      {/* Header with fade-in and slide-down animation */}
      <div className={`absolute top-4 left-16 bg-white bg-opacity-90 p-4 rounded shadow-md z-10 max-w-md transition-all duration-500 ${areControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        <div className="flex items-center mb-2">
          <h1 className="text-3xl font-bold mr-2 text-red-700">IBERO</h1>
          <span className="text-lg">Puebla</span>
        </div>
        <h2 className="text-4xl font-bold mb-2">Explora Smart Campus</h2>
        <p className="text-gray-700">
          Conoce nuestros diferentes sensores ubicados en diferentes partes del campus.
        </p>
      </div>
      
      {/* Location List with fade-in and slide-up animation */}
      <div className={`absolute bottom-6 right-4 bg-white bg-opacity-90 p-4 rounded shadow-md z-10 max-w-xs transition-all duration-500 delay-300 ${areControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <h3 className="text-lg font-bold mb-2">Lugares del Campus</h3>
        <ul className="space-y-1">
          {campusLocations.map((location) => (
            <li 
              key={location.id}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
              onClick={() => setSelectedLocation(location)}
            >
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor: 
                    location.category === 'academic' ? '#C8102E' :
                    location.category === 'dining' ? '#FFC72C' :
                    location.category === 'services' ? '#0078D4' :
                    location.category === 'athletics' ? '#107C10' :
                    location.category === 'residential' ? '#5C2D91' : '#C8102E'
                }}
              />
              {location.name}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Category Filter with fade-in and slide-up animation */}
      <div className={`absolute bottom-6 left-4 bg-white bg-opacity-90 p-4 rounded shadow-md z-10 transition-all duration-500 delay-400 ${areControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <h3 className="text-sm font-bold mb-2">Filtrar por categoría:</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            className="px-3 py-1 bg-gray-500 hover:bg-gray-300 rounded text-sm transition-colors duration-200"
            onClick={() => filterMarkers('all')}
          >
            Todos
          </button>
          <button 
            className="px-3 py-1 bg-red-600 hover:bg-red-200 rounded text-sm transition-colors duration-200"
            onClick={() => filterMarkers('academic')}
          >
            Académico
          </button>
          <button 
            className="px-3 py-1 bg-orange-400 hover:bg-orange-200 rounded text-sm transition-colors duration-200"
            onClick={() => filterMarkers('dining')}
          >
            Comedor
          </button>
          <button 
            className="px-3 py-1 bg-blue-600 hover:bg-blue-200 rounded text-sm transition-colors duration-200"
            onClick={() => filterMarkers('services')}
          >
            Servicios
          </button>
          <button 
            className="px-3 py-1 bg-green-600 hover:bg-green-200 rounded text-sm transition-colors duration-200"
            onClick={() => filterMarkers('athletics')}
          >
            Deportes
          </button>
          <button 
            className="px-3 py-1 bg-purple-600 hover:bg-purple-200 rounded text-sm transition-colors duration-200"
            onClick={() => filterMarkers('residential')}
          >
            Residencias
          </button>
        </div>
      </div>
      
      {/* Instructions with fade-in animation */}
      <div className={`absolute top-4 right-4 bg-white bg-opacity-90 p-4 rounded shadow-md z-10 transition-all duration-500 delay-200 ${areControlsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <span>Arrastrar para mover</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
            </svg>
          </div>
          <span>Clic para información</span>
        </div>
      </div>
      
      {/* Mobile view controls with fade-in animation */}
      <div className={`absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 md:hidden transition-all duration-500 delay-500 ${areControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <button 
          className="px-4 py-2 bg-red-700 text-white rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.flyTo({
                center: [-98.24159, 19.03056],
                zoom: 16,
                pitch: 45,
                bearing: -17.6,
                duration: 1000
              });
            }
          }}
        >
          Vista general
        </button>
      </div>
    </div>
  );
};

export default SmartCampusMap;