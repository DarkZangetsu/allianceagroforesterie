import React from 'react';
import PepiniereForm from './PepiniereForm';

const PepiniereModal = ({ open, onClose, onSuccess, initialData = null, mode = 'add', pepiniereId = null }) => {
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
        <PepiniereForm
          onSuccess={(pepiniere) => {
            onSuccess && onSuccess(pepiniere);
            onClose && onClose();
          }}
          onCancel={onClose}
          initialData={initialData}
          mode={mode}
          pepiniereId={pepiniereId}
        />
      </div>
    </div>
  );
};

export default PepiniereModal; 