import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, UploadCloud, DollarSign, Briefcase, Layers } from 'lucide-react';
import Input from '../../components/UI/Input';

export default function NewExpense() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation de soumission (Étape 3 du Workflow)
    navigate('/mes-notes');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Nouvelle note de frais</h1>
        <p className="text-slate-400 text-xs mt-1">Saisissez les détails de votre dépense et joignez votre justificatif.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Formulaire Principal (Prend 2 colonnes) */}
        <div className="lg:col-span-2 bg-muko-card border border-slate-800/80 rounded-2xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Date de la dépense" type="date" required />
            
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">Type de dépense</label>
              <select className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors cursor-pointer">
                <option value="restoration">Restauration</option>
                <option value="transport">Transport / Déplacement</option>
                <option value="hotel">Hébergement</option>
                <option value="supplies">Fournitures de bureau</option>
                <option value="fuel">Carburant</option>
              </select>
            </div>

            <Input label="Montant" type="number" step="0.01" placeholder="0.00" icon={DollarSign} required />

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">Devise</label>
              <select className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors cursor-pointer">
                <option value="BIF">Franc Burundais (BIF)</option>
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar ($)</option>
              </select>
            </div>

            <Input label="Projet concerné" type="text" placeholder="Ex: Déploiement Starlink Bwiza" icon={Briefcase} />
            <Input label="Centre de coût" type="text" placeholder="Ex: CC-R&D-02" icon={Layers} />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">Description / Motif</label>
            <textarea 
              rows="4" 
              placeholder="Expliquez brièvement le contexte de cette dépense professionnelle..."
              className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-4 border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors resize-none"
              required
            ></textarea>
          </div>
        </div>

        {/* Zone Téléversement Justificatif (Prend 1 colonne) */}
        <div className="space-y-6">
          <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">Justificatif</h3>
            
            <div className="border-2 border-dashed border-slate-800 hover:border-muko-orange/40 bg-[#0B131F]/40 rounded-2xl p-6 text-center transition-all group cursor-pointer relative aspect-square flex flex-col items-center justify-center">
              <input 
                type="file" 
                accept="image/png, image/jpeg, application/pdf" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="w-12 h-12 rounded-full bg-muko-orange/10 text-muko-orange flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud size={22} />
              </div>
              <p className="text-xs text-slate-300 font-medium mt-4">
                {file ? file.name : "Glissez ou cliquez pour ajouter"}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-2">Formats acceptés : PDF, JPG, PNG</p>
            </div>
          </div>

          {/* Boutons de Soumission */}
          <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/mes-notes')} className="flex-1 bg-[#1A263B] hover:bg-opacity-80 text-slate-300 text-xs font-semibold py-3.5 rounded-xl border border-slate-800 transition-all cursor-pointer">
              Annuler
            </button>
            <button type="submit" className="flex-1 bg-muko-orange hover:bg-opacity-90 text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-muko-orange/10 transition-all active:scale-[0.98] cursor-pointer">
              <Save size={14} /> Soumettre
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}