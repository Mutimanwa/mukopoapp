import { useState } from 'react';
import { User, Lock, Bell, Shield, Save, CheckCircle } from 'lucide-react';
import Input from '../components/UI/Input';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profil');
  const [showToast, setShowToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Masquer la notification après 3 secondes
  };

  const tabs = [
    { id: 'profil', name: 'Mon Profil', icon: User },
    { id: 'securite', name: 'Sécurité & Accès', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* TOAST NOTIFICATION DE SUCCÈS */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-3 border border-emerald-400/20 z-50 animate-bounce">
          <CheckCircle size={18} />
          <span className="text-xs font-semibold">Paramètres enregistrés avec succès !</span>
        </div>
      )}

      {/* EN-TÊTE */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres</h1>
        <p className="text-slate-400 text-xs mt-1">Gérez la configuration de votre compte et vos préférences système.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* BARRE DE NAVIGATION INTERNE (Gauche) */}
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
        </div>

        {/* CONTENU DE L'ONGLET ACTIF (Droite) */}
        <div className="flex-1 w-full bg-[#111C2E] border border-slate-800/80 rounded-2xl p-8">
          
          {activeTab === 'profil' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="border-b border-slate-800/60 pb-4">
                <h2 className="text-base font-bold text-white">Informations Générales</h2>
                <p className="text-xs text-slate-500 mt-0.5">Ces informations seront visibles sur vos reçus et rapports de frais.</p>
              </div>

              {/* Zone d'Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1A263B] border border-slate-700/60 flex items-center justify-center font-black text-xl text-[#FF6B2C] font-sans">
                  SK
                </div>
                <div>
                  <button type="button" className="bg-[#1A263B] hover:bg-opacity-80 border border-slate-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all cursor-pointer">
                    Changer la photo
                  </button>
                  <p className="text-[10px] text-slate-500 mt-1.5 font-mono">JPG, PNG ou GIF. Max 2MB.</p>
                </div>
              </div>

              {/* Formulaire Grid sur 2 colonnes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Prénom" type="text" defaultValue="Safi" required />
                <Input label="Nom" type="text" defaultValue="Kibasomba" required />
                <Input label="Adresse Email" type="email" defaultValue="safi.k@entreprise.com" required />
                <Input label="Téléphone" type="text" placeholder="+257 ...." />
                <Input label="Entreprise" type="text" defaultValue="MUKOPO INC." disabled />
                <Input label="Rôle Système" type="text" defaultValue="Administrateur Principal" disabled />
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <button type="submit" className="bg-[#FF6B2C] hover:bg-opacity-90 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all active:scale-[0.98] cursor-pointer">
                  <Save size={14} /> Sauvegarder les modifications
                </button>
              </div>
            </form>
          )}

          {activeTab === 'securite' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="border-b border-slate-800/60 pb-4">
                <h2 className="text-base font-bold text-white">Sécurité du Compte</h2>
                <p className="text-xs text-slate-500 mt-0.5">Mettez à jour votre mot de passe pour maintenir votre compte sécurisé.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <Input label="Mot de passe actuel" type="password" placeholder="••••••••" required />
                <Input label="Nouveau mot de passe" type="password" placeholder="••••••••" required />
                <Input label="Confirmer le nouveau mot de passe" type="password" placeholder="••••••••" required />
              </div>

              {/* Double Facteur (2FA) Stub Style */}
              <div className="bg-[#1A263B]/40 border border-slate-800 rounded-xl p-4 flex items-start gap-3 mt-6">
                <Shield size={18} className="text-[#FF6B2C] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Authentification à deux facteurs (2FA)</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Ajoutez une couche de sécurité supplémentaire à votre compte en exigeant un code de validation à chaque connexion.
                  </p>
                  <button type="button" className="text-xs font-mono text-[#FF6B2C] hover:underline pt-1 block">
                    Activer le 2FA →
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <button type="submit" className="bg-[#FF6B2C] hover:bg-opacity-90 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all active:scale-[0.98] cursor-pointer">
                  <Save size={14} /> Mettre à jour le mot de passe
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="border-b border-slate-800/60 pb-4">
                <h2 className="text-base font-bold text-white">Préférences d'Alerte</h2>
                <p className="text-xs text-slate-500 mt-0.5">Choisissez comment et quand vous souhaitez être notifié.</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Rapports hebdomadaires', desc: 'Recevoir une synthèse de toutes les dépenses par email chaque lundi.' },
                  { title: 'Alertes de seuils', desc: "Être notifié immédiatement lorsqu'un département atteint 85% de son budget." },
                  { title: 'Demandes de remboursement', desc: "Recevoir une notification push lorsqu'un employé soumet un nouveau reçu." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 py-2">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    {/* Switch Toggle Custom Tailwind */}
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#1A263B] border border-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6B2C] peer-checked:border-transparent"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <button type="submit" className="bg-[#FF6B2C] hover:bg-opacity-90 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all active:scale-[0.98] cursor-pointer">
                  <Save size={14} /> Enregistrer les préférences
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}