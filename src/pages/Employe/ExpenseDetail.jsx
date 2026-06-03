import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3,  CheckCircle2, Circle } from 'lucide-react';

export default function ExpenseDetail() {
  const navigate = useNavigate();

  // Simulation d'une note de frais soumise
  const expense = {
    id: "NDF-2026-891",
    date: '28 Mai 2026',
    merchant: 'Hôtel source du Nil',
    category: 'Hébergement',
    amount: '450.00 €',
    project: 'Formation RE-START',
    costCenter: 'CC-MARKETING',
    description: 'Nuitées lors du séminaire de lancement de la campagne de formation multimédia.',
    status: 'En attente',
    comment: 'En attente de la signature finale du responsable de département.'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/mes-notes')} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
          <ArrowLeft size={14} /> Retour aux notes
        </button>
        <button onClick={() => navigate(`/modifier-note/${expense.id}`)} className="bg-[#1A263B] border border-slate-800 hover:text-white text-slate-300 text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors cursor-pointer">
          <Edit3 size={14} className="text-muko-orange" /> Modifier la note
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fiche technique */}
        <div className="lg:col-span-2 bg-muko-card border border-slate-800/80 rounded-2xl p-8 space-y-6">
          <div className="flex justify-between items-start border-b border-slate-800/60 pb-4">
            <div>
              <span className="text-[10px] font-mono text-muko-orange uppercase font-bold tracking-widest">{expense.id}</span>
              <h2 className="text-xl font-bold text-white mt-1">{expense.merchant}</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-medium border bg-amber-500/10 text-amber-400 border-amber-500/20">
              • {expense.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs">
            <div><p className="text-slate-500 mb-1">Date</p><p className="text-white font-medium">{expense.date}</p></div>
            <div><p className="text-slate-500 mb-1">Catégorie</p><p className="text-white font-medium">{expense.category}</p></div>
            <div><p className="text-slate-500 mb-1">Projet</p><p className="text-white font-medium">{expense.project}</p></div>
            <div><p className="text-slate-500 mb-1">Centre de coût</p><p className="text-white font-mono font-medium">{expense.costCenter}</p></div>
          </div>

          <div className="pt-4 border-t border-slate-800/40">
            <p className="text-xs text-slate-500 mb-2">Description</p>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#0B131F]/40 p-4 rounded-xl border border-slate-800/60">{expense.description}</p>
          </div>

          <div className="bg-[#1A263B]/30 border border-slate-800 p-4 rounded-xl flex items-baseline gap-2">
            <span className="text-xs text-slate-400">Montant total demandé :</span>
            <span className="text-xl font-black font-mono text-white">{expense.amount}</span>
          </div>
        </div>

        {/* Workflow & Suivi de validation (Timeline) */}
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">Suivi du Workflow</h3>
          
          <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {/* Étape 1 */}
            <div className="flex gap-4 relative z-10">
              <CheckCircle2 size={24} className="text-green-500 bg-[#111C2E] rounded-full shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Créée & Soumise</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Par Safi Kibasomba le 28 Mai</p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="flex gap-4 relative z-10">
              <Circle size={24} className="text-amber-500 bg-[#111C2E] fill-amber-500/10 rounded-full shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Validation Responsable</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed bg-[#0B131F]/60 p-2 rounded border border-slate-800/60">{expense.comment}</p>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="flex gap-4 relative z-10 opacity-40">
              <Circle size={24} className="text-slate-700 bg-[#111C2E] rounded-full shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Contrôle Comptable</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Étape suivante</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}