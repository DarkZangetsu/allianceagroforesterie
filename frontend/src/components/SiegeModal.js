import React from 'react';
import SiegeForm from './SiegeForm';

const SiegeModal = ({ open, onClose, initialData = null, mode = 'add', siegeId = null, onSuccess }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-0 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none z-10"
          aria-label="Fermer"
        >
          &times;
        </button>
        <SiegeForm
          initialData={initialData}
          mode={mode}
          siegeId={siegeId}
          onSuccess={siege => {
            onSuccess && onSuccess(siege);
            onClose && onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default SiegeModal; 