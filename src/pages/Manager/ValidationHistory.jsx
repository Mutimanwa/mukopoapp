
export default function ValidationHistory() {
  const history = [
    { id: "NDF-722", employee: "Safi Kibasomba", date: "24 Mai 2026", amount: "450.00 €", action: "Approuvée", color: "text-green-400 bg-green-500/5 border-green-500/10" },
    { id: "NDF-699", employee: "Alain Ndikumana", date: "15 Mai 2026", amount: "89.00 €", action: "Refusée", color: "text-red-400 bg-red-500/5 border-red-500/10" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Historique des arbitrages</h1>
          <p className="text-slate-400 text-xs mt-1">Consultez l'historique complet des notes approuvées ou rejetées par vos soins.</p>
        </div>
      </div>

      <div className="bg-muko-card border border-slate-800/80 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider bg-[#0B131F]/30">
              <th className="py-4 px-6">ID Dossier</th>
              <th className="py-4 px-4">Collaborateur</th>
              <th className="py-4 px-4">Date décision</th>
              <th className="py-4 px-4">Montant</th>
              <th className="py-4 px-6 text-right">Statut émis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
            {history.map((row) => (
              <tr key={row.id} className="hover:bg-[#1A263B]/10 transition-colors">
                <td className="py-4 px-6 font-mono font-bold text-slate-400">{row.id}</td>
                <td className="py-4 px-4 font-semibold text-white">{row.employee}</td>
                <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">{row.date}</td>
                <td className="py-4 px-4 font-mono font-bold text-white">{row.amount}</td>
                <td className="py-4 px-6 text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${row.color}`}>
                    {row.action}
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