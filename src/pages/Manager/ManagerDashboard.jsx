import { useNavigate } from 'react-router-dom';
import { CheckSquare, AlertCircle, Clock, TrendingUp, Users, ArrowRight, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Données fictives pour le graphique des dépenses d'équipe
const teamMonthlySpending = [
  { name: 'Jan', Dépenses: 3200 },
  { name: 'Fév', Dépenses: 4500 },
  { name: 'Mar', Dépenses: 6100 },
  { name: 'Avr', Dépenses: 5800 },
  { name: 'Mai', Dépenses: 8450 },
  { name: 'Juin', Dépenses: 4200 },
];

const recentSubmissions = [
  { id: "NDF-891", employee: "Alain Ndikumana", date: "02 Juin 2026", category: "Transport", amount: "120.00 €" },
  { id: "NDF-892", employee: "Bella Inamahoro", date: "01 Juin 2026", category: "Restauration", amount: "45.50 €" },
  { id: "NDF-893", employee: "Clément Nkurunziza", date: "29 Mai 2026", category: "Hébergement", amount: "310.00 €" },
];

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "À valider", count: "3 demandes", sub: "120.00 € en attente", icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/10" },
    { label: "Validées ce mois", count: "48 notes", sub: "8 450.00 € approuvés", icon: CheckSquare, color: "text-green-400 bg-green-500/10 border-green-500/10" },
    { label: "Refusées / Retours", count: "3 requêtes", sub: "Corrections requises", icon: AlertCircle, color: "text-red-400 bg-red-500/10 border-red-500/10" },
    { label: "Budget Équipe", count: "8 450,00 €", sub: "Limite : 15 000,00 €", icon: TrendingUp, color: "text-[#FF6B2C] bg-[#FF6B2C]/10 border-[#FF6B2C]/10" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. EN-TÊTE */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Responsable</h1>
          <p className="text-slate-400 text-xs mt-1">Supervisez les engagements financiers et pilotez les validations de votre équipe.</p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-muko-card border border-slate-800 px-4 py-2 rounded-xl">
          Pôle d'approbation : <span className="text-[#FF6B2C]">Technique & Design</span>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">{stat.label}</span>
                <p className="text-lg font-black text-white">{stat.count}</p>
                <p className="text-[10px] text-slate-400">{stat.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. SECTION ANALYTIQUE ET BUDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graphique de dépenses (Prend 2 colonnes) */}
        <div className="lg:col-span-2 bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-[#FF6B2C]" />
              Évolution des dépenses d'équipe
            </h2>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Valeurs en EUR (€)</span>
          </div>

          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={teamMonthlySpending} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="Dépenses" stroke="#FF6B2C" strokeWidth={2} fillOpacity={1} fill="url(#colorTeam)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consommation Budget d'équipe (Prend 1 colonne) */}
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Suivi d'enveloppe</h3>
            <p className="text-xs text-slate-400">Consommation du budget mensuel alloué au pôle technique.</p>
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Consommé (56%)</span>
                <span className="font-mono font-bold text-[#FF6B2C]">8 450,00 €</span>
              </div>
              <div className="w-full h-2.5 bg-[#0B131F] rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-[#FF6B2C] rounded-full w-[56.3%]"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0,00 €</span>
                <span>Max : 15 000,00 €</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0B131F]/40 border border-slate-800/60 p-4 rounded-xl space-y-1 mt-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#FF6B2C] rounded-full"></span>
              Alerte Cadrage
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Aucun collaborateur n'est en dépassement de plafond individuel.
            </p>
          </div>
        </div>

      </div>

      {/* 4. DERNIÈRES DEMANDES EN ATTENTE */}
      <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-white">Demandes récentes en attente d'arbitrage</h2>
          <button onClick={() => navigate('/validation/attente')} className="text-xs font-mono text-[#FF6B2C] hover:underline flex items-center gap-1 cursor-pointer">
            Voir la file d'attente <ArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase">
                <th className="pb-3">Collaborateur</th>
                <th className="pb-3">Date de dépôt</th>
                <th className="pb-3">Catégorie</th>
                <th className="pb-3 text-right">Montant</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {recentSubmissions.map((row) => (
                <tr key={row.id} className="hover:bg-[#0B131F]/30 transition-colors">
                  <td className="py-3 font-semibold text-white">{row.employee}</td>
                  <td className="py-3 text-slate-400 font-mono">{row.date}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-[#1A263B] text-slate-300 border border-slate-800/50">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-3 text-right font-bold font-mono text-white">{row.amount}</td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => navigate(`/validation/detail/${row.id}`)}
                      className="text-[#FF6B2C] hover:text-white font-bold transition-colors cursor-pointer"
                    >
                      Traiter →
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
