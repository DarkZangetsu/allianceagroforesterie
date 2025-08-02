import React, { useState } from 'react';

const PRATIQUE_CHOICES = [
  { value: 'structure_brise_vent', label: 'Structure Brise-vent' },
  { value: 'structure_pare_feu', label: 'Structure Pare feu' },
  { value: 'structures_antierosives', label: 'Structures antiérosives' },
  { value: 'structure_cultures_couloir', label: 'Structure Cultures en Couloir/allée' },
  { value: 'pratiques_taillage_coupe', label: 'Pratiques de taillage, coupe et application engrais verts' },
  { value: 'pratiques_couverture_sol', label: 'Pratiques couverture du sol' },
  { value: 'pratiques_conservation_eau', label: "Pratiques/structures conservation d'eau" },
  { value: 'systeme_multi_etage', label: 'Système multi-étage diversifié' },
  { value: 'arbres_autochtones', label: 'Arbres Autochtones' },
  { value: 'production_epices', label: 'Production épices' },
  { value: 'production_bois_energie', label: 'Production Bois énergie' },
  { value: 'production_fruit', label: 'Production fruit' },
  { value: 'integration_cultures_vivrieres', label: 'Intégration cultures vivrières' },
  { value: 'integration_elevage', label: ",Intégration d'élevage" },
];

export default function PratiqueFilter({ selectedPratiques = [], onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectAll = () => {
    if (selectedPratiques.length === PRATIQUE_CHOICES.length) {
      onFilterChange([]);
    } else {
      onFilterChange(PRATIQUE_CHOICES.map(p => p.value));
    }
  };

  const handlePratiqueToggle = (pratique) => {
    const newSelection = selectedPratiques.includes(pratique)
      ? selectedPratiques.filter(p => p !== pratique)
      : [...selectedPratiques, pratique];
    onFilterChange(newSelection);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <span>
          {selectedPratiques.length === 0
            ? 'Toutes les pratiques'
            : selectedPratiques.length === PRATIQUE_CHOICES.length
              ? 'Toutes les pratiques'
              : `${selectedPratiques.length} pratique(s) sélectionnée(s)`}
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
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedPratiques.length === PRATIQUE_CHOICES.length}
                onChange={handleSelectAll}
                className="mr-2"
              />
              Toutes les pratiques
            </label>
            {PRATIQUE_CHOICES.map(pratique => (
              <label key={pratique.value} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedPratiques.includes(pratique.value)}
                  onChange={() => handlePratiqueToggle(pratique.value)}
                  className="mr-2"
                />
                {pratique.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
