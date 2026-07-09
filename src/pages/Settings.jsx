import { useState, useEffect } from 'react';
import { User, Lock, Bell, Shield, Save, CheckCircle, Loader2, AlertTriangle, Mail, Briefcase, LogOut } from 'lucide-react';
import Input from '../components/UI/Input';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import { extractData } from '../utils/dataHelpers';

export default function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profil');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // État du profil
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    team: '',
    role: ''
  });

  // État du mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // État des notifications
  const [notifications, setNotifications] = useState({
    weeklyReports: true,
    thresholdAlerts: true,
    refundRequests: true,
    expenseApprovals: false
  });

  useEffect(() => {
    if (user) {
      // Récupérer les données complètes de l'utilisateur depuis l'API
      const fetchUserData = async () => {
        try {
          const { data } = await apiClient.get(`/users/${user._id}`);
          const userData = extractData(data);
          setProfile({
            name: userData.name || user.name || '',
            email: userData.email || user.email || '',
            team: userData.team || 'Non assigné',
            role: userData.role || user.role || 'Employe'
          });
        } catch (err) {
          console.error('Erreur chargement profil:', err);
          // Fallback sur les données du contexte
          setProfile({
            name: user.name || '',
            email: user.email || '',
            team: user.team || 'Non assigné',
            role: user.role || 'Employe'
          });
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put(`/users/${user._id}`, {
        name: profile.name,
        email: profile.email,
        team: profile.team
      });

      const updatedUserData = extractData(response.data);
      
      // Mettre à jour le contexte
      const updatedUser = { 
        ...user, 
        name: updatedUserData.name || profile.name,
        email: updatedUserData.email || profile.email,
        team: updatedUserData.team || profile.team
      };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      // Mettre à jour le state
      setProfile({
        ...profile,
        name: updatedUserData.name || profile.name,
        email: updatedUserData.email || profile.email,
        team: updatedUserData.team || profile.team
      });

      setToastMessage('Profil mis à jour avec succès !');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      setError(err.response?.data?.message || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!passwordData.currentPassword) {
      setError('Veuillez entrer votre mot de passe actuel.');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      setLoading(false);
      return;
    }

    try {
      // Appel API pour changer le mot de passe
      await apiClient.put(`/users/${user._id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setToastMessage('Mot de passe mis à jour avec succès !');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Erreur changement mot de passe:', err);
      setError(err.response?.data?.message || "Erreur lors du changement de mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sauvegarder les préférences
      await apiClient.put(`/users/${user._id}/notifications`, notifications);
      
      setToastMessage('Préférences enregistrées !');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Erreur sauvegarde préférences:', err);
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profil', name: 'Mon Profil', icon: User },
    { id: 'securite', name: 'Sécurité', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg shadow-green-500/20 flex items-center gap-3 border border-green-400/20 z-50 animate-bounce">
          <CheckCircle size={18} />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres</h1>
        <p className="text-slate-400 text-xs mt-1">Gérez la configuration de votre compte.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Navigation */}
        <div className="w-full lg:w-64 bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4 space-y-1 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide uppercase font-mono transition-all duration-150 cursor-pointer
                  ${activeTab === tab.id 
                    ? 'bg-[#FF6B2C] text-white shadow-lg shadow-[#FF6B2C]/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A263B]/50'}`}
              >
                <Icon size={14} />
                {tab.name}
              </button>
            );
          })}
          <div className="pt-4 border-t border-slate-800/60 mt-4">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 w-full bg-[#111C2E] border border-slate-800/80 rounded-2xl p-8">
          
          {activeTab === 'profil' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="border-b border-slate-800/60 pb-4">
                <h2 className="text-base font-bold text-white">Informations Générales</h2>
                <p className="text-xs text-slate-500 mt-0.5">Vos informations personnelles.</p>
              </div>

              {error && (
                <div className="text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20 flex items-center gap-2">
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1A263B] border border-slate-700/60 flex items-center justify-center font-black text-xl text-[#FF6B2C] font-sans">
                  {profile.name ? profile.name.substring(0, 2).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{profile.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{profile.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Nom complet"
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                />
                <Input
                  label="Équipe"
                  type="text"
                  value={profile.team}
                  onChange={(e) => setProfile({ ...profile, team: e.target.value })}
                />
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">Rôle</label>
                  <div className="bg-[#1A263B] text-slate-400 text-xs rounded-xl p-3.5 border border-slate-800 cursor-not-allowed">
                    {profile.role}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-[#FF6B2C] hover:bg-opacity-90 disabled:opacity-50 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {loading ? "Sauvegarde..." : "Enregistrer"}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'securite' && (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="border-b border-slate-800/60 pb-4">
                <h2 className="text-base font-bold text-white">Sécurité</h2>
                <p className="text-xs text-slate-500 mt-0.5">Mettez à jour votre mot de passe.</p>
              </div>

              {error && (
                <div className="text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20 flex items-center gap-2">
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              <div className="space-y-4 max-w-md">
                <Input
                  label="Mot de passe actuel"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
                <Input
                  label="Nouveau mot de passe"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
                <Input
                  label="Confirmer"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="bg-[#1A263B]/40 border border-slate-800 rounded-xl p-4 flex items-start gap-3 mt-6">
                <Shield size={18} className="text-[#FF6B2C] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Authentification à deux facteurs (2FA)</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Ajoutez une couche de sécurité supplémentaire à votre compte.
                  </p>
                  <button type="button" className="text-xs font-mono text-[#FF6B2C] hover:underline pt-1 block">
                    Activer le 2FA →
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-[#FF6B2C] hover:bg-opacity-90 disabled:opacity-50 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {loading ? "Mise à jour..." : "Mettre à jour"}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationsUpdate} className="space-y-6">
              <div className="border-b border-slate-800/60 pb-4">
                <h2 className="text-base font-bold text-white">Préférences</h2>
                <p className="text-xs text-slate-500 mt-0.5">Choisissez comment vous souhaitez être notifié.</p>
              </div>

              {error && (
                <div className="text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20 flex items-center gap-2">
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              <div className="space-y-4">
                {[
                  { id: 'weeklyReports', title: 'Rapports hebdomadaires', desc: 'Synthèse des dépenses par email chaque lundi.' },
                  { id: 'thresholdAlerts', title: 'Alertes de seuils', desc: 'Notifié quand un département atteint 85% du budget.' },
                  { id: 'refundRequests', title: 'Demandes de remboursement', desc: 'Notification push pour les nouveaux reçus.' },
                  { id: 'expenseApprovals', title: 'Approbations', desc: 'Notification quand une note est approuvée ou rejetée.' },
                ].map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4 py-2">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={notifications[item.id] || false}
                        onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#1A263B] border border-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B2C] peer-checked:border-transparent"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-[#FF6B2C] hover:bg-opacity-90 disabled:opacity-50 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}