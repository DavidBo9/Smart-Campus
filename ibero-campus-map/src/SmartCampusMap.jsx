import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// ==================== MAIN COMPONENT ====================
const SmartCampusMap = ({ onBack, isMobile = window.innerWidth <= 768 }) => {
  // ========== STATE AND REFS ==========
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(false);
  const [showLocationList, setShowLocationList] = useState(!isMobile);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [showInstructions, setShowInstructions] = useState(!isMobile);
  const [activeCategory, setActiveCategory] = useState('all');

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

  // ========== MARKER FUNCTIONS ==========
  // Helper function to create a custom marker element
  const createMarkerElement = (location) => {
    const markerEl = document.createElement('div');
    markerEl.className = 'custom-marker';
    markerEl.style.width = isMobile ? '24px' : '30px';
    markerEl.style.height = isMobile ? '24px' : '30px';
    markerEl.style.borderRadius = '50%';
    markerEl.style.cursor = 'pointer';
    markerEl.style.opacity = '0';
    markerEl.style.willChange = 'transform, opacity';
    markerEl.style.zIndex = '5';
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
    innerDot.style.width = isMobile ? '8px' : '10px';
    innerDot.style.height = isMobile ? '8px' : '10px';
    innerDot.style.borderRadius = '50%';
    innerDot.style.backgroundColor = 'white';
    innerDot.style.transition = 'transform 0.3s ease';
    
    markerEl.appendChild(innerDot);
    
    return markerEl;
  };

  // Add markers to the map with staggered animation
  const addMarkers = () => {
    campusLocations.forEach((location, index) => {
      // Create marker element
      const markerEl = createMarkerElement(location);
      
      // Create popup with responsive sizing
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true,
        maxWidth: isMobile ? '240px' : '300px'
      }).setHTML(
        `<div>
          <h3 style="font-weight: bold; margin-bottom: 5px; font-size: ${isMobile ? '14px' : '16px'};">${location.name}</h3>
          <p style="font-size: ${isMobile ? '12px' : '14px'};">${location.description}</p>
        </div>`
      );
      
      // Create marker and add to map
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
      
      // Make sure touch targets are larger on mobile
      if (isMobile) {
        markerEl.addEventListener('touchstart', () => {
          markerEl.style.transform = 'scale(1.1)';
        });
        
        markerEl.addEventListener('touchend', () => {
          setTimeout(() => {
            markerEl.style.transform = 'scale(1)';
          }, 150);
        });
      }
      
      // Animate markers entrance with staggered delay
      setTimeout(() => {
        markerEl.style.opacity = '1';
      }, 1000 + index * 100);
    });
  };

  // Filter markers by category
  const filterMarkers = (category) => {
    if (!mapLoaded) return;
    
    setActiveCategory(category);
    
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const location = campusLocations.find(loc => loc.id === id);
      
      if (!location) return;
      
      if (category === 'all' || location.category === category) {
        marker.getElement().style.display = 'block';
      } else {
        marker.getElement().style.display = 'none';
      }
    });
    
    // On mobile, collapse filters after selection
    if (isMobile) {
      setTimeout(() => {
        setShowFilters(false);
      }, 500);
    }
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
      const maxBounds = [
        [campusCenter[0] - 0.008, campusCenter[1] - 0.008], // Southwest coordinates
        [campusCenter[0] + 0.008, campusCenter[1] + 0.008]  // Northeast coordinates
      ];
      
      // Create the map instance with optimizations and mobile adaptations
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: campusCenter,
        zoom: isMobile ? 15.5 : 16, // Slightly zoomed out for mobile
        pitch: isMobile ? 30 : 45, // Less pitch on mobile for better viewing
        bearing: -17.6,
        antialias: true,
        fadeDuration: 1000,
        renderWorldCopies: false,
        maxPitch: isMobile ? 50 : 60,
        attributionControl: false,
        preserveDrawingBuffer: false,
        minZoom: 15,
        maxZoom: 18,
        maxBounds: maxBounds
      });
      
      // Save the map reference
      mapRef.current = map;
      
      // Add navigation controls (smaller on mobile)
      map.addControl(new mapboxgl.NavigationControl({
        showCompass: !isMobile, // Hide compass on mobile
        showZoom: true,
        visualizePitch: !isMobile // Hide pitch visualization on mobile
      }));
      
      // Add geolocate control for mobile users
      if (isMobile) {
        map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));
      }
      
      // Add optimization events
      map.on('movestart', () => {
        if (mapContainerRef.current) {
          mapContainerRef.current.style.willChange = 'transform';
        }
        
        Object.values(markersRef.current).forEach(marker => {
          const markerEl = marker.getElement();
          markerEl.style.transition = 'none';
          markerEl.style.willChange = 'transform';
        });
      });
      
      map.on('moveend', () => {
        if (mapContainerRef.current) {
          mapContainerRef.current.style.willChange = 'auto';
        }
        
        setTimeout(() => {
          Object.values(markersRef.current).forEach(marker => {
            const markerEl = marker.getElement();
            markerEl.style.transition = 'opacity 0.5s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            markerEl.style.willChange = 'auto';
          });
        }, 100);
      });
      
      // When map loads, add buildings and markers
      map.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        
        // Add 3D buildings
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
      
      // Optimize rendering on mobile
      if (isMobile) {
        map.on('render', () => {
          if (!map.isMoving() && !map.isZooming() && !map.isRotating()) {
            // Reduce render frequency when not moving
            map.stop();
          }
        });
      }
      
      // Handle orientation changes
      const handleOrientationChange = () => {
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.resize();
          }
        }, 200);
      };
      
      window.addEventListener('orientationchange', handleOrientationChange);
      
      // Cleanup function
      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange);
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    }
  }, [isMobile]);

  // ========== LOCATION SELECTION ==========
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      // Reset all markers
      Object.values(markersRef.current).forEach(marker => {
        if (marker.getPopup() && marker.getPopup().isOpen()) {
          marker.togglePopup();
        }
        
        const markerEl = marker.getElement();
        markerEl.style.transform = 'scale(1)';
        markerEl.style.zIndex = '5';
        markerEl.style.boxShadow = '0 0 0 2px white';
        markerEl.classList.remove('marker-selected');
        markerEl.style.opacity = '0.7';
      });
      
      // Get the selected marker
      const selectedMarker = markersRef.current[selectedLocation.id];
      if (!selectedMarker) return;
      
      // On mobile, auto-hide panels for better map visibility
      if (isMobile) {
        setShowLocationList(false);
        setShowFilters(false);
        setShowInstructions(false);
      }
      
      // Move map to center on the location
      mapRef.current.flyTo({
        center: selectedLocation.coordinates,
        zoom: isMobile ? 16.5 : 17,
        duration: 500,
        essential: true
      });
      
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
        selectedMarkerEl.style.boxShadow = '0 0 0 2px #C8102E';
        selectedMarkerEl.classList.add('marker-selected');
        
        // Create and set a new popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: true,
          maxWidth: isMobile ? '220px' : '300px',
          className: 'custom-popup'
        }).setHTML(
          `<div>
            <h3 style="font-weight: bold; margin-bottom: 5px; font-size: ${isMobile ? '14px' : '16px'};">${selectedLocation.name}</h3>
            <p style="font-size: ${isMobile ? '12px' : '14px'};">${selectedLocation.description}</p>
          </div>`
        );
        
        selectedMarker.setPopup(popup);
        
        setTimeout(() => {
          selectedMarker.togglePopup();
        }, 50);
        
        mapRef.current.off('moveend', moveEndHandler);
      };
      
      mapRef.current.on('moveend', moveEndHandler);
    }
  }, [selectedLocation, isMobile]);

  // Handle back button click with animation
  const handleBack = () => {
    setAreControlsVisible(false);
    setTimeout(() => {
      setIsMapVisible(false);
      setTimeout(() => {
        onBack();
      }, 500);
    }, 300);
  };

  // ========== RENDER ==========
  return (
    <div className="smart-campus-map">
      {/* Map Container with fade-in animation */}
      <div 
        ref={mapContainerRef} 
        className="map-container"
        style={{
          opacity: isMapVisible ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }} 
      />
      
      {/* Back Button - Always visible */}
      <button 
        onClick={handleBack} 
        className={`back-button ${areControlsVisible ? 'visible' : 'hidden'}`}
        aria-label="Volver"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      
      {/* Header - Always visible but responsive */}
      <div className={`map-header ${areControlsVisible ? 'visible' : 'hidden'}`}>
        <div className="logo-container">
          <h1 className="text-red-700">IBERO</h1>
          <span>Puebla</span>
        </div>
        <h2>Explora Smart Campus</h2>
        {!isMobile && (
          <p className="header-description">
            Conoce nuestros diferentes sensores ubicados en diferentes partes del campus.
          </p>
        )}
      </div>
      
      {/* Mobile Control Center - only on mobile */}
      {isMobile && areControlsVisible && (
        <div className="mobile-control-center">
          <button 
            className={`control-button ${showLocationList ? 'active' : ''}`}
            onClick={() => setShowLocationList(!showLocationList)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
            </svg>
            Lugares
          </button>
          
          <button 
            className={`control-button ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filtros
          </button>
          
          <button 
            className={`control-button ${showInstructions ? 'active' : ''}`}
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Info
          </button>
          
          <button 
            className="control-button"
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.flyTo({
                  center: [-98.24159, 19.03056],
                  zoom: isMobile ? 15.5 : 16,
                  pitch: isMobile ? 30 : 45,
                  bearing: -17.6,
                  duration: 1000
                });
                setSelectedLocation(null);
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Centro
          </button>
        </div>
      )}
      
      {/* Location List - Collapsible on mobile */}
      {showLocationList && (
        <div className={`location-panel ${areControlsVisible ? 'visible' : 'hidden'}`}>
          <div className="panel-header">
            <h3>Lugares del Campus</h3>
            {isMobile && (
              <button 
                className="close-panel"
                onClick={() => setShowLocationList(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <ul className="location-list">
            {campusLocations.map((location) => (
              <li 
                key={location.id}
                className={`location-item ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                onClick={() => setSelectedLocation(location)}
              >
                <div 
                  className="location-color-dot"
                  style={{
                    backgroundColor: 
                      location.category === 'academic' ? '#C8102E' :
                      location.category === 'dining' ? '#FFC72C' :
                      location.category === 'services' ? '#0078D4' :
                      location.category === 'athletics' ? '#107C10' :
                      location.category === 'residential' ? '#5C2D91' : '#C8102E'
                  }}
                />
                <span className="location-name">{location.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Category Filter - Collapsible on mobile */}
      {showFilters && (
        <div className={`filters-panel ${areControlsVisible ? 'visible' : 'hidden'}`}>
          <div className="panel-header">
            <h3>Filtrar por categoría</h3>
            {isMobile && (
              <button 
                className="close-panel"
                onClick={() => setShowFilters(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-button all ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => filterMarkers('all')}
            >
              Todos
            </button>
            <button 
              className={`filter-button academic ${activeCategory === 'academic' ? 'active' : ''}`}
              onClick={() => filterMarkers('academic')}
            >
              Académico
            </button>
            <button 
              className={`filter-button dining ${activeCategory === 'dining' ? 'active' : ''}`}
              onClick={() => filterMarkers('dining')}
            >
              Comedor
            </button>
            <button 
              className={`filter-button services ${activeCategory === 'services' ? 'active' : ''}`}
              onClick={() => filterMarkers('services')}
            >
              Servicios
            </button>
            <button 
              className={`filter-button athletics ${activeCategory === 'athletics' ? 'active' : ''}`}
              onClick={() => filterMarkers('athletics')}
            >
              Deportes
            </button>
            <button 
              className={`filter-button residential ${activeCategory === 'residential' ? 'active' : ''}`}
              onClick={() => filterMarkers('residential')}
            >
              Residencias
            </button>
          </div>
        </div>
      )}
      
      {/* Instructions panel - Collapsible on mobile */}
      {showInstructions && (
        <div className={`instructions-panel ${areControlsVisible ? 'visible' : 'hidden'}`}>
          <div className="panel-header">
            <h3>Cómo usar el mapa</h3>
            {isMobile && (
              <button 
                className="close-panel"
                onClick={() => setShowInstructions(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <div className="instruction-items">
            <div className="instruction-item">
              <div className="instruction-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Arrastrar para mover</span>
            </div>
            <div className="instruction-item">
              <div className="instruction-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Clic para información</span>
            </div>
            {isMobile && (
              <div className="instruction-item">
                <div className="instruction-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 5a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Usa los botones abajo para controlar el mapa</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Return to center button - only on desktop */}
      {!isMobile && areControlsVisible && (
        <button 
          className="center-button"
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.flyTo({
                center: [-98.24159, 19.03056],
                zoom: 16,
                pitch: 45,
                bearing: -17.6,
                duration: 1000
              });
              setSelectedLocation(null);
            }
          }}
        >
          Vista general
        </button>
      )}
    </div>
  );
};

export default SmartCampusMap;