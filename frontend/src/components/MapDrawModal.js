import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Edit3, Trash2, Square } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const MapDrawModal = ({ open, onClose, onSave, initialGeojson }) => {
  const [geojson, setGeojson] = useState(initialGeojson || null);
  const featureGroupRef = useRef();
  const [basemap, setBasemap] = useState('standard');

  // Fonction pour convertir une icône React en SVG data URL
  const iconToDataUrl = (IconComponent) => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IconComponent}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svgString)}")`;
  };

  // Remplacer les icônes par défaut par des icônes Lucide React
  useEffect(() => {
    if (open) {
      const style = document.createElement('style');
      style.id = 'leaflet-draw-lucide-icons';
      style.textContent = `
        /* Masquer les icônes par défaut et ajuster le positionnement */
        .leaflet-draw-toolbar a {
          text-indent: -9999px !important;
          overflow: hidden !important;
        }
        
        /* Icône Square pour Polygone */
        .leaflet-draw-toolbar .leaflet-draw-draw-polygon {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: center !important;
          background-size: 18px 18px !important;
        }
        
        /* Icône Edit3 pour Édition */
        .leaflet-draw-toolbar .leaflet-draw-edit-edit {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: center !important;
          background-size: 18px 18px !important;
        }
        
        /* Icône Trash2 pour Suppression */
        .leaflet-draw-toolbar .leaflet-draw-edit-remove {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 6 3 0'/%3E%3Cpath d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z'/%3E%3Cline x1='10' y1='11' x2='10' y2='17'/%3E%3Cline x1='14' y1='11' x2='14' y2='17'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: center !important;
          background-size: 18px 18px !important;
        }

        /* S'assurer que les boutons ont la bonne taille et le bon centrage */
        .leaflet-draw-toolbar a {
          width: 26px !important;
          height: 26px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* Hover effect personnalisé */
        .leaflet-draw-toolbar a:hover {
          background-color: #f0f0f0 !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('leaflet-draw-lucide-icons');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [open]);

  if (!open) return null;

  const handleCreated = (e) => {
    const layer = e.layer;
    const drawnGeojson = layer.toGeoJSON();
    setGeojson(drawnGeojson.geometry);
  };

  const handleEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer(layer => {
      const editedGeojson = layer.toGeoJSON();
      setGeojson(editedGeojson.geometry);
    });
  };

  const handleDeleted = () => {
    setGeojson(null);
  };

  const handleSave = () => {
    if (geojson) {
      onSave(geojson);
      onClose();
    }
  };
  
  const modalContainer = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50';
  // Supprimer le mode modal compact, toujours utiliser le mode fullscreen
  const modalContentFullscreen = 'relative w-screen h-screen max-w-none max-h-none rounded-none bg-white flex flex-col';
  const headerClass = 'sticky top-0 z-10 bg-white px-6 py-4 border-b flex items-center justify-between';
  const footerClass = 'sticky bottom-0 z-10 bg-white px-6 py-4 border-t flex justify-end space-x-2';

  const modalJSX = (
    <div className={modalContainer}>
      <div className={modalContentFullscreen}>
        {/* Header sticky */}
        <div className={headerClass}>
          <h2 className="text-lg font-bold">Dessiner la parcelle</h2>
          <div className="flex items-center space-x-2">
            <select
              value={basemap}
              onChange={e => setBasemap(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 text-sm"
            >
              <option value="standard">Standard</option>
              <option value="satellite">Satellite + labels</option>
            </select>
            {/* Bouton plein écran supprimé car toujours en plein écran */}
          </div>
        </div>
        {/* Carte occupe tout l'espace entre header et footer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1" style={{height: '100vh', width: '100vw'}}>
            <MapContainer
              center={[-19.0, 47.0]}
              zoom={6}
              style={{ height: '100vh', width: '100vw' }}
            >
              {basemap === 'standard' && (
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
              )}
              {basemap === 'satellite' && (
                <>
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                  />
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                    attribution="Labels © Esri"
                  />
                </>
              )}
              <FeatureGroup ref={featureGroupRef}>
                <EditControl
                  position="topright"
                  onCreated={handleCreated}
                  onEdited={handleEdited}
                  onDeleted={handleDeleted}
                  draw={{
                    rectangle: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false,
                    polygon: { allowIntersection: false, showArea: true }
                  }}
                  edit={{
                    edit: true,
                    remove: true
                  }}
                />
              </FeatureGroup>
            </MapContainer>
          </div>
        </div>
        {/* Footer sticky */}
        <div className={footerClass}>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!geojson}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalJSX, typeof window !== 'undefined' ? document.body : null);
};

export default MapDrawModal;