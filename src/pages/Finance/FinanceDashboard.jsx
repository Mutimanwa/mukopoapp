import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, AlertCircle, CheckCircle2, BarChart3, ArrowRight } from 'lucide-react';

export default function FinanceDashboard() {
  const navigate = useNavigate();

  const financeStats = [
    { label: "À rembourser (Approuvé)", total: "4,120.00 €", count: "18 ordres", icon: Landmark, color: "text-muko-orange bg-muko-orange/10 border-muko-orange/10" },
    { label: "Décaissé ce mois", total: "14,850.00 €", count: "62 paiements", icon: CheckCircle2, color: "text-green-400 bg-green-500/10 border-green-500/10" },
    { label: "En attente d'arbitrage", total: "2,310.00 €", count: "9 demandes", icon: AlertCircle, color: "text-amber-400 bg-amber-500/10 border-amber-500/10" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Finance</h1>
        <p className="text-slate-400 text-xs mt-1">Gérez la trésorerie opérationnelle, validez les paiements et suivez les flux comptables.</p>
      </div>

      {/* Cartes KPI Financières */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {financeStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">{stat.label}</span>
                <p className="text-lg font-black text-white font-mono">{stat.total}</p>
                <p className="text-[10px] text-slate-400">{stat.count}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Raccourci vers les actions comptables */}
      <div className="bg-[#1A263B]/30 border border-slate-800/80 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">Paiements d'indemnités en attente de traitement</h4>
          <p className="text-xs text-slate-400">Le management a validé les justificatifs. Les ordres de virement SEPA ou virements locaux peuvent être émis.</p>
        </div>
        <button 
          onClick={() => navigate('/finance/traiter')}
          className="bg-muko-orange hover:bg-opacity-90 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-muko-orange/10 flex items-center gap-2 cursor-pointer"
        >
          Exécuter les remboursements <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}