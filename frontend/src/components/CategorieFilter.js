"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const CATEGORIES = [
  { value: 'social', label: 'Siège social' },
  { value: 'regional', label: 'Siège régional' },
  { value: 'technique', label: 'Siège technique' },
  { value: 'provisoire', label: 'Siège provisoire' }
];

export default function CategorieFilter({ selectedCategories, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryToggle = (categoryValue) => {
    let newSelected;
    if (selectedCategories.includes(categoryValue)) {
      newSelected = selectedCategories.filter(cat => cat !== categoryValue);
    } else {
      newSelected = [...selectedCategories, categoryValue];
    }
    onFilterChange(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === CATEGORIES.length) {
      onFilterChange([]);
    } else {
      onFilterChange(CATEGORIES.map(cat => cat.value));
    }
  };

  const getSelectedLabels = () => {
    if (selectedCategories.length === 0) return "Toutes les catégories";
    if (selectedCategories.length === CATEGORIES.length) return "Toutes les catégories";
    if (selectedCategories.length === 1) {
      const category = CATEGORIES.find(cat => cat.value === selectedCategories[0]);
      return category ? category.label : selectedCategories[0];
    }
    return `${selectedCategories.length} catégories sélectionnées`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className="block truncate text-gray-700">
            {getSelectedLabels()}
          </span>
          <ChevronDown 
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1 max-h-60 overflow-auto">
            {/* Option "Sélectionner tout" */}
            <div 
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
              onClick={handleSelectAll}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={selectedCategories.length === CATEGORIES.length}
                  onChange={() => {}}
                  onClick={(e) => e.stopPropagation()}
                />
                <label className="ml-2 text-sm text-gray-900 font-medium">
                  Toutes les catégories
                </label>
              </div>
            </div>

            {/* Options des catégories */}
            {CATEGORIES.map((category) => (
              <div 
                key={category.value}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCategoryToggle(category.value)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={selectedCategories.includes(category.value)}
                    onChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label className="ml-2 text-sm text-gray-900">
                    {category.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}