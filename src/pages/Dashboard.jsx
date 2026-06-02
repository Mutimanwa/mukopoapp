import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, RefreshCw, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Données fictives pour le graphique d'évolution budgétaire
const chartData = [
  { name: 'Jan', Depenses: 2400, Budget: 4000 },
  { name: 'Fév', Depenses: 1398, Budget: 4000 },
  { name: 'Mar', Depenses: 9800, Budget: 4000 },
  { name: 'Avr', Depenses: 3908, Budget: 4000 },
  { name: 'Mai', Depenses: 4800, Budget: 4000 },
  { name: 'Juin', Depenses: 3800, Budget: 4000 },
];

// Données fictives pour les dernières transactions
const transactions = [
  { id: 'TX892', merchant: 'Amazon Web Services', category: 'Infrastructure', date: '30 Mai 2026', amount: -320.50, status: 'Validé' },
  { id: 'TX891', merchant: 'Safi Kibasomba (Frais)', category: 'Déplacement', date: '28 Mai 2026', amount: 45.00, status: 'En attente' },
  { id: 'TX890', merchant: 'Le Bistro Bujumbura', category: 'Repas d\'affaires', date: '25 Mai 2026', amount: -120.00, status: 'Validé' },
  { id: 'TX889', merchant: 'GitHub Enterprise', category: 'Outils Dev', date: '22 Mai 2026', amount: -250.00, status: 'Validé' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. SECTION : En-tête de bienvenue */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tableau de bord</h1>
          <p className="text-slate-400 text-xs mt-1">Voici l'état actuel des finances de votre organisation.</p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-[#111C2E] border border-slate-800 px-4 py-2 rounded-xl">
          Mise à jour : <span className="text-[#FF6B2C]">Instantanée</span>
        </div>
      </div>

      {/* 2. SECTION : Cartes de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Carte Solde */}
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Solde Disponible</span>
            <h3 className="text-2xl font-bold text-white font-mono">14 850,00 €</h3>
            <span className="text-[10px] text-green-400 flex items-center gap-1 font-mono">
              <ArrowUpRight size={12} /> +12.3% ce mois
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C]">
            <Wallet size={22} />
          </div>
        </div>

        {/* Carte Dépenses */}
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Dépenses du Mois</span>
            <h3 className="text-2xl font-bold text-white font-mono">4 250,00 €</h3>
            <span className="text-[10px] text-red-400 flex items-center gap-1 font-mono">
              <ArrowDownRight size={12} /> +4.1% vs Avril
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CreditCard size={22} />
          </div>
        </div>

        {/* Carte Remboursements */}
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Remboursements en attente</span>
            <h3 className="text-2xl font-bold text-white font-mono">1 120,00 €</h3>
            <span className="text-[10px] text-slate-500 font-mono">3 requêtes actives</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <RefreshCw size={22} />
          </div>
        </div>

      </div>
    
      {/* 3. SECTION : Graphique central */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#FF6B2C]" />
            <h2 className="text-sm font-semibold text-white">Analyse des flux et dépenses</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-[#FF6B2C]"></span> Flux réels
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-700"></span> Limite budgétaire
            </span>
          </div>
        </div>

        {/* Graphique Haute Performance Recharts */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B2C" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#FF6B2C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A263B" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111C2E', borderColor: '#1A263B', borderRadius: '12px' }}
                itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="Depenses" stroke="#FF6B2C" strokeWidth={2} fillOpacity={1} fill="url(#colorDepenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. SECTION : Tableau des transactions récentes */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-white">Transactions récentes</h2>
          <button className="text-xs font-mono text-[#FF6B2C] hover:underline">Voir tout</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pt-1">ID</th>
                <th className="pb-3 pt-1">Bénéficiaire / Marchand</th>
                <th className="pb-3 pt-1">Catégorie</th>
                <th className="pb-3 pt-1">Date</th>
                <th className="pb-3 pt-1 text-right">Montant</th>
                <th className="pb-3 pt-1 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#0B131F]/30 transition-colors group">
                  <td className="py-4 font-mono text-slate-500 group-hover:text-slate-400">{tx.id}</td>
                  <td className="py-4 font-medium text-white">{tx.merchant}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-[#1A263B] text-slate-300 border border-slate-800">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400">{tx.date}</td>
                  <td className={`py-4 text-right font-mono font-semibold ${tx.amount < 0 ? 'text-slate-200' : 'text-[#FF6B2C]'}`}>
                    {tx.amount < 0 ? '' : '+'}{tx.amount.toFixed(2)} €
                  </td>
                  <td className="py-4 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                      tx.status === 'Validé' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      • {tx.status}
                    </span>
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