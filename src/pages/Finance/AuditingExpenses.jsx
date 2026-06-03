import React from 'react';
import { ShieldCheck, Eye, FileSpreadsheet } from 'lucide-react';

export default function AuditingExpenses() {
  const auditList = [
    { id: "NDF-990", employee: "Alain Ndikumana", taxRate: "TVA 18%", rawAmount: "101.69 €", vatAmount: "18.31 €", status: "Conforme" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Contrôle de conformité et audit</h1>
        <p className="text-slate-400 text-xs mt-1">Vérification de la concordance des taux de taxes et des calculs comptables sur les pièces de caisse.</p>
      </div>

      <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-500 bg-[#0B131F]/30 uppercase">
              <th className="py-4 px-4">Dossier NDF</th>
              <th className="py-4 px-4">Salarié</th>
              <th className="py-4 px-4">Régime fiscal</th>
              <th className="py-4 px-4">Montant HT</th>
              <th className="py-4 px-4">Part Taxe</th>
              <th className="py-4 px-4 text-right">Audit</th>
            </tr>
          </thead>
          <tbody className="text-slate-300 divide-y divide-slate-800/50">
            {auditList.map((node) => (
              <tr key={node.id}>
                <td className="py-4 px-4 font-mono text-muko-orange font-bold">{node.id}</td>
                <td className="py-4 px-4 font-medium text-white">{node.employee}</td>
                <td className="py-4 px-4 font-mono text-slate-400">{node.taxRate}</td>
                <td className="py-4 px-4 font-mono">{node.rawAmount}</td>
                <td className="py-4 px-4 font-mono text-slate-500">{node.vatAmount}</td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-md font-semibold">
                    <ShieldCheck size={12} /> {node.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}