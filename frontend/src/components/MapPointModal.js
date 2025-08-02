import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const contentStyle = {
  background: 'white',
  borderRadius: '8px',
  padding: '24px',
  width: '600px',
  minWidth: '350px',
  height: '500px',
  minHeight: '400px',
  maxWidth: '90vw',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
};

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function PointSelector({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

const MapPointModal = ({ open, onClose, onSave, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || null);
  // Toujours en plein écran
  const fullscreen = true;
  const [basemap, setBasemap] = useState('standard');

  if (!open) return null;

  const handleSave = () => {
    if (position) {
      onSave({ type: 'Point', coordinates: [position[1], position[0]] });
      onClose();
    }
  };

  return (
    <div style={{ ...modalStyle, zIndex: 1000 }}>
      <div
        style={{
          ...contentStyle,
          width: '100vw',
          minWidth: '100vw',
          height: '100vh',
          minHeight: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          padding: 0,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="flex items-center justify-between mb-2" style={{padding: '16px 24px 0 24px'}}>
          <h2 className="text-lg font-bold">Sélectionner la position du siège</h2>
          <div className="flex items-center space-x-2">
            <select
              value={basemap}
              onChange={e => setBasemap(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100"
              style={{fontSize: '0.95em'}}>
              <option value="standard">Standard</option>
              <option value="satellite">Satellite + labels</option>
            </select>
            {/* Bouton plein écran supprimé car toujours en plein écran */}
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MapContainer
            center={position || [-19.0, 47.0]}
            zoom={position ? 12 : 6}
            style={{ height: '100%', width: '100%' }}
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
            <PointSelector position={position} setPosition={setPosition} />
            {position && <Marker position={position} icon={markerIcon} />}
          </MapContainer>
        </div>
        <div
          className="flex justify-end mt-4 space-x-2"
          style={{
            background: 'white',
            padding: '0 24px 24px 24px',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            boxShadow: '0 -2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!position}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPointModal; 