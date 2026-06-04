import { useNavigate } from 'react-router-dom';
import { Landmark, AlertCircle, CheckCircle2, BarChart3, ArrowRight, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const payoutTrend = [
  { name: 'Jan', Décaissements: 8400 },
  { name: 'Fév', Décaissements: 9900 },
  { name: 'Mar', Décaissements: 14200 },
  { name: 'Avr', Décaissements: 11000 },
  { name: 'Mai', Décaissements: 14850 },
  { name: 'Juin', Décaissements: 4120 },
];

const recentPayouts = [
  { ref: "REM-9011", name: "Bella Inamahoro", date: "24/05/2026", method: "Virement", amount: "320.50 €" },
  { ref: "REM-8920", name: "Alain Ndikumana", date: "15/05/2026", method: "Virement", amount: "89.00 €" },
];

export default function FinanceDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "À rembourser (Approuvé)", total: "4 120,00 €", count: "18 ordres en attente", icon: Landmark, color: "text-[#FF6B2C] bg-[#FF6B2C]/10 border-[#FF6B2C]/10" },
    { label: "Décaissé ce mois", total: "14 850,00 €", count: "62 ordres payés", icon: CheckCircle2, color: "text-green-400 bg-green-500/10 border-green-500/10" },
    { label: "En attente d'arbitrage", total: "2 310,00 €", count: "9 requêtes actives", icon: AlertCircle, color: "text-amber-400 bg-amber-500/10 border-amber-500/10" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Finance</h1>
          <p className="text-slate-400 text-xs mt-1">Gérez la trésorerie opérationnelle, validez les paiements et suivez les flux comptables.</p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-muko-card border border-slate-800 px-4 py-2 rounded-xl">
          Devise principale : <span className="text-[#FF6B2C]">EUR (€)</span>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">{stat.label}</span>
                <p className="text-lg font-black text-white font-mono">{stat.total}</p>
                <p className="text-[10px] text-slate-400">{stat.count}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphique de décaissements et Activité */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graphique de décaissements (Prend 2 colonnes) */}
        <div className="lg:col-span-2 bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-[#FF6B2C]" />
              Courbe des décaissements mensuels
            </h2>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Flux comptables</span>
          </div>

          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payoutTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A263B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111C2E', borderColor: '#1A263B', borderRadius: '12px' }}
                  itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="Décaissements" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorPayout)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Derniers virements archivés (Prend 1 colonne) */}
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Derniers règlements</h3>
            <div className="divide-y divide-slate-800/40 text-xs">
              {recentPayouts.map((pay) => (
                <div key={pay.ref} className="py-3 first:pt-0 last:pb-0 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white">{pay.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">{pay.ref} • {pay.date}</p>
                  </div>
                  <span className="font-mono font-bold text-green-400">{pay.amount}</span>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => navigate('/finance/historique')}
            className="w-full bg-[#1A263B] text-slate-300 hover:text-white text-xs font-semibold py-2.5 rounded-xl border border-slate-800 transition-all mt-4 flex items-center justify-center gap-1 cursor-pointer"
          >
            Consulter l'historique
          </button>
        </div>

      </div>

      {/* Raccourci vers les actions comptables */}
      <div className="bg-[#1A263B]/30 border border-slate-800/80 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Ordres de virements en attente de signature SEPA</h4>
          <p className="text-xs text-slate-400">Remboursez vos employés pour les frais qu'ils ont engagés. Les dossiers sont validés et prêts pour paiement.</p>
        </div>
        <button 
          onClick={() => navigate('/finance/traiter')}
          className="bg-muko-orange hover:bg-opacity-90 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-muko-orange/10 flex items-center gap-2 cursor-pointer"
        >
          Exécuter les remboursements <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}