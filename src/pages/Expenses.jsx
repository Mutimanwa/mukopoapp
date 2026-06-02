import { Calendar, Filter, Download, Printer, SlidersHorizontal, UploadCloud, Utensils, Train, Hotel, ShoppingBag, Fuel, Eye, DownloadCloud } from 'lucide-react';

// Données fidèles à ta maquette d'origine "Html → Body (2).jpg"
const initialExpenses = [
  { id: 1, date: '12 Oct 2023', merchant: 'Le Petit Bistro', category: 'Restauration', icon: Utensils, amount: '45.00 €', status: 'Payé' },
  { id: 2, date: '10 Oct 2023', merchant: 'SNCF Voyage', category: 'Transport', icon: Train, amount: '128.50 €', status: 'En attente' },
  { id: 3, date: '08 Oct 2023', merchant: 'Hôtel Continental', category: 'Hébergement', icon: Hotel, amount: '540.00 €', status: 'Payé' },
  { id: 4, date: '05 Oct 2023', merchant: 'Amazon Business', category: 'Fournitures', icon: ShoppingBag, amount: '89.99 €', status: 'Rejeté' },
  { id: 5, date: '02 Oct 2023', merchant: 'TotalEnergies', category: 'Carburant', icon: Fuel, amount: '75.20 €', status: 'Payé' },
];

