import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Shield } from 'lucide-react';
import Input from '../../components/UI/Input';

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Présent uniquement si modification

  const handleSave = (e) => {
    e.preventDefault();
    navigate('/admin/utilisateurs');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={14} /> Retour à l'annuaire
      </button>

      <form onSubmit={handleSave} className="bg-muko-card border border-slate-800/80 rounded-2xl p-8 max-w-2xl space-y-6">
        <div className="border-b border-slate-800/60 pb-4">
          <h2 className="text-base font-bold text-white">{id ? "Modifier le compte utilisateur" : "Créer un nouveau profil"}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Assurez-vous de l'exactitude des informations d'identification d'entreprise.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label="Nom complet" type="text" placeholder="Ex: Safi Kibasomba" required />
          <Input label="Adresse Email Pro" type="email" placeholder="nom.p@company.com" required />
          
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">Rôle Plateforme</label>
            <select className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-muko-orange/50 cursor-pointer">
              <option value="employee">Employé (Soumission de frais)</option>
              <option value="manager">Manager / Responsable (Approbation)</option>
              <option value="finance">Comptable / Service Financier</option>
              <option value="admin">Administrateur Système</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">Département Affecté</label>
            <select className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-muko-orange/50 cursor-pointer">
              <option value="tech">Direction Technique</option>
              <option value="marketing">Marketing & Événementiel</option>
              <option value="ops">Opérations & Logistique</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800/60">
          <button type="submit" className="bg-muko-orange hover:bg-opacity-90 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-muko-orange/10 transition-all active:scale-[0.98] cursor-pointer">
            <Save size={14} /> Sauvegarder la fiche
          </button>
        </div>
      </form>
    </div>
  );
}