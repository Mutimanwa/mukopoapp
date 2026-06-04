import { useState } from 'react';
import { Search, CheckCircle2, XCircle, Clock, Calendar, HelpCircle } from 'lucide-react';

const initialHistory = [
  { id: "NDF-722", employee: "Safi Kibasomba", date: "24 Mai 2026", amount: "450.00", action: "Approuvée", color: "text-green-400 bg-green-500/5 border-green-500/10" },
  { id: "NDF-699", employee: "Alain Ndikumana", date: "15 Mai 2026", amount: "89.00", action: "Refusée", color: "text-red-400 bg-red-500/5 border-red-500/10" },
  { id: "NDF-650", employee: "Bella Inamahoro", date: "10 Mai 2026", amount: "275.00", action: "Approuvée", color: "text-green-400 bg-green-500/5 border-green-500/10" },
  { id: "NDF-602", employee: "Alain Ndikumana", date: "02 Mai 2026", amount: "1000.00", action: "Approuvée", color: "text-green-400 bg-green-500/5 border-green-500/10" },
];

export default function ValidationHistory() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tous');

  const filteredHistory = initialHistory.filter(row => {
    const matchesSearch = row.employee.toLowerCase().includes(search.toLowerCase()) || 
                          row.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'Tous' || row.action === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const approvedCount = initialHistory.filter(item => item.action === 'Approuvée').length;
  const approvedTotal = initialHistory
    .filter(item => item.action === 'Approuvée')
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const rejectedCount = initialHistory.filter(item => item.action === 'Refusée').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Historique des arbitrages</h1>
          <p className="text-slate-400 text-xs mt-1">Consultez l'historique complet des notes approuvées ou rejetées par vos soins.</p>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Demandes approuvées</span>
            <p className="text-xl font-black text-white font-mono">{approvedCount} dossiers</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Montant total libéré</span>
            <p className="text-xl font-black text-[#FF6B2C] font-mono">{approvedTotal.toFixed(2)} €</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/15 text-[#FF6B2C] flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Demandes refusées</span>
            <p className="text-xl font-black text-white font-mono">{rejectedCount} dossiers</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 flex items-center justify-center">
            <XCircle size={18} />
          </div>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher par dossier ou collaborateur..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A263B] text-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['Tous', 'Approuvée', 'Refusée'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedStatus === status 
                    ? 'bg-muko-orange text-white border-transparent' 
                    : 'bg-[#1A263B] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                <th className="pb-3 px-4">ID Dossier</th>
                <th className="pb-3 px-4">Collaborateur</th>
                <th className="pb-3 px-4">Date de décision</th>
                <th className="pb-3 px-4">Montant</th>
                <th className="pb-3 px-4 text-right">Statut émis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-[#0B131F]/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-400">{row.id}</td>
                    <td className="py-4 px-4 font-semibold text-white">{row.employee}</td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">{row.date}</td>
                    <td className="py-4 px-4 font-mono font-bold text-white">{parseFloat(row.amount).toFixed(2)} €</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${row.color}`}>
                        {row.action}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">
                    Aucun historique de décision trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}