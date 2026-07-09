import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, AlertCircle, CheckCircle2, ArrowRight, Activity, Loader2, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../../services/api';
import { extractData } from '../../utils/dataHelpers';

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pendingTotal: 0,
    paidTotal: 0,
    pendingCount: 0,
    paidCount: 0,
    pendingApproval: 0
  });
  const [chartData, setChartData] = useState([]);
  const [recentPayouts, setRecentPayouts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiClient.get('/expenses');
        const expenses = extractData(data);

        if (!Array.isArray(expenses)) {
          console.error('Les dépenses ne sont pas un tableau:', expenses);
          setError("Format de données invalide.");
          setLoading(false);
          return;
        }

        // Statistiques
        const pending = expenses.filter(e => e.status === 'Approuvée');
        const paid = expenses.filter(e => e.status === 'Payé');
        const pendingApproval = expenses.filter(e => e.status === 'En attente');

        const pendingTotal = pending.reduce((sum, e) => sum + (e.amount || 0), 0);
        const paidTotal = paid.reduce((sum, e) => sum + (e.amount || 0), 0);

        setStats({
          pendingTotal,
          paidTotal,
          pendingCount: pending.length,
          paidCount: paid.length,
          pendingApproval: pendingApproval.length
        });

        // Données du graphique par mois
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

        const chartDataArray = Object.entries(monthly).map(([name, value]) => ({
          name,
          Décaissements: Math.round(value)
        }));

        // Trier par ordre chronologique
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        chartDataArray.sort((a, b) => months.indexOf(a.name) - months.indexOf(b.name));
        setChartData(chartDataArray);

        // Derniers paiements (max 3)
        const recent = paid.slice(0, 3).map(exp => ({
          ref: `REM-${exp._id.substring(exp._id.length - 6).toUpperCase()}`,
          name: exp.userId?.name || 'Inconnu',
          date: new Date(exp.updatedAt || exp.date).toLocaleDateString('fr-FR'),
          method: 'Virement',
          amount: `${(exp.amount || 0).toFixed(2)} ${exp.currency || '€'}`
        }));
        setRecentPayouts(recent);

      } catch (err) {
        console.error('Erreur fetchData:', err);
        setError(err.response?.data?.message || "Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Stats cards dynamiques
  const statsCards = [
    { 
      label: "À rembourser (Approuvé)", 
      total: loading ? '...' : `${stats.pendingTotal.toFixed(2)} €`, 
      count: loading ? '...' : `${stats.pendingCount} ordres en attente`, 
      icon: Landmark, 
      color: "text-[#FF6B2C] bg-[#FF6B2C]/10 border-[#FF6B2C]/10" 
    },
    { 
      label: "Décaissé ce mois", 
      total: loading ? '...' : `${stats.paidTotal.toFixed(2)} €`, 
      count: loading ? '...' : `${stats.paidCount} ordres payés`, 
      icon: CheckCircle2, 
      color: "text-green-400 bg-green-500/10 border-green-500/10" 
    },
    { 
      label: "En attente d'arbitrage", 
      total: loading ? '...' : `${stats.pendingApproval} requêtes`, 
      count: loading ? '...' : 'À valider par les managers', 
      icon: AlertCircle, 
      color: "text-amber-400 bg-amber-500/10 border-amber-500/10" 
    }
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400 gap-2">
        <AlertTriangle size={20} /> {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Finance</h1>
          <p className="text-slate-400 text-xs mt-1">Gérez la trésorerie opérationnelle, validez les paiements et suivez les flux comptables.</p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-[#111C2E] border border-slate-800 px-4 py-2 rounded-xl">
          Devise principale : <span className="text-[#FF6B2C]">EUR (€)</span>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
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
        <div className="lg:col-span-2 bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-[#FF6B2C]" />
              Courbe des décaissements mensuels
            </h2>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Flux comptables</span>
          </div>

          {loading ? (
            <div className="h-60 flex items-center justify-center text-slate-500">
              <Loader2 className="animate-spin mr-2" size={20} /> Chargement...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-slate-500">
              Aucune donnée disponible
            </div>
          ) : (
            <div className="h-60 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                    formatter={(value) => [`${value} €`, 'Décaissements']}
                  />
                  <Area type="monotone" dataKey="Décaissements" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorPayout)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Derniers virements archivés (Prend 1 colonne) */}
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Derniers règlements</h3>
            {loading ? (
              <div className="text-center py-4 text-slate-500">
                <Loader2 className="animate-spin" size={16} />
              </div>
            ) : recentPayouts.length === 0 ? (
              <div className="text-center py-4 text-slate-500 text-xs">
                Aucun paiement récent
              </div>
            ) : (
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
            )}
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
          <h4 className="text-sm font-bold text-white">
            {stats.pendingCount > 0 
              ? `${stats.pendingCount} ordres de virements en attente de signature SEPA`
              : 'Aucun virement en attente'}
          </h4>
          <p className="text-xs text-slate-400">
            {stats.pendingCount > 0 
              ? 'Remboursez vos employés pour les frais qu\'ils ont engagés. Les dossiers sont validés et prêts pour paiement.'
              : 'Tous les remboursements ont été traités.'}
          </p>
        </div>
        <button 
          onClick={() => navigate('/finance/traiter')}
          disabled={stats.pendingCount === 0}
          className={`text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            stats.pendingCount > 0
              ? 'bg-[#FF6B2C] hover:bg-opacity-90 text-white shadow-lg shadow-[#FF6B2C]/10'
              : 'bg-[#1A263B] text-slate-500 cursor-not-allowed border border-slate-800'
          }`}
        >
          Exécuter les remboursements <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}