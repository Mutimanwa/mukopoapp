import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldAlert } from 'lucide-react';

export default function PendingPayouts() {
  const navigate = useNavigate();

  const payouts = [
    { id: "REM-001", employee: "Safi Kibasomba", items: "3 notes de frais", total: "1,450.00 €", approvedBy: "Manager Technique", date: "Hier" },
    { id: "REM-002", employee: "Alain Ndikumana", items: "1 note de frais", total: "120.00 €", approvedBy: "Manager Réseau", date: "Le 02/06" },
    { id: "REM-003", employee: "Clément Nkurunziza", items: "2 notes de frais", total: "410.00 €", approvedBy: "Directeur RE-START", date: "Le 29/05" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Remboursements à libérer</h1>
        <p className="text-slate-400 text-xs mt-1">Sélectionnez un dossier pour insérer sa référence de transaction bancaire et archiver le paiement.</p>
      </div>

      <div className="bg-muko-card border border-slate-800/80 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider bg-[#0B131F]/30">
              <th className="py-4 px-6">Bénéficiaire</th>
              <th className="py-4 px-4">Volume groupé</th>
              <th className="py-4 px-4">Validation d'origine</th>
              <th className="py-4 px-4">Montant Net</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
            {payouts.map((row) => (
              <tr key={row.id} className="hover:bg-[#1A263B]/20 transition-colors">
                <td className="py-4 px-6 font-semibold text-white">{row.employee}</td>
                <td className="py-4 px-4 text-slate-400">{row.items}</td>
                <td className="py-4 px-4 text-slate-500 font-medium">✅ {row.approvedBy}</td>
                <td className="py-4 px-4 font-mono font-bold text-muko-orange">{row.total}</td>
                <td className="py-4 px-6 text-right">
                  <button 
                    onClick={() => navigate(`/finance/payer/${row.id}`)}
                    className="bg-[#1A263B] hover:bg-muko-orange hover:text-white text-slate-300 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-800 transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                  >
                    <CreditCard size={12} /> Émettre le virement
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}