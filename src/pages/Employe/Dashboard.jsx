import { useState, useEffect } from 'react';
import { ArrowUpRight, Wallet, CreditCard, RefreshCw, TrendingUp, Loader2, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { extractData } from '../../utils/dataHelpers';

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer toutes les dépenses de l'utilisateur
        const { data } = await apiClient.get('/expenses/myexpenses');
        // Extraire les données correctement avec extractData
        const expensesData = extractData(data);
        setExpenses(expensesData);
      } catch (err) {
        console.error('Erreur fetchData:', err);
        setError(err.response?.data?.message || "Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calcul des statistiques (avec vérification que expenses est un tableau)
  const totalSpent = Array.isArray(expenses) ? expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0) : 0;
  const pendingExpenses = Array.isArray(expenses) ? expenses.filter(e => e.status === 'En attente') : [];
  const pendingTotal = pendingExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const approvedTotal = Array.isArray(expenses) ? expenses.filter(e => e.status === 'Approuvée').reduce((sum, e) => sum + (e.amount || 0), 0) : 0;

  // Données pour le graphique (groupées par mois)
  const chartData = Array.isArray(expenses) ? expenses.reduce((acc, exp) => {
    try {
      const month = new Date(exp.date).toLocaleString('fr-FR', { month: 'short' });
      if (!acc[month]) acc[month] = 0;
      acc[month] += exp.amount || 0;
    } catch (e) {
      console.warn('Erreur de date:', e);
    }
    return acc;
  }, {}) : {};

  const chartDataArray = Object.entries(chartData).map(([name, value]) => ({
    name,
    Depenses: Math.round(value)
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <Loader2 className="animate-spin mr-2" size={20} /> Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <AlertTriangle className="mr-2" size={20} /> {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* 1. SECTION : En-tête de bienvenue */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tableau de bord</h1>
          <p className="text-slate-400 text-xs mt-1">Bonjour {user?.name || 'Utilisateur'}, voici l'état de vos dépenses.</p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-[#111C2E] border border-slate-800 px-4 py-2 rounded-xl">
          Mise à jour : <span className="text-[#FF6B2C]">Instantanée</span>
        </div>
      </div>

      {/* 2. SECTION : Cartes de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Dépensé</span>
            <h3 className="text-2xl font-bold text-white font-mono">{totalSpent.toFixed(2)} €</h3>
            <span className="text-[10px] text-green-400 flex items-center gap-1 font-mono opacity-70">
              <ArrowUpRight size={12} /> {expenses.length} notes
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 flex items-center justify-center text-[#FF6B2C]">
            <Wallet size={22} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">En Attente</span>
            <h3 className="text-2xl font-bold text-amber-400 font-mono">{pendingTotal.toFixed(2)} €</h3>
            <span className="text-[10px] text-slate-500 font-mono">{pendingExpenses.length} requêtes</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <RefreshCw size={22} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Approuvées</span>
            <h3 className="text-2xl font-bold text-green-400 font-mono">{approvedTotal.toFixed(2)} €</h3>
            <span className="text-[10px] text-slate-500 font-mono">Validées</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <CreditCard size={22} />
          </div>
        </div>

      </div>

      {/* 3. SECTION : Graphique central */}
      {chartDataArray.length > 0 && (
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#FF6B2C]" />
              <h2 className="text-sm font-semibold text-white">Évolution des dépenses</h2>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataArray} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="Depenses" stroke="#FF6B2C" strokeWidth={2} fillOpacity={1} fill="url(#colorDepenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. SECTION : Tableau des transactions récentes */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-white">Transactions récentes</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pt-1">Catégorie</th>
                <th className="pb-3 pt-1">Date</th>
                <th className="pb-3 pt-1 text-right">Montant</th>
                <th className="pb-3 pt-1 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {!Array.isArray(expenses) || expenses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-slate-500">Aucune transaction.</td>
                </tr>
              ) : (
                expenses.slice(0, 5).map((exp) => (
                  <tr key={exp._id} className="hover:bg-[#0B131F]/30 transition-colors group">
                    <td className="py-4 font-medium text-white">{exp.category || 'N/A'}</td>
                    <td className="py-4 text-slate-400">
                      {exp.date ? new Date(exp.date).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="py-4 text-right font-mono font-semibold text-slate-200">
                      {(exp.amount || 0).toFixed(2)} {exp.currency || '€'}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                        exp.status === 'Approuvée' || exp.status === 'Payé'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : exp.status === 'Rejeté'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        • {exp.status || 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}