export default function Expenses() {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. BLOC TOP : Cartes d'Analyse Complète */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grande Carte : Total Dépensé (Prend 2 colonnes sur grand écran) */}
        <div className="lg:col-span-2 bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Dépensé (Ce mois)</span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-black text-white font-mono tracking-tight">12,450.00 FB</h2>
              <span className="text-[10px] font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded-md border border-red-500/20">
                +14.2% vs mois dernier
              </span>
            </div>
          </div>
          
          {/* Simulation du graphique en barres en arrière-plan (Style minimaliste de la maquette) */}
          <div className="flex items-end gap-3 h-20 mt-6 w-full opacity-60 group-hover:opacity-80 transition-opacity">
            <div className="bg-linear-to-t from-[#FF6B2C]/40 to-[#FF6B2C]/10 w-full h-[40%] rounded-t-lg"></div>
            <div className="bg-linear-to-t from-[#FF6B2C]/40 to-[#FF6B2C]/10 w-full h-[60%] rounded-t-lg"></div>
            <div className="bg-linear-to-t from-[#FF6B2C]/40 to-[#FF6B2C]/10 w-full h-[85%] rounded-t-lg"></div>
            <div className="bg-linear-to-t from-[#FF6B2C]/40 to-[#FF6B2C]/10 w-full h-[55%] rounded-t-lg"></div>
          </div>
        </div>

        {/* Carte Action : Solde Remboursable (Orange vif) */}
        <div className="bg-linear-to-br from-[#FF6B2C] to-[#E25316] rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl shadow-[#FF6B2C]/10">
          <div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
              <Printer size={18} />
            </div>
            <h3 className="text-base font-bold mt-4">Solde Remboursable</h3>
            <p className="text-white/70 text-xs mt-0.5">Prêt pour traitement immédiat</p>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black font-mono">2,840.15 FB</div>
            <button className="w-full bg-[#0B131F] text-white hover:bg-opacity-90 font-semibold text-xs py-3 px-4 rounded-xl mt-3 transition-all active:scale-[0.98] cursor-pointer">
              Demander le remboursement
            </button>
          </div>
        </div>

      </div>

      {/* 2. ACTIONS DE FILTRES ET EN-TÊTE TABLEAU */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Filtres de sélection */}
          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-[#1A263B] text-slate-300 text-xs px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2 hover:text-white">
              <Calendar size={14} /> Ce mois
            </button>
            <button className="bg-[#1A263B] text-slate-300 text-xs px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2 hover:text-white">
              <Filter size={14} /> Toutes les catégories
            </button>
            <button className="bg-[#1A263B] text-slate-300 text-xs px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2 hover:text-white">
              <SlidersHorizontal size={14} /> Plus de filtres
            </button>
          </div>

          {/* Outils Export */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-[#1A263B] border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors" title="Télécharger">
              <Download size={16} />
            </button>
            <button className="p-2.5 bg-[#1A263B] border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors" title="Imprimer">
              <Printer size={16} />
            </button>
          </div>
        </div>

        {/* 3. LE TABLEAU DES DÉPENSES */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="pb-4">Date</th>
                <th className="pb-4">Marchand</th>
                <th className="pb-4">Catégorie</th>
                <th className="pb-4 text-right">Montant</th>
                <th className="pb-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {initialExpenses.map((exp) => {
                const IconComponent = exp.icon;
                return (
                  <tr key={exp.id} className="hover:bg-[#0B131F]/30 transition-colors">
                    <td className="py-4 text-slate-400 font-medium">{exp.date}</td>
                    <td className="py-4 font-semibold text-white flex items-center gap-2.5">
                      <span className="text-[#FF6B2C]"><IconComponent size={15} /></span>
                      {exp.merchant}
                    </td>
                    <td className="py-4">
                      <span className="bg-[#1A263B] text-slate-400 px-2.5 py-1 rounded-lg border border-slate-800/60 text-[11px]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-sm text-white">{exp.amount}</td>
                    <td className="py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-medium border ${
                        exp.status === 'Payé' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        exp.status === 'En attente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION DE LA MAQUETTE */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-500">
          <div>Affichage de 1-5 sur 42 transactions</div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 bg-[#1A263B] border border-slate-800 rounded-lg text-slate-400" disabled>&lt;</button>
            <button className="w-8 h-8 bg-[#FF6B2C] text-white rounded-lg font-bold">1</button>
            <button className="w-8 h-8 bg-[#1A263B] border border-slate-800 rounded-lg hover:text-white">2</button>
            <button className="w-8 h-8 bg-[#1A263B] border border-slate-800 rounded-lg hover:text-white">3</button>
            <button className="px-2 py-1 bg-[#1A263B] border border-slate-800 rounded-lg text-slate-400">&gt;</button>
          </div>
        </div>

      </div>

      {/* 4. BLOC BAS : TOP CATÉGORIES & DRAG & DROP IA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Catégories (Progress bar) */}
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Top Catégories</h3>
          <div className="space-y-3">
            {[
              { name: 'Hébergement', val: '45%', color: 'bg-[#FF6B2C]' },
              { name: 'Transport', val: '28%', color: 'bg-blue-500' },
              { name: 'Restauration', val: '15%', color: 'bg-emerald-500' }
            ].map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{cat.name}</span>
                  <span className="font-mono font-bold text-white">{cat.val}</span>
                </div>
                <div className="w-full h-1.5 bg-[#1A263B] rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: cat.val }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module IA Scanner Drag & Drop (Prend 2 colonnes) */}
        <div className="md:col-span-2 bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-sm">
            <h3 className="text-sm font-bold text-white">Scan Intelligent de Reçus</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utilisez notre IA pour extraire automatiquement les données de vos factures et gagner du temps lors de la saisie.
            </p>
            <button className="bg-[#1A263B] hover:bg-opacity-80 border border-slate-700/80 text-white font-medium text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all mt-3 cursor-pointer">
              <Eye size={14} className="text-[#FF6B2C]" /> Lancer le Scanner
            </button>
          </div>

          {/* Zone Drag and Drop Interactive */}
          <div className="w-full md:w-64 aspect-4/3 border-2 border-dashed border-slate-800 hover:border-[#FF6B2C]/50 bg-[#0B131F]/50 rounded-2xl flex flex-col items-center justify-center p-4 transition-all group cursor-pointer relative">
            <div className="w-10 h-10 rounded-full bg-[#FF6B2C]/10 text-[#FF6B2C] flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud size={20} />
            </div>
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase text-center mt-3 block group-hover:text-slate-300">
              Glissez vos fichiers ici
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}