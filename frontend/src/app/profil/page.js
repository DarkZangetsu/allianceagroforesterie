"use client";
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME, UPDATE_USER_ABREVIATION, UPDATE_USER_LOGO, UPDATE_USER_PROFILE, CHANGE_PASSWORD } from '../../lib/graphql-queries';
import { toast } from 'sonner';
import { useAuthGuard } from '../../lib/useAuthGuard';
import ConfirmationDialog from '../../components/ConfirmationDialog';
// ...
import { useAuth } from '../../components/Providers';
import { getLogoUrl } from '../../lib/utils';
import PasswordChangeModal from '../../components/PasswordChangeModal';

export default function ProfilPage() {
  const { isLoading, isAuthorized } = useAuthGuard(true);
  const { isAuthenticated } = useAuth();
  const { data, loading, refetch, error } = useQuery(GET_ME, {
    skip: !isAuthenticated,
    onError: (error) => {
      console.error('Erreur GET_ME:', error);
    }
  });
  const [updateUserAbreviation] = useMutation(UPDATE_USER_ABREVIATION);
  const [updateUserLogo] = useMutation(UPDATE_USER_LOGO);
  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const user = data?.me;
  const [form, setForm] = useState({
    nomInstitution: '',
    nomProjets: [],
    newProjet: '',
    email: '',
    abreviation: '',
    logo: null
  });

  // Mettre à jour le formulaire quand les données utilisateur sont chargées
  React.useEffect(() => {
    if (user) {
      setForm({
        nomInstitution: user.nomInstitution || '',
        nomProjets: user.nomProjet ? user.nomProjet.split(',').map(p => p.trim()).filter(Boolean) : [],
        newProjet: '',
        email: user.email || '',
        abreviation: user.abreviation || '',
        logo: null
      });
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Afficher un loader pendant la vérification d'authentification
  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">
            {isLoading ? 'Vérification de l\'authentification...' : 'Redirection vers la page de connexion...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="text-slate-500 text-lg">Veuillez vous connecter pour accéder à votre profil.</div>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="text-red-500 mb-4 font-medium">Erreur lors du chargement du profil: {error.message}</div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="text-slate-500 text-lg">Aucune donnée utilisateur.</div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const handleAddProjet = (e) => {
    e.preventDefault();
    const projet = form.newProjet.trim();
    if (projet && !form.nomProjets.includes(projet)) {
      setForm(f => ({ ...f, nomProjets: [...f.nomProjets, projet], newProjet: '' }));
    }
  };

  const handleRemoveProjet = (projet) => {
    setForm(f => ({ ...f, nomProjets: f.nomProjets.filter(p => p !== projet) }));
  };

  const handleProjetInput = (e) => {
    const value = e.target.value;
    if (value.endsWith(',')) {
      const projet = value.slice(0, -1).trim();
      if (projet && !form.nomProjets.includes(projet)) {
        setForm(f => ({ ...f, nomProjets: [...f.nomProjets, projet], newProjet: '' }));
      } else {
        setForm(f => ({ ...f, newProjet: '' }));
      }
    } else {
      setForm(f => ({ ...f, newProjet: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const hasChanges = 
      form.nomInstitution !== user.nomInstitution ||
      form.nomProjets.join(', ') !== (user.nomProjet || '') ||
      form.email !== user.email ||
      form.abreviation !== user.abreviation;
    
    if (!hasChanges) {
      toast.error('Aucune modification détectée');
      return;
    }
    
    setPendingAction('save');
    setShowConfirmDialog(true);
  };

  const executeSave = async () => {
    setIsSaving(true);
    try {
      let success = true;
      let errorMessage = '';

      if (form.abreviation !== user.abreviation) {
        const { data: abreviationData } = await updateUserAbreviation({
          variables: { userId: user.id, abreviation: form.abreviation }
        });
        if (!abreviationData.updateUserAbreviation.success) {
          success = false;
          errorMessage = abreviationData.updateUserAbreviation.message;
        }
      }

      if (success && (
        form.nomInstitution !== user.nomInstitution ||
        form.nomProjets.join(', ') !== (user.nomProjet || '') ||
        form.email !== user.email
      )) {
        const { data: profileData } = await updateUserProfile({
          variables: {
            nomInstitution: form.nomInstitution,
            nomProjet: form.nomProjets.join(', '),
            email: form.email
          }
        });
        if (!profileData.updateUserProfile.success) {
          success = false;
          errorMessage = profileData.updateUserProfile.message;
        }
      }

      if (success) {
        toast.success('Profil mis à jour avec succès');
        setIsEditing(false);
        refetch();
      } else {
        toast.error(errorMessage || 'Erreur lors de la mise à jour');
      }
    } catch (e) {
      console.error('Erreur lors de la mise à jour:', e);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPendingAction('logo');
    setShowConfirmDialog(true);
  };

  const executeLogoUpdate = async () => {
    setIsSaving(true);
    try {
      const file = document.querySelector('input[name="logo"]').files?.[0];
      if (!file) {
        toast.error('Aucun fichier sélectionné');
        return;
      }
      
      const { data } = await updateUserLogo({ variables: { logo: file } });
      if (data.updateUserLogo.success) {
        toast.success('Logo mis à jour avec succès');
        refetch();
      } else {
        toast.error(data.updateUserLogo.message);
      }
    } catch (e) {
      toast.error('Erreur lors de la mise à jour du logo');
    } finally {
      setIsSaving(false);
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const handlePasswordModalSubmit = async (passwordForm, resetForm) => {
    if (passwordForm.new1 !== passwordForm.new2) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    setIsChangingPassword(true);
    try {
      const { data } = await changePassword({
        variables: { oldPassword: passwordForm.old, newPassword: passwordForm.new1 }
      });
      if (data.changePassword.success) {
        toast.success('Mot de passe modifié avec succès');
        setShowPasswordModal(false);
        resetForm && resetForm();
      } else {
        toast.error(data.changePassword.message);
      }
    } catch (e) {
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const resetForm = () => {
    setForm({
      nomInstitution: user.nomInstitution || '',
      nomProjets: user.nomProjet ? user.nomProjet.split(',').map(p => p.trim()).filter(Boolean) : [],
      newProjet: '',
      email: user.email || '',
      abreviation: user.abreviation || '',
      logo: null
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Mon profil</h1>
            <p className="text-slate-600">Gérez vos informations personnelles et préférences</p>
          </div>
          {/* Debug Auth button removed */}
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-3xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden">
          <form onSubmit={handleSave} className="p-8">
            {/* Section Logo */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
              <div className="relative group">
                {user.logo ? (
                  <img 
                    src={getLogoUrl(user.logo)} 
                    alt="Logo" 
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow" 
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-white shadow-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg group-hover:bg-blue-600 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Photo de profil</label>
                <input 
                  type="file" 
                  name="logo" 
                  accept="image/*" 
                  onChange={handleLogoChange} 
                  disabled={isSaving} 
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors" 
                />
                <p className="text-xs text-slate-500 mt-2">PNG, JPG ou GIF (max. 2MB)</p>
              </div>
            </div>

            {/* Informations principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Nom de l'institution</label>
                <input
                  type="text"
                  name="nomInstitution"
                  value={form.nomInstitution}
                  readOnly
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 cursor-not-allowed text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!isEditing || isSaving}
                  className={`w-full px-4 py-3 border rounded-xl transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 ${
                    !isEditing 
                      ? 'border-slate-200 bg-slate-50 text-slate-600' 
                      : 'border-slate-300 bg-white text-slate-800'
                  }`}
                />
              </div>
            </div>

            {/* Projets */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Projets rattachés</label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  name="newProjet"
                  value={form.newProjet}
                  onChange={handleProjetInput}
                  onKeyDown={e => { if (e.key === 'Enter') { handleAddProjet(e); } }}
                  disabled={!isEditing || isSaving}
                  className={`flex-1 px-4 py-3 border rounded-xl transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 ${
                    !isEditing 
                      ? 'border-slate-200 bg-slate-50 text-slate-600' 
                      : 'border-slate-300 bg-white text-slate-800'
                  }`}
                  placeholder="Ajouter un projet et appuyer sur Entrée ou ,"
                />
                <button 
                  type="button" 
                  onClick={handleAddProjet} 
                  disabled={!isEditing || isSaving || !form.newProjet.trim()} 
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {form.nomProjets.map((projet, idx) => (
                  <span key={idx} className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-xl text-sm flex items-center font-medium shadow-sm">
                    {projet}
                    {isEditing && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveProjet(projet)} 
                        className="ml-2 text-blue-800 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-white/50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Abréviation */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Abréviation</label>
              <input
                type="text"
                name="abreviation"
                value={form.abreviation}
                readOnly
                maxLength={20}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 cursor-not-allowed text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-colors"
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              {!isEditing ? (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(true)} 
                  className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </button>
              ) : (
                <>
                  <button 
                    type="button" 
                    onClick={() => { 
                      setIsEditing(false); 
                      resetForm();
                    }} 
                    className="px-8 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-semibold transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Enregistrer
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Section mot de passe */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl border border-white/20 backdrop-blur-sm p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Sécurité</h3>
              <p className="text-slate-600">Modifiez votre mot de passe pour sécuriser votre compte</p>
            </div>
            <button 
              type="button" 
              onClick={() => setShowPasswordModal(true)} 
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Changer mon mot de passe
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PasswordChangeModal 
        open={showPasswordModal} 
        onOpenChange={setShowPasswordModal} 
        onSubmit={handlePasswordModalSubmit} 
        loading={isChangingPassword} 
      />

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setPendingAction(null);
        }}
        onConfirm={() => {
          if (pendingAction === 'save') {
            executeSave();
          } else if (pendingAction === 'logo') {
            executeLogoUpdate();
          }
        }}
        title={pendingAction === 'save' ? 'Confirmer la modification' : 'Confirmer le changement de logo'}
        message={pendingAction === 'save' 
          ? 'Êtes-vous sûr de vouloir modifier vos informations de profil ?' 
          : 'Êtes-vous sûr de vouloir changer votre logo ?'
        }
        confirmText="Confirmer"
        cancelText="Annuler"
      />
    </div>
  );
}