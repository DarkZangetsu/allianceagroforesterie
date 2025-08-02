import React from 'react';

export default function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmer", 
  cancelText = "Annuler",
  confirmButtonClass = "bg-green-600 hover:bg-green-700",
  cancelButtonClass = "bg-gray-300 hover:bg-gray-400",
  confirmLoading = false,
  confirmDisabled = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded font-semibold text-gray-700 ${cancelButtonClass}`}
            disabled={confirmLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded font-semibold text-white flex items-center justify-center gap-2 ${confirmButtonClass}`}
            disabled={confirmDisabled}
          >
            {confirmLoading && (
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></span>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
} 