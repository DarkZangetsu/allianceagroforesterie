import React from 'react';
import ParcelleForm from './ParcelleForm';

const ParcelleModal = ({ open, onClose, parcelle = null, onSuccess }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] p-0 relative animate-fade-in flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none z-10"
          aria-label="Fermer"
        >
          &times;
        </button>
        <div className="flex-1 overflow-y-auto">
          <ParcelleForm
            parcelle={parcelle}
            onSuccess={parcelle => {
              onSuccess && onSuccess(parcelle);
              onClose && onClose();
            }}
            onCancel={onClose}
            mode={parcelle ? 'edit' : 'add'}
          />
        </div>
      </div>
    </div>
  );
};

export default ParcelleModal;