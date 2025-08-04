import React from 'react';
import ParcellesMap from './ParcellesMap';

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
  width: '800px',
  minWidth: '350px',
  height: '600px',
  minHeight: '400px',
  maxWidth: '95vw',
  maxHeight: '95vh',
  display: 'flex',
  flexDirection: 'column',
};

export default function ParcelleMapModal({ open, onClose, parcelle }) {
  const [mapStyle, setMapStyle] = React.useState('street');
  if (!open || !parcelle) return null;
  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Voir sur la carte</h2>
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Fermer</button>
        </div>
        <div className="mb-2 flex gap-2 items-center">
          <label htmlFor="map-style" className="font-medium">Style de carte :</label>
          <select
            id="map-style"
            value={mapStyle}
            onChange={e => setMapStyle(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="street">Carte routière</option>
            <option value="satellite">Satellite</option>
            <option value="hybrid">Hybride</option>
          </select>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ParcellesMap parcelles={[parcelle]} style={{ height: '100%', width: '100%' }} mapStyle={mapStyle} mode="parcelle" />
        </div>
      </div>
    </div>
  );
}
