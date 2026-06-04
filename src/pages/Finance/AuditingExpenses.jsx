import { useState } from 'react';
import { ShieldCheck, Eye, Search, AlertTriangle, CheckCircle, FileSpreadsheet, ShieldAlert } from 'lucide-react';

const initialAuditList = [
  { id: "NDF-990", employee: "Alain Ndikumana", taxRate: "TVA 18%", rawAmount: "101.69", vatAmount: "18.31", status: "Conforme", note: "Justificatif parfaitement lisible et valide" },
  { id: "NDF-892", employee: "Bella Inamahoro", taxRate: "TVA 18%", rawAmount: "38.56", vatAmount: "6.94", status: "Conforme", note: "Restaurateur Burundi standard" },
  { id: "NDF-891", employee: "Safi Kibasomba", taxRate: "TVA 0%", rawAmount: "120.00", vatAmount: "0.00", status: "Attention", note: "Facture internationale sans mention de TVA" },
  { id: "NDF-889", employee: "Alain Ndikumana", taxRate: "TVA 18%", rawAmount: "254.24", vatAmount: "45.76", status: "Anomalie", note: "Montant saisi ne correspond pas à la pièce jointe (-10 €)" }
];

export default function AuditingExpenses() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tous');

  const filteredAudits = initialAuditList.filter(row => {
    const matchesSearch = row.employee.toLowerCase().includes(search.toLowerCase()) || 
                          row.id.toLowerCase().includes(search.toLowerCase()) ||
                          row.note.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'Tous' || row.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contrôle de conformité et audit</h1>
          <p className="text-slate-400 text-xs mt-1">Vérification de la concordance des taux de taxes et des calculs comptables sur les pièces de caisse.</p>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Taux de conformité</span>
            <p className="text-xl font-black text-green-400 font-mono">98.2 %</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
        </div>

        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Alertes détectées</span>
            <p className="text-xl font-black text-red-400 font-mono">2 anomalies</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
        </div>

        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Total Audité</span>
            <p className="text-xl font-black text-white font-mono">24 580,00 €</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 flex items-center justify-center">
            <FileSpreadsheet size={18} />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher par collaborateur, note..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A263B] text-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['Tous', 'Conforme', 'Attention', 'Anomalie'].map((status) => (
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
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase">
                <th className="pb-3 px-4">Dossier NDF</th>
                <th className="pb-3 px-4">Salarié</th>
                <th className="pb-3 px-4">Régime fiscal</th>
                <th className="pb-3 px-4">Montant HT</th>
                <th className="pb-3 px-4">Part Taxe</th>
                <th className="pb-3 px-4">Observations d'Audit</th>
                <th className="pb-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 divide-y divide-slate-800/40 text-xs">
              {filteredAudits.length > 0 ? (
                filteredAudits.map((node) => (
                  <tr key={node.id} className="hover:bg-[#0B131F]/30 transition-colors">
                    <td className="py-4 px-4 font-mono text-[#FF6B2C] font-bold">{node.id}</td>
                    <td className="py-4 px-4 font-semibold text-white">{node.employee}</td>
                    <td className="py-4 px-4 font-mono text-slate-400">{node.taxRate}</td>
                    <td className="py-4 px-4 font-mono">{parseFloat(node.rawAmount).toFixed(2)} €</td>
                    <td className="py-4 px-4 font-mono text-slate-500">{parseFloat(node.vatAmount).toFixed(2)} €</td>
                    <td className="py-4 px-4 text-slate-400 max-w-xs truncate" title={node.note}>{node.note}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-[10px] border px-2 py-0.5 rounded-md font-semibold ${
                        node.status === 'Conforme' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        node.status === 'Attention' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {node.status === 'Conforme' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                        {node.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 font-medium">
                    Aucune ligne d'audit ne correspond à vos critères.
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