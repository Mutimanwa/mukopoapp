import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, AlertCircle, Clock, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../../services/api';
import { extractData } from '../../utils/dataHelpers';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [recentPending, setRecentPending] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, totalAmount: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiClient.get('/expenses');
        // Extraire les données correctement avec extractData
        const expenses = extractData(data);
        
        // Vérifier que c'est un tableau
        if (!Array.isArray(expenses)) {
          console.error('Les dépenses ne sont pas un tableau:', expenses);
          setError("Format de données invalide.");
          setLoading(false);
          return;
        }

        // Calcul des statistiques
        const pending = expenses.filter(e => e.status === 'En attente').length;
        const approved = expenses.filter(e => e.status === 'Approuvée').length;
        const rejected = expenses.filter(e => e.status === 'Rejeté').length;
        const totalAmount = expenses.filter(e => e.status === 'Approuvée').reduce((sum, e) => sum + (e.amount || 0), 0);

        setStats({ pending, approved, rejected, totalAmount });

        // Dernières demandes en attente (max 5)
        const pendingExpenses = expenses.filter(e => e.status === 'En attente').slice(0, 5);
        setRecentPending(pendingExpenses);

        // Construire les données du graphique par mois
        const monthly = {};
        expenses.forEach(e => {
          try {
            const date = new Date(e.date);
            const label = date.toLocaleDateString('fr-FR', { month: 'short' });
            if (!monthly[label]) monthly[label] = 0;
            monthly[label] += e.amount || 0;
          } catch (err) {
            console.warn('Erreur de date:', err);
          }
        });
        setChartData(Object.entries(monthly).map(([name, Dépenses]) => ({ 
          name, 
          Dépenses: Math.round(Dépenses) 
        })));
      } catch (err) {
        console.error("Erreur ManagerDashboard:", err);
        setError(err.response?.data?.message || "Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpiCards = [
    { label: "À valider", count: loading ? '...' : `${stats.pending} demandes`, sub: "En attente de votre décision", icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/10" },
    { label: "Validées", count: loading ? '...' : `${stats.approved} notes`, sub: "Approuvées par vous", icon: CheckSquare, color: "text-green-400 bg-green-500/10 border-green-500/10" },
    { label: "Refusées", count: loading ? '...' : `${stats.rejected} requêtes`, sub: "Corrections requises", icon: AlertCircle, color: "text-red-400 bg-red-500/10 border-red-500/10" },
    { label: "Total approuvé", count: loading ? '...' : `${stats.totalAmount.toFixed(2)} €`, sub: "Montant cumulé approuvé", icon: TrendingUp, color: "text-[#FF6B2C] bg-[#FF6B2C]/10 border-[#FF6B2C]/10" },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <AlertTriangle className="mr-2" size={20} /> {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. EN-TÊTE */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Responsable</h1>
          <p className="text-slate-400 text-xs mt-1">Supervisez les engagements financiers et pilotez les validations de votre équipe.</p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-[#111C2E] border border-slate-800 px-4 py-2 rounded-xl">
          Pôle d'approbation : <span className="text-[#FF6B2C]">Toutes les équipes</span>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
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

      {/* 3. GRAPHIQUE DES DÉPENSES */}
      {chartData.length > 0 && (
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-[#FF6B2C]" />
              Évolution des dépenses soumises
            </h2>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Valeurs en EUR (€)</span>
          </div>
          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B2C" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF6B2C" stopOpacity={0} />
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
      )}

      {/* 4. DERNIÈRES DEMANDES EN ATTENTE */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={14} /> Chargement...
                    </div>
                  </td>
                </tr>
              ) : recentPending.length > 0 ? (
                recentPending.map((row) => (
                  <tr key={row._id} className="hover:bg-[#0B131F]/30 transition-colors">
                    <td className="py-3 font-semibold text-white">{row.userId?.name || 'Inconnu'}</td>
                    <td className="py-3 text-slate-400 font-mono">
                      {row.date ? new Date(row.date).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-[#1A263B] text-slate-300 border border-slate-800/50">
                        {row.category || 'Non catégorisé'}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold font-mono text-white">
                      {(row.amount || 0).toFixed(2)} {row.currency || '€'}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate(`/validation/detail/${row._id}`)}
                        className="text-[#FF6B2C] hover:text-white font-bold transition-colors cursor-pointer"
                      >
                        Traiter →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-500">Aucune demande en attente ✅</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}