'use client';

import { useState } from 'react';
import { useToast } from './Toast';
import { Building, User, Mail, Lock, FolderKanban, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const PasswordField = ({ id, name, value, onChange, placeholder, label, showPassword, onTogglePassword }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> {label} *</span>
    </label>
    <div className="relative">
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        required
        value={value}
        onChange={onChange}
        className="modern-input pr-10"
        placeholder={placeholder}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        onClick={onTogglePassword}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  </div>
);

export default function AuthForm({ onLogin, onRegister, loading, mode }) {
  // Si mode est défini, on force le mode login/register, sinon on laisse le switch interne
  const [isLogin] = useState(mode ? mode === 'login' : true);
  const [step, setStep] = useState(0); // Pour la pagination
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    abreviation: '',
    nomInstitution: '',
    nomProjets: [],
    role: 'membre'
  });
  const [newProjet, setNewProjet] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProjet = (e) => {
    e.preventDefault();
    const projet = newProjet.trim();
    if (projet && !formData.nomProjets.includes(projet)) {
      setFormData(prev => ({ ...prev, nomProjets: [...prev.nomProjets, projet] }));
      setNewProjet('');
    }
  };

  const handleRemoveProjet = (projet) => {
    setFormData(prev => ({ ...prev, nomProjets: prev.nomProjets.filter(p => p !== projet) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      if (!formData.email || !formData.password) {
        showToast('Veuillez remplir tous les champs obligatoires', 'error');
        return;
      }
    } else {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.abreviation || !formData.nomInstitution) {
        showToast('Veuillez remplir tous les champs obligatoires', 'error');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast('Les mots de passe ne correspondent pas', 'error');
        return;
      }
      if (formData.password.length < 6) {
        showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
      }
    }
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await onLogin({
          email: formData.email,
          password: formData.password
        });
        showToast('Connexion réussie !', 'success');
      } else {
        await onRegister({
          email: formData.email,
          password: formData.password,
          abreviation: formData.abreviation,
          nomInstitution: formData.nomInstitution,
          nomProjet: formData.nomProjets.join(', '),
          role: 'membre'
        });
        showToast('Inscription réussie !', 'success');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      abreviation: '',
      nomInstitution: '',
      nomProjets: [],
      role: 'membre'
    });
    setNewProjet('');
  };

  // Validation des champs obligatoires par étape
  const isStepValid = () => {
    if (isLogin) return true;
    if (step === 0) {
      // Institution: nomInstitution et abreviation obligatoires
      return formData.nomInstitution.trim() && formData.abreviation.trim();
    }
    if (step === 1) {
      // Projets: pas de champ obligatoire
      return true;
    }
    if (step === 2) {
      // Compte: email, password, confirmPassword obligatoires
      return (
        formData.email.trim() &&
        formData.password.trim() &&
        formData.confirmPassword.trim()
      );
    }
    return true;
  };

  // Gestion des étapes pour l'inscription
  const steps = [
    {
      label: "Institution",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nomInstitution" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2"><Building className="w-4 h-4" /> Nom de l'institution *</span>
            </label>
            <input
              id="nomInstitution"
              name="nomInstitution"
              type="text"
              required
              value={formData.nomInstitution}
              onChange={handleInputChange}
              className="modern-input"
              placeholder="Nom de l'institution"
            />
          </div>
          <div>
            <label htmlFor="abreviation" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2"><User className="w-4 h-4" /> Abréviation *</span>
            </label>
            <input
              id="abreviation"
              name="abreviation"
              type="text"
              required
              value={formData.abreviation}
              onChange={handleInputChange}
              className="modern-input"
              placeholder="Abréviation (ex: JD)"
            />
          </div>
        </div>
      )
    },
    {
      label: "Projets",
      content: (
        <div>
          <label htmlFor="nomProjet" className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-2"><FolderKanban className="w-4 h-4" /> Projets rattachés</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="nomProjet"
              name="nomProjet"
              type="text"
              value={newProjet}
              onChange={e => setNewProjet(e.target.value)}
              className="modern-input"
              placeholder="Ajouter un projet et appuyer sur +"
            />
            <button type="button" onClick={handleAddProjet} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">+</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.nomProjets.map((projet, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center">
                {projet}
                <button type="button" onClick={() => handleRemoveProjet(projet)} className="ml-1 text-blue-800 hover:text-red-600">&times;</button>
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      label: "Compte",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email *</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="modern-input"
              placeholder="Email"
            />
          </div>
          <PasswordField
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Mot de passe"
            label="Mot de passe"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          <div className="md:col-span-2">
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirmer le mot de passe"
              label="Confirmer le mot de passe"
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
        </div>
      )
    }
  ];

  // Remplace tous les usages de isLogin par la valeur forcée si mode est défini
  const effectiveIsLogin = mode ? mode === 'login' : isLogin;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl p-8 relative">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-blue-50 mb-4">
            <svg className="h-8 w-8" style={{ color: 'rgb(0,70,144)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 leading-tight">
            <div>{effectiveIsLogin ? 'Connexion' : 'Inscription'}</div>
            <div className="text-lg">à</div>
            <div>Alliance-Agroforesterie</div>
          </h2>
          {/* Barre de progression pour l'inscription */}
          {!effectiveIsLogin && (
            <div className="flex items-center justify-center gap-2 mt-6 mb-2">
              {steps.map((s, idx) => (
                <div key={s.label} className={`h-2 w-2 md:w-8 rounded-full transition-all duration-300 ${idx <= step ? 'bg-blue-700' : 'bg-blue-200'} ${idx === step ? 'md:w-12' : ''}`}></div>
              ))}
            </div>
          )}
          <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
            <div className={`rounded-md shadow-sm flex flex-col gap-4 max-h-[60vh] overflow-y-auto`}>
              {effectiveIsLogin ? (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email *</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="modern-input"
                      placeholder="Email"
                    />
                  </div>
                  <PasswordField
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Mot de passe"
                    label="Mot de passe"
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                </>
              ) : (
                steps[step].content
              )}
            </div>
            {/* Pagination boutons pour inscription */}
            {!effectiveIsLogin && (
              <div className="flex justify-between items-center mt-2">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${step === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                  onClick={() => setStep(s => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  <ArrowLeft className="w-4 h-4" /> Précédent
                </button>
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                    disabled={!isStepValid()}
                  >
                    Suivant <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="group relative flex items-center gap-2 justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
                  >
                    {isSubmitting || loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Inscription...
                      </span>
                    ) : (
                      'Créer un compte'
                    )}
                  </button>
                )}
              </div>
            )}
            {/* Bouton pour connexion */}
            {effectiveIsLogin && (
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
                >
                  {isSubmitting || loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Connexion...
                    </span>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </div>
            )}
          </form>
          {/* Lien bas de formulaire pour changer de mode (toujours affiché) */}
          <div className="text-center mt-4">
            {effectiveIsLogin ? (
              <a href="/register" className="text-blue-700 hover:underline text-sm font-medium">
                Pas encore de compte ? S'inscrire
              </a>
            ) : (
              <a href="/login" className="text-blue-700 hover:underline text-sm font-medium">
                Déjà inscrit ? Se connecter
              </a>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .modern-input {
          @apply appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-base transition-all duration-200 shadow-sm;
        }
      `}</style>
    </div>
  );
}