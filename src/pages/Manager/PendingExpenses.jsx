import { useNavigate } from 'react-router-dom';
import { ArrowRight, User } from 'lucide-react';

export default function PendingExpenses() {
  const navigate = useNavigate();

  const pendingList = [
    { id: "NDF-891", employee: "Alain Ndikumana", date: "02 Juin 2026", category: "Transport", amount: "120.00 €", project: "TenderFlow" },
    { id: "NDF-892", employee: "Bella Inamahoro", date: "01 Juin 2026", category: "Restauration", amount: "45.50 €", project: "SmartFly" },
    { id: "NDF-893", employee: "Clément Nkurunziza", date: "29 Mai 2026", category: "Hébergement", amount: "310.00 €", project: "RE-START" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Demandes à valider</h1>
        <p className="text-slate-400 text-xs mt-1">Vérifiez la conformité des montants et des pièces jointes avant approbation.</p>
      </div>

      <div className="bg-muko-card border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider bg-[#0B131F]/30">
                <th className="py-4 px-6">Collaborateur</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Catégorie</th>
                <th className="py-4 px-4">Projet</th>
                <th className="py-4 px-4 text-right">Montant</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {pendingList.map((row) => (
                <tr key={row.id} className="hover:bg-[#1A263B]/20 transition-colors group">
                  <td className="py-4 px-6 font-semibold text-white flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#1A263B] border border-slate-800 flex items-center justify-center text-slate-400">
                      <User size={12} />
                    </div>
                    {row.employee}
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-slate-400">{row.date}</td>
                  <td className="py-4 px-4"><span className="px-2 py-0.5 rounded bg-[#1A263B] text-slate-300 border border-slate-800">{row.category}</span></td>
                  <td className="py-4 px-4 text-slate-400 font-medium">{row.project}</td>
                  <td className="py-4 px-4 text-right font-bold font-mono text-white">{row.amount}</td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => navigate(`/validation/detail/${row.id}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-muko-orange hover:text-white transition-colors bg-muko-orange/5 hover:bg-muko-orange px-3 py-1.5 rounded-lg border border-muko-orange/20 cursor-pointer"
                    >
                      Traiter <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}