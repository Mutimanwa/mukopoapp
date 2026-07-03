import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, CheckCircle2, Circle, Loader2, AlertTriangle, XCircle } from 'lucide-react';
import apiClient from '../../services/api';

const STATUS_STEPS = {
  'En attente': { step: 1, label: 'En attente de validation' },
  'Approuvée': { step: 2, label: 'Approuvée par le Manager' },
  'Rejeté': { step: 2, label: 'Rejetée par le Manager' },
  'Payé': { step: 3, label: 'Remboursement émis' },
};

export default function ExpenseDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const { data } = await apiClient.get('/expenses/myexpenses');
        const found = data.find(e => e._id === id);
        if (found) {
          setExpense(found);
        } else {
          setError("Note de frais introuvable.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des détails.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
      <Loader2 className="animate-spin" size={20} /> Chargement...
    </div>
  );

  if (error || !expense) return (
    <div className="flex items-center justify-center h-64 text-red-400 gap-2">
      <AlertTriangle size={20} /> {error || "Dépense introuvable"}
    </div>
  );

  const statusInfo = STATUS_STEPS[expense.status] || STATUS_STEPS['En attente'];
  const isRejected = expense.status === 'Rejeté';
  const latestComment = expense.history?.length > 0 ? expense.history[expense.history.length - 1].comment : null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/mes-notes')} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
          <ArrowLeft size={14} /> Retour aux notes
        </button>
        {expense.status === 'En attente' && (
          <button onClick={() => navigate(`/modifier-note/${expense._id}`)} className="bg-[#1A263B] border border-slate-800 hover:text-white text-slate-300 text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors cursor-pointer">
            <Edit3 size={14} className="text-muko-orange" /> Modifier la note
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fiche technique */}
        <div className="lg:col-span-2 bg-muko-card border border-slate-800/80 rounded-2xl p-8 space-y-6">
          <div className="flex justify-between items-start border-b border-slate-800/60 pb-4">
            <div>
              <span className="text-[10px] font-mono text-muko-orange uppercase font-bold tracking-widest">{expense._id.substring(expense._id.length - 8).toUpperCase()}</span>
              <h2 className="text-xl font-bold text-white mt-1">{expense.category}</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-medium border ${expense.status === 'Approuvée' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                expense.status === 'Rejeté' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  expense.status === 'Payé' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
              • {expense.status || 'En attente'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs">
            <div><p className="text-slate-500 mb-1">Date</p><p className="text-white font-medium">{new Date(expense.date).toLocaleDateString('fr-FR')}</p></div>
            <div><p className="text-slate-500 mb-1">Catégorie</p><p className="text-white font-medium">{expense.category}</p></div>
            <div><p className="text-slate-500 mb-1">Projet</p><p className="text-white font-medium">{expense.project || 'Général'}</p></div>
            <div><p className="text-slate-500 mb-1">Centre de coût</p><p className="text-white font-mono font-medium">{expense.costCenter || 'N/A'}</p></div>
          </div>

          {expense.description && (
            <div className="pt-4 border-t border-slate-800/40">
              <p className="text-xs text-slate-500 mb-2">Description</p>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#0B131F]/40 p-4 rounded-xl border border-slate-800/60">{expense.description}</p>
            </div>
          )}

          <div className="bg-[#1A263B]/30 border border-slate-800 p-4 rounded-xl flex items-baseline gap-2">
            <span className="text-xs text-slate-400">Montant total demandé :</span>
            <span className="text-xl font-black font-mono text-white">{expense.amount} {expense.currency || '€'}</span>
          </div>
        </div>

        {/* Workflow & Suivi de validation (Timeline) */}
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">Suivi du Workflow</h3>

          <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {/* Étape 1 – Soumission */}
            <div className="flex gap-4 relative z-10">
              <CheckCircle2 size={24} className="text-green-500 bg-[#111C2E] rounded-full shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Créée & Soumise</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{new Date(expense.createdAt || expense.date).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {/* Étape 2 – Validation Manager */}
            <div className={`flex gap-4 relative z-10 ${statusInfo.step < 2 ? 'opacity-50' : ''}`}>
              {isRejected ? (
                <XCircle size={24} className="text-red-500 bg-[#111C2E] rounded-full shrink-0" />
              ) : statusInfo.step >= 2 ? (
                <CheckCircle2 size={24} className="text-green-500 bg-[#111C2E] rounded-full shrink-0" />
              ) : (
                <Circle size={24} className="text-amber-500 bg-[#111C2E] fill-amber-500/10 rounded-full shrink-0" />
              )}
              <div>
                <h4 className="text-xs font-bold text-white">Validation Responsable</h4>
                {latestComment && (
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed bg-[#0B131F]/60 p-2 rounded border border-slate-800/60">{latestComment}</p>
                )}
                {!latestComment && <p className="text-[10px] text-slate-500 mt-0.5">{statusInfo.step < 2 ? 'En attente' : statusInfo.label}</p>}
              </div>
            </div>

            {/* Étape 3 – Contrôle comptable */}
            <div className={`flex gap-4 relative z-10 ${statusInfo.step < 3 ? 'opacity-40' : ''}`}>
              {expense.status === 'Payé' ? (
                <CheckCircle2 size={24} className="text-green-500 bg-[#111C2E] rounded-full shrink-0" />
              ) : (
                <Circle size={24} className="text-slate-700 bg-[#111C2E] rounded-full shrink-0" />
              )}
              <div>
                <h4 className="text-xs font-bold text-white">Contrôle Comptable</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{expense.status === 'Payé' ? 'Remboursé ✅' : 'Étape suivante'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}