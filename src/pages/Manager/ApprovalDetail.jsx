import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, FileText} from 'lucide-react';

export default function ApprovalDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comment, setComment] = useState('');

  const handleDecision = (status) => {
    // Étape 4 du workflow : redirection après arbitrage
    navigate('/validation/attente');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={14} /> Retour à la liste
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Descriptif technique de la note (7 colonnes) */}
        <div className="lg:col-span-7 bg-muko-card border border-slate-800/80 rounded-2xl p-8 space-y-6">
          <div className="border-b border-slate-800/60 pb-4">
            <span className="text-[10px] font-mono text-muko-orange uppercase tracking-wider font-bold">{id || "NDF-891"}</span>
            <h2 className="text-lg font-bold text-white mt-0.5">Frais de déplacement interurbain</h2>
            <p className="text-xs text-slate-400 mt-1">Soumis par <span className="text-white font-medium">Alain Ndikumana</span></p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-[#0B131F]/40 p-3 rounded-xl border border-slate-800/60"><p className="text-slate-500 mb-0.5">Date</p><p className="text-white font-medium">02 Juin 2026</p></div>
            <div className="bg-[#0B131F]/40 p-3 rounded-xl border border-slate-800/60"><p className="text-slate-500 mb-0.5">Projet</p><p className="text-white font-medium">TenderFlow Project</p></div>
            <div className="bg-[#0B131F]/40 p-3 rounded-xl border border-slate-800/60"><p className="text-slate-500 mb-0.5">Centre de Coût</p><p className="text-white font-mono font-medium">CC-PROD-01</p></div>
            <div className="bg-[#0B131F]/40 p-3 rounded-xl border border-slate-800/60"><p className="text-slate-500 mb-0.5">Montant Soumis</p><p className="text-white font-mono font-bold">120.00 €</p></div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Justification de l'employé</label>
            <p className="text-xs text-slate-300 bg-[#0B131F]/40 p-4 rounded-xl border border-slate-800/60 leading-relaxed">
              Achat de carburant pour la camionnette de l'équipe technique pour le transport du matériel réseau d'infrastructure.
            </p>
          </div>
        </div>

        {/* Panneau de décision & Justificatif de droite (5 colonnes) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Faux aperçu du ticket */}
          <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1A263B] text-muko-orange flex items-center justify-center border border-slate-800"><FileText size={16} /></div>
              <div><h4 className="text-xs font-bold text-white">Recu_Carburant.pdf</h4><p className="text-[10px] font-mono text-slate-500">420 KB</p></div>
            </div>
            <button className="text-[11px] font-bold text-muko-orange hover:underline cursor-pointer">Voir la pièce</button>
          </div>

          {/* Formulaire de validation */}
          <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">Zone d'arbitrage</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Note ou commentaire de décision</label>
              <textarea 
                rows="3" 
                placeholder="Obligatoire en cas de refus ou de demande de correction..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3 border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleDecision('refused')}
                className="bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <X size={14} /> Refuser
              </button>
              <button 
                onClick={() => handleDecision('approved')}
                className="bg-green-500/10 hover:bg-green-500 hover:text-white border border-green-500/20 text-green-400 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Check size={14} /> Approuver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}