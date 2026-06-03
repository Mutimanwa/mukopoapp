import { useNavigate, useParams } from 'react-router-dom';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import Input from '../../components/UI/Input';

export default function EditExpense() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleUpdate = (e) => {
    e.preventDefault();
    navigate('/mes-notes');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
          <ArrowLeft size={14} /> Annuler les modifications
        </button>
        <button type="button" className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/10 cursor-pointer">
          <Trash2 size={14} /> Supprimer la note
        </button>
      </div>

      <form onSubmit={handleUpdate} className="bg-muko-card border border-slate-800/80 rounded-2xl p-8 space-y-6">
        <div className="border-b border-slate-800/60 pb-4">
          <h2 className="text-base font-bold text-white">Modifier la note de frais</h2>
          <p className="text-xs text-slate-500 mt-0.5">Identifiant de dossier : <span className="text-muko-orange font-mono font-bold">{id || "NDF-891"}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Date" type="date" defaultValue="2026-05-28" required />
          <Input label="Marchand / Bénéficiaire" type="text" defaultValue="Hôtel source du Nil" required />
          <Input label="Montant" type="number" step="0.01" defaultValue="450.00" required />
          <Input label="Projet" type="text" defaultValue="Formation RE-START" />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-2">Description</label>
          <textarea 
            rows="4" 
            defaultValue="Nuitées lors du séminaire de lancement de la campagne de formation multimédia."
            className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-4 border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors resize-none"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800/60">
          <button type="submit" className="bg-muko-orange hover:bg-opacity-90 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-muko-orange/10 transition-all active:scale-[0.98] cursor-pointer">
            <Save size={14} /> Enregistrer les changements
          </button>
        </div>
      </form>
    </div>
  );
}