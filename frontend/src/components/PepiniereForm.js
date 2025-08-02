import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PEPINIERE, UPDATE_PEPINIERE, GET_ME } from '../lib/graphql-queries';
import { useToast } from '../lib/useToast';
import MapPointModal from './MapPointModal';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import ConfirmationDialog from './ConfirmationDialog';

const PepiniereForm = ({ onSuccess, onCancel, initialData = null, mode = 'add', pepiniereId = null }) => {
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    latitude: '',
    longitude: '',
    description: '',
    nomGestionnaire: '',
    posteGestionnaire: '',
    telephoneGestionnaire: '',
    emailGestionnaire: '',
    especesProduites: '',
    nomProjet: '',
    quantiteProductionGenerale: ''
  });
  const [photos, setPhotos] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const { showSuccess, showError } = useToast();
  const [createPepiniere, { loading: loadingCreate }] = useMutation(CREATE_PEPINIERE);
  const [updatePepiniere, { loading: loadingUpdate }] = useMutation(UPDATE_PEPINIERE);

  // Récupérer les projets de l'utilisateur connecté
  const { data: meData } = useQuery(GET_ME);
  const projets = (meData?.me?.nomProjet || '').split(',').map(p => p.trim()).filter(Boolean);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || '',
        adresse: initialData.adresse || '',
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || '',
        description: initialData.description || '',
        nomGestionnaire: initialData.nomGestionnaire || '',
        posteGestionnaire: initialData.posteGestionnaire || '',
        telephoneGestionnaire: initialData.telephoneGestionnaire || '',
        emailGestionnaire: initialData.emailGestionnaire || '',
        especesProduites: initialData.especesProduites || '',
        nomProjet: initialData.nomProjet || '',
        quantiteProductionGenerale: initialData.quantiteProductionGenerale || ''
      });
      // Charger les photos existantes si en mode édition
      if (initialData.photos) {
        const apiUrl =  `${process.env.NEXT_PUBLIC_API_URL}/media/` || '';
        setPhotos(
          initialData.photos.slice(0, 3).map(photo => ({
            id: photo.id,
            url: photo.image ? (photo.image.startsWith('http') ? photo.image : `${apiUrl.replace(/\/$/, '')}/${photo.image.replace(/^\//, '')}`) : '',
            titre: photo.titre || '',
            description: photo.description || '',
            isExisting: true
          }))
        );
      }
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 3) {
      showError('Vous pouvez ajouter au maximum 3 photos.');
      return;
    }
    
    const newPhotos = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      titre: '',
      description: '',
      isExisting: false
    }));
    
    setPhotos(prev => [...prev, ...newPhotos].slice(0, 3));
  };

  const removePhoto = (index) => {
    setPhotos(prev => {
      const newPhotos = prev.filter((_, i) => i !== index);
      return newPhotos;
    });
  };

  const updatePhotoInfo = (index, field, value) => {
    setPhotos(prev => prev.map((photo, i) => 
      i === index ? { ...photo, [field]: value } : photo
    ));
  };

  const handleMapSelect = (geometry) => {
    if (geometry && geometry.type === 'Point' && geometry.coordinates.length === 2) {
      setFormData(prev => ({
        ...prev,
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0]
      }));
    } else {
      showError('Veuillez sélectionner un point sur la carte.');
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.adresse || !formData.latitude || !formData.longitude) {
      showError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      // Préparer les nouvelles photos (fichiers)
      const newPhotos = photos.filter(photo => !photo.isExisting).map(photo => photo.file);
      if (mode === 'edit' && pepiniereId) {
        const { data } = await updatePepiniere({
          variables: {
            id: pepiniereId,
            nom: formData.nom,
            adresse: formData.adresse,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            description: formData.description,
            nomGestionnaire: formData.nomGestionnaire,
            posteGestionnaire: formData.posteGestionnaire,
            telephoneGestionnaire: formData.telephoneGestionnaire,
            emailGestionnaire: formData.emailGestionnaire,
            especesProduites: formData.especesProduites,
            nomProjet: formData.nomProjet,
            quantiteProductionGenerale: formData.quantiteProductionGenerale,
            photos: newPhotos
          }
        });
        if (data.updatePepiniere.success) {
          showSuccess('Pépinière mise à jour avec succès.');
          if (onSuccess) onSuccess();
        } else {
          showError(data.updatePepiniere.message || 'Erreur lors de la mise à jour.');
        }
      } else {
        const { data } = await createPepiniere({
          variables: {
            nom: formData.nom,
            adresse: formData.adresse,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            description: formData.description,
            nomGestionnaire: formData.nomGestionnaire,
            posteGestionnaire: formData.posteGestionnaire,
            telephoneGestionnaire: formData.telephoneGestionnaire,
            emailGestionnaire: formData.emailGestionnaire,
            especesProduites: formData.especesProduites,
            nomProjet: formData.nomProjet,
            quantiteProductionGenerale: formData.quantiteProductionGenerale,
            photos: newPhotos
          }
        });
        if (data.createPepiniere.success) {
          showSuccess('Pépinière créée avec succès.');
          if (onSuccess) onSuccess();
        } else {
          showError(data.createPepiniere.message || 'Erreur lors de la création.');
        }
      }
      setShowConfirm(false);
    } catch (error) {
      showError('Erreur lors de la soumission de la pépinière.');
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      {/* Header fixe - complètement séparé */}
      <div className="bg-white border-b border-gray-200 p-6 rounded-t-lg">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'edit' ? 'Modifier la pépinière' : 'Ajouter une pépinière'}
        </h2>
      </div>

      {/* Contenu scrollable - section séparée */}
      <div className="bg-white overflow-y-auto max-h-[60vh]">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input 
                  type="text" 
                  name="nom" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.nom} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du projet</label>
                <select
                  name="nomProjet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.nomProjet}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionner un projet</option>
                  {projets.map((projet, idx) => (
                    <option key={idx} value={projet}>{projet}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
              <input 
                type="text" 
                name="adresse" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                value={formData.adresse} 
                onChange={handleInputChange} 
              />
            </div>

            {/* Coordonnées */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                <input 
                  type="number" 
                  step="0.000001" 
                  name="latitude" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.latitude} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                <input 
                  type="number" 
                  step="0.000001" 
                  name="longitude" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.longitude} 
                  onChange={handleInputChange} 
                />
              </div>
              <button 
                type="button" 
                onClick={() => setShowMapModal(true)} 
                className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Sélectionner sur la carte
              </button>
            </div>

            {/* Gestionnaire */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du gestionnaire</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du gestionnaire</label>
                  <input 
                    type="text" 
                    name="nomGestionnaire" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={formData.nomGestionnaire} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poste du gestionnaire</label>
                  <input 
                    type="text" 
                    name="posteGestionnaire" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={formData.posteGestionnaire} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone du gestionnaire</label>
                  <input 
                    type="tel" 
                    name="telephoneGestionnaire" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={formData.telephoneGestionnaire} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email du gestionnaire</label>
                  <input 
                    type="email" 
                    name="emailGestionnaire" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={formData.emailGestionnaire} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
            </div>

            {/* Production */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de production</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Espèces produites</label>
                  <textarea 
                    name="especesProduites" 
                    rows="3" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={formData.especesProduites} 
                    onChange={handleInputChange} 
                    placeholder="Liste des espèces produites" 
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantité de production générale</label>
                <textarea 
                  name="quantiteProductionGenerale" 
                  rows="3" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={formData.quantiteProductionGenerale} 
                  onChange={handleInputChange} 
                  placeholder="Description de la production générale" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                name="description" 
                rows="3" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>

            {/* Photos (tout en bas) */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Photos de la pépinière (max 3)</h3>
              <div className="space-y-4">
                {/* Upload de nouvelles photos */}
                {photos.length < 2 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          Cliquez pour ajouter une photo
                        </span>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG jusqu'à 10MB
                    </p>
                  </div>
                )}

                {/* Affichage des photos */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative border rounded-lg p-4">
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                        <div className="flex items-center space-x-3 mb-3">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Titre de la photo"
                              value={photo.titre}
                              onChange={(e) => updatePhotoInfo(index, 'titre', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                        </div>
                        <img
                          src={photo.url}
                          alt={photo.titre || 'Photo de la pépinière'}
                          className="w-full h-32 object-cover rounded"
                        />
                        <textarea
                          placeholder="Description de la photo"
                          value={photo.description}
                          onChange={(e) => updatePhotoInfo(index, 'description', e.target.value)}
                          className="w-full mt-2 text-sm border border-gray-300 rounded px-2 py-1 resize-none"
                          rows="2"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer fixe - complètement séparé */}
      <div className="bg-white border-t border-gray-200 p-6 rounded-b-lg">
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loadingCreate || loadingUpdate} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {(loadingCreate || loadingUpdate) ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {mode === 'edit' ? 'Mise à jour...' : 'Création...'}
              </div>
            ) : (
              mode === 'edit' ? 'Mettre à jour' : 'Créer la pépinière'
            )}
          </button>
        </div>
      </div>

      {showMapModal && (
        <MapPointModal
          open={showMapModal}
          onClose={() => setShowMapModal(false)}
          onSave={geometry => {
            handleMapSelect(geometry);
            setShowMapModal(false);
          }}
          initialPosition={formData.latitude && formData.longitude ? [parseFloat(formData.latitude), parseFloat(formData.longitude)] : null}
        />
      )}

      {showConfirm && (
        <ConfirmationDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
          title={mode === 'edit' ? 'Confirmer la modification' : 'Confirmer la création'}
          message={mode === 'edit' ? 'Voulez-vous vraiment modifier cette pépinière ?' : 'Voulez-vous vraiment créer cette pépinière ?'}
          confirmText={mode === 'edit' ? 'Mettre à jour' : 'Créer'}
          confirmButtonClass={confirmLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
          cancelButtonClass={confirmLoading ? 'cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}
          confirmDisabled={confirmLoading}
          confirmLoading={confirmLoading}
        />
      )}
    </>
  );
};

export default PepiniereForm; 