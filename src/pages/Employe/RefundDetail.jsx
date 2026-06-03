import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, Calendar, ShieldCheck, Printer } from 'lucide-react';

export default function RefundDetail() {
  const navigate = useNavigate();

  const refund = {
    ref: "REM-2026-9044",
    date: "02 Juin 2026",
    amount: "1,450.00 €",
    method: "Virement Bancaire (SEPA)",
    bankRef: "TR-9023411-MUKO",
    status: "Transféré",
    itemsCount: 3
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 mb-4 cursor-pointer">
          <ArrowLeft size={14} /> Retour
        </button>
        <h1 className="text-2xl font-bold text-white tracking-tight">Détail du remboursement</h1>
      </div>

      <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-8 max-w-2xl space-y-6">
        
        {/* En-tête ticket */}
        <div className="flex justify-between items-center border-b border-slate-800/60 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/10">
              <Landmark size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Référence Interne</span>
              <h3 className="text-sm font-bold text-white font-mono mt-0.5">{refund.ref}</h3>
            </div>
          </div>
          <button className="p-2.5 bg-[#1A263B] hover:text-white text-slate-400 border border-slate-800 rounded-xl transition-colors" title="Imprimer le reçu de paiement">
            <Printer size={15} />
          </button>
        </div>

        {/* Détails financiers */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Statut de la transaction</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/15">
              ● {refund.status}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Date d'émission</span>
            <span className="text-white font-medium">{refund.date}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Mode de paiement</span>
            <span className="text-white font-medium">{refund.method}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Référence bancaire</span>
            <span className="text-white font-mono font-medium">{refund.bankRef}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Nombre de notes groupées</span>
            <span className="text-white font-medium">{refund.itemsCount} notes</span>
          </div>
        </div>

        {/* Bloc montant final */}
        <div className="bg-[#0B131F]/60 border border-slate-800 p-6 rounded-xl flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Montant crédité</span>
            <p className="text-xs text-slate-400">Net versé sur votre compte</p>
          </div>
          <span className="text-2xl font-black font-mono text-muko-orange">{refund.amount}</span>
        </div>

      </div>
    </div>
  );
}