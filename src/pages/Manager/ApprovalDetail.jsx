import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, FileText, Loader2, AlertTriangle, User, Calendar, DollarSign, Briefcase, MessageSquare } from 'lucide-react';
import apiClient from '../../services/api';
import { extractData } from '../../utils/dataHelpers';

export default function ApprovalDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const { data } = await apiClient.get('/expenses');
        // Extraire les données correctement avec extractData
        const expenses = extractData(data);
        
        // Vérifier que c'est un tableau
        if (!Array.isArray(expenses)) {
          console.error('Les dépenses ne sont pas un tableau:', expenses);
          setError("Format de données invalide.");
          setLoading(false);
          return;
        }

        const found = expenses.find(e => e._id === id);
        if (found) {
          setExpense(found);
        } else {
          setError("Dépense introuvable");
        }
      } catch (err) {
        console.error('Erreur fetchExpense:', err);
        setError(err.response?.data?.message || "Impossible de charger les détails");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  const handleDecision = async (decision) => {
    if (!expense) return;
    if (decision === 'refused' && !comment.trim()) {
      alert('Veuillez ajouter un commentaire pour justifier le refus.');
      return;
    }
    
    setProcessing(true);
    try {
      const status = decision === 'approved' ? 'Approuvée' : 'Rejeté';
      await apiClient.put(`/expenses/${expense._id}/status`, { 
        status, 
        comment: comment || 'Aucun commentaire'
      });
      navigate('/validation/attente');
    } catch (err) {
      console.error('Erreur handleDecision:', err);
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setProcessing(false);
    }
  };

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

  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={14} /> Retour à la liste
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Descriptif technique (7 colonnes) */}
        <div className="lg:col-span-7 bg-[#111C2E] border border-slate-800/80 rounded-2xl p-8 space-y-6">
          <div className="border-b border-slate-800/60 pb-4">
            <span className="text-[10px] font-mono text-[#FF6B2C] uppercase tracking-wider font-bold">
              #{expense._id?.substring(expense._id.length - 8).toUpperCase() || 'N/A'}
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">{expense.category || 'Non catégorisé'}</h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <User size={12} /> Soumis par <span className="text-white font-medium">{expense.userId?.name || 'Inconnu'}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-[#0B131F]/40 p-3 rounded-xl border border-slate-800/60">
              <p className="text-slate-500 mb-0.5 flex items-center gap-1"><Calendar size={12} /> Date</p>
              <p className="text-white font-medium">
                {expense.date ? new Date(expense.date).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>
            <div className="bg-[#0B131F]/40 p-3 rounded-xl border border-slate-800/60">
              <p className="text-slate-500 mb-0.5 flex items-center gap-1"><Briefcase size={12} /> Projet</p>
              <p className="text-white font-medium">{expense.project || "Général"}</p>
            </div>
            <div className="bg-[#0B131F]/40 p-3 rounded-xl border border-slate-800/60">
              <p className="text-slate-500 mb-0.5">Catégorie</p>
              <p className="text-white font-medium">{expense.category || 'Non catégorisé'}</p>
            </div>
            <div className="bg-[#0B131F]/40 p-3 rounded-xl border border-slate-800/60">
              <p className="text-slate-500 mb-0.5 flex items-center gap-1"><DollarSign size={12} /> Montant</p>
              <p className="text-white font-mono font-bold">
                {(expense.amount || 0).toFixed(2)} {expense.currency || '€'}
              </p>
            </div>
          </div>

          {expense.description && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <MessageSquare size={12} /> Justification
              </label>
              <p className="text-xs text-slate-300 bg-[#0B131F]/40 p-4 rounded-xl border border-slate-800/60 leading-relaxed">
                {expense.description}
              </p>
            </div>
          )}

          {/* Historique des commentaires */}
          {expense.history && Array.isArray(expense.history) && expense.history.length > 0 && (
            <div className="pt-4 border-t border-slate-800/40">
              <h4 className="text-xs font-semibold text-slate-400 mb-3">Historique</h4>
              <div className="space-y-2">
                {expense.history.map((h, idx) => (
                  <div key={idx} className="text-xs bg-[#0B131F]/30 p-3 rounded-lg border border-slate-800/40">
                    <span className={`font-semibold ${
                      h.status === 'Approuvée' ? 'text-green-400' :
                      h.status === 'Rejeté' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {h.status || 'En attente'}
                    </span>
                    <span className="text-slate-500"> - {h.comment || 'Aucun commentaire'}</span>
                    <span className="text-slate-600 ml-2">
                      {h.updatedAt ? new Date(h.updatedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panneau de décision (5 colonnes) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Aperçu justificatif */}
          {expense.receiptUrl && (
            <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A263B] text-[#FF6B2C] flex items-center justify-center border border-slate-800">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Justificatif</h4>
                  <p className="text-[10px] font-mono text-slate-500">PDF / Image</p>
                </div>
              </div>
              <button className="text-[11px] font-bold text-[#FF6B2C] hover:underline cursor-pointer">
                Voir
              </button>
            </div>
          )}

          {/* Formulaire de validation */}
          <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">
              Zone d'arbitrage
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <MessageSquare size={12} /> Commentaire (obligatoire pour refus)
              </label>
              <textarea
                rows="3"
                placeholder="Ajoutez un commentaire pour justifier votre décision..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3 border border-slate-800 outline-none focus:border-[#FF6B2C]/50 transition-colors resize-none"
              />
              <p className="text-[10px] text-slate-500">
                {comment.length}/500 caractères
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDecision('refused')}
                disabled={processing}
                className="bg-red-500/10 hover:bg-red-500 hover:text-white disabled:opacity-50 border border-red-500/20 text-red-400 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <X size={14} /> Refuser
              </button>
              <button
                onClick={() => handleDecision('approved')}
                disabled={processing}
                className="bg-green-500/10 hover:bg-green-500 hover:text-white disabled:opacity-50 border border-green-500/20 text-green-400 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Check size={14} /> Approuver
              </button>
            </div>

            {processing && (
              <div className="text-center text-xs text-slate-400">
                <Loader2 className="inline-block animate-spin mr-2" size={14} />
                Traitement en cours...
              </div>
            )}
          </div>

          {/* Informations complémentaires */}
          <div className="bg-[#1A263B]/30 border border-slate-800/60 rounded-xl p-4">
            <p className="text-[10px] text-slate-500 text-center">
              En approuvant, vous certifiez que cette dépense est conforme aux politiques internes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}