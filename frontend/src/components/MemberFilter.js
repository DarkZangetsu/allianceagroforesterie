'use client';

import { useState } from 'react';
import { getLogoUrl } from '../lib/utils';

const MemberFilter = ({ users = [], selectedMembers = [], onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const safeUsers = Array.isArray(users) ? users : [];
  const safeSelectedMembers = Array.isArray(selectedMembers) ? selectedMembers : [];

  const handleSelectAll = () => {
    if (safeSelectedMembers.length === safeUsers.length) {
      // Si tous sont sélectionnés, désélectionner tous
      onFilterChange([]);
    } else {
      // Sinon, sélectionner tous
      onFilterChange(safeUsers.map(user => user.id));
    }
  };

  const handleMemberToggle = (memberId) => {
    const newSelection = safeSelectedMembers.includes(memberId)
      ? safeSelectedMembers.filter(id => id !== memberId)
      : [...safeSelectedMembers, memberId];
    onFilterChange(newSelection);
  };

  const selectedCount = safeSelectedMembers.length;
  const totalCount = safeUsers.length;

  return (
    <div className="relative">
      {/* Bouton du filtre */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <span>
          {selectedCount === 0 
            ? 'Tous les institutions' 
            : selectedCount === totalCount 
              ? 'Tous les institutions' 
              : `${selectedCount} institution(s) sélectionnée(s)`
          }
        </span>
        <svg
          className={`w-5 h-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            {/* Option "Sélectionner tout" */}
            <label className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCount === totalCount && totalCount > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-3 font-medium text-gray-900">
                Sélectionner tout ({totalCount})
              </span>
            </label>

            <div className="border-t border-gray-200 my-2"></div>

            {/* Liste des membres */}
            {safeUsers.map((user) => (
              <label
                key={user.id}
                className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={safeSelectedMembers.includes(user.id)}
                  onChange={() => handleMemberToggle(user.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div className="ml-3 flex items-center">
                  {user.logo && (
                    <img
                      src={getLogoUrl(user.logo)}
                      alt="Logo"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  )}
                  <span className="ml-2 text-xs text-gray-500">
                    {user.nomInstitution}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Overlay pour fermer le dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MemberFilter; 