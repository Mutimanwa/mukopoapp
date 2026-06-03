import React from 'react';
import { Layers, Plus, Tag } from 'lucide-react';

export default function OrgStructure() {
  const costCenters = [
    { code: "CC-R&D-01", label: "Pôle R&D Logiciel", budget: "25,000.00 €", manager: "A. Ndikumana" },
    { code: "CC-MKT-02", label: "Lancement RE-START", budget: "12,500.00 €", manager: "B. Inamahoro" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Organisation & Centres de coûts</h1>
          <p className="text-slate-400 text-xs mt-1">Configurez l'ossature budgétaire et associez les plafonds d'enveloppes financières.</p>
        </div>
        <button className="bg-[#1A263B] border border-slate-800 hover:text-white text-slate-300 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer">
          <Plus size={14} className="text-muko-orange" /> Nouveau Centre de Coût
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {costCenters.map((cc) => (
          <div key={cc.code} className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2.5">
                <Tag size={16} className="text-muko-orange" />
                <span className="text-xs font-mono font-bold text-white">{cc.code}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Resp: {cc.manager}</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">{cc.label}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Enveloppe annuelle allouée</p>
              </div>
              <span className="text-sm font-mono font-black text-white">{cc.budget}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}