import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, Search, Clock, DollarSign, Calendar, Filter } from 'lucide-react';

const initialPendingList = [
  { id: "NDF-891", employee: "Alain Ndikumana", date: "02 Juin 2026", category: "Transport", amount: "120.00", project: "TenderFlow" },
  { id: "NDF-892", employee: "Bella Inamahoro", date: "01 Juin 2026", category: "Restauration", amount: "45.50", project: "SmartFly" },
  { id: "NDF-893", employee: "Clément Nkurunziza", date: "29 Mai 2026", category: "Hébergement", amount: "310.00", project: "RE-START" },
];

export default function PendingExpenses() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  const filteredExpenses = initialPendingList.filter(row => {
    const matchesSearch = row.employee.toLowerCase().includes(search.toLowerCase()) || 
                          row.id.toLowerCase().includes(search.toLowerCase()) ||
                          row.project.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || row.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalAmount = filteredExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Demandes à valider</h1>
        <p className="text-slate-400 text-xs mt-1">Vérifiez la conformité des montants et des pièces jointes avant approbation.</p>
      </div>

      {/* Cartes KPI rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Total en attente</span>
            <p className="text-xl font-black text-white font-mono">{filteredExpenses.length} dossiers</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-400 flex items-center justify-center">
            <Clock size={18} />
          </div>
        </div>

        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Montant cumulé</span>
            <p className="text-xl font-black text-[#FF6B2C] font-mono">{totalAmount.toFixed(2)} €</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/15 text-[#FF6B2C] flex items-center justify-center">
            <DollarSign size={18} />
          </div>
        </div>

        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Délai moyen d'attente</span>
            <p className="text-xl font-black text-white font-mono">1.8 jours</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 flex items-center justify-center">
            <Calendar size={18} />
          </div>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Barre de recherche */}
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher par collaborateur, ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A263B] text-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors"
            />
          </div>

          {/* Filtres de catégorie */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['Toutes', 'Transport', 'Restauration', 'Hébergement'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === category 
                    ? 'bg-muko-orange text-white border-transparent' 
                    : 'bg-[#1A263B] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Le Tableau */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                <th className="pb-3 px-4">Collaborateur</th>
                <th className="pb-3 px-4">Date de dépôt</th>
                <th className="pb-3 px-4">Catégorie</th>
                <th className="pb-3 px-4">Projet</th>
                <th className="pb-3 px-4 text-right">Montant</th>
                <th className="pb-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((row) => (
                  <tr key={row.id} className="hover:bg-[#0B131F]/30 transition-colors group">
                    <td className="py-4 px-4 font-semibold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#1A263B] border border-slate-800 flex items-center justify-center text-slate-400">
                        <User size={12} />
                      </div>
                      {row.employee}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-400">{row.date}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#1A263B] text-slate-300 border border-slate-800/80 text-[10px]">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-medium">{row.project}</td>
                    <td className="py-4 px-4 text-right font-bold font-mono text-white">{parseFloat(row.amount).toFixed(2)} €</td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => navigate(`/validation/detail/${row.id}`)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-muko-orange hover:text-white transition-colors bg-muko-orange/5 hover:bg-muko-orange px-3 py-1.5 rounded-lg border border-muko-orange/20 cursor-pointer"
                      >
                        Traiter <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                    Aucune demande en attente trouvée.
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