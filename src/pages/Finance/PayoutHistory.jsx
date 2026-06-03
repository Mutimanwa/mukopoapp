import React from 'react';
import { CheckCircle, Search, Landmark } from 'lucide-react';

export default function PayoutHistory() {
  const closedPayouts = [
    { id: "REM-9011", name: "Bella Inamahoro", date: "24/05/2026", method: "Virement", ref: "TR-890211", total: "320.50 €" },
    { id: "REM-8920", name: "Alain Ndikumana", date: "15/05/2026", method: "Virement", ref: "TR-881902", total: "89.00 €" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Historique des décaissements</h1>
        <p className="text-slate-400 text-xs mt-1">Journal complet des remboursements archivés et lettrés en comptabilité.</p>
      </div>

      <div className="bg-muko-card border border-slate-800/80 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider bg-[#0B131F]/30">
              <th className="py-4 px-6">Réf Interne</th>
              <th className="py-4 px-4">Salarié</th>
              <th className="py-4 px-4">Date Paiement</th>
              <th className="py-4 px-4">Référence Bancaire</th>
              <th className="py-4 px-6 text-right">Montant Clôturé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
            {closedPayouts.map((item) => (
              <tr key={item.id} className="hover:bg-[#1A263B]/10 transition-colors">
                <td className="py-4 px-6 font-mono font-bold text-slate-400">{item.id}</td>
                <td className="py-4 px-4 font-semibold text-white">{item.name}</td>
                <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">{item.date}</td>
                <td className="py-4 px-4 text-slate-400 font-mono flex items-center gap-1.5 py-4"><Landmark size={12} className="text-slate-600" />{item.ref}</td>
                <td className="py-4 px-6 text-right font-bold text-green-400 font-mono">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}