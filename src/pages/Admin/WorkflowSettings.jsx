import React from 'react';
import { Sliders, ToggleLeft, GitFork, ShieldCheck } from 'lucide-react';

export default function WorkflowSettings() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Paramètres des Workflows</h1>
        <p className="text-slate-400 text-xs mt-1">Configurez les paliers de signatures et éditez les circuits de validation automatiques.</p>
      </div>

      <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><GitFork size={16} className="text-muko-orange" /> Règle de validation par défaut</h3>
        
        <div className="p-4 bg-[#0B131F]/40 border border-slate-800/60 rounded-xl space-y-4 text-xs">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-white font-semibold">Validation standard à double facteur</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Toute note inférieure à 1 500 € passe du Manager directement au Comptable.</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 font-bold rounded bg-green-500/10 text-green-400 border border-green-500/15">Actif</span>
          </div>
          
          <div className="border-t border-slate-800/40 pt-3 flex items-center gap-4 text-[11px] text-slate-400">
            <span>Étape 1 : Manager direct</span>
            <span className="text-slate-600">→</span>
            <span>Étape 2 : Service Comptabilité</span>
          </div>
        </div>
      </div>
    </div>
  );
}