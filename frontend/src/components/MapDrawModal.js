import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const MapDrawModal = ({ open, onClose, onSave, initialGeojson }) => {
  const [geojson, setGeojson] = useState(initialGeojson || null);
  const featureGroupRef = useRef();
  const [basemap, setBasemap] = useState('standard');
  // Toujours en plein écran
  const fullscreen = true;

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