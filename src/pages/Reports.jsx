import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Calendar, DownloadCloud, TrendingUp, AlertTriangle, FileText, Loader2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { extractData } from '../utils/dataHelpers';

const CATEGORY_COLORS = {
  'Restauration': '#FF6B2C',
  'Transport': '#3B82F6',
  'Hébergement': '#10B981',
  'Fournitures': '#8B5CF6',
  'Carburant': '#F59E0B',
  'Autre': '#64748B'
};

export default function Reports() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiClient.get('/expenses');
        // Extraire les données correctement
        const expensesData = extractData(data);
        
        // Vérifier que c'est un tableau
        if (!Array.isArray(expensesData)) {
          console.error('Les dépenses ne sont pas un tableau:', expensesData);
          setError("Format de données invalide.");
          setLoading(false);
          return;
        }

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

  // Filtrer par période - avec vérification que expenses est un tableau
  const getFilteredExpenses = () => {
    const expensesArray = Array.isArray(expenses) ? expenses : [];
    const now = new Date();
    
    return expensesArray.filter(e => {
      try {
        const date = new Date(e.date);
        if (period === 'month') {
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }
        if (period === 'quarter') {
          const quarter = Math.floor(now.getMonth() / 3);
          return Math.floor(date.getMonth() / 3) === quarter && date.getFullYear() === now.getFullYear();
        }
        return true;
      } catch (err) {
        console.warn('Erreur de date:', err);
        return false;
      }
    });
  };

  const filteredExpenses = getFilteredExpenses();

  // Données pour le graphique par catégorie
  const categoryData = filteredExpenses.reduce((acc, exp) => {
    const cat = exp.category || 'Autre';
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += exp.amount || 0;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  // Données pour le graphique par mois
  const monthlyData = filteredExpenses.reduce((acc, exp) => {
    try {
      const month = new Date(exp.date).toLocaleString('fr-FR', { month: 'short' });
      if (!acc[month]) acc[month] = 0;
      acc[month] += exp.amount || 0;
    } catch (err) {
      console.warn('Erreur de date:', err);
    }
    return acc;
  }, {});

  const barData = Object.entries(monthlyData).map(([name, value]) => ({
    name,
    Dépenses: Math.round(value)
  }));

  // Statistiques
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalCount = filteredExpenses.length;
  const avgAmount = totalCount > 0 ? totalAmount / totalCount : 0;

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
      <Loader2 className="animate-spin" size={20} /> Chargement des rapports...
    </div>
  );

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Rapports & Analyses</h1>
          <p className="text-slate-400 text-xs mt-1">Visualisez la répartition et l'efficacité de vos budgets.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#1A263B] border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                period === 'all' ? 'bg-[#FF6B2C] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                period === 'month' ? 'bg-[#FF6B2C] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setPeriod('quarter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                period === 'quarter' ? 'bg-[#FF6B2C] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Trimestre
            </button>
          </div>
          <button className="bg-[#FF6B2C] hover:bg-opacity-90 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all cursor-pointer">
            <DownloadCloud size={14} /> Exporter
          </button>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Total dépenses</span>
            <p className="text-xl font-black text-[#FF6B2C] font-mono">{totalAmount.toFixed(2)} €</p>
            <span className="text-[10px] text-slate-500">{totalCount} transactions</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/15 text-[#FF6B2C] flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Moyenne par note</span>
            <p className="text-xl font-black text-white font-mono">{avgAmount.toFixed(2)} €</p>
            <span className="text-[10px] text-slate-500">Montant moyen</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 flex items-center justify-center">
            <BarChart size={18} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Catégories</span>
            <p className="text-xl font-black text-white font-mono">{Object.keys(categoryData).length}</p>
            <span className="text-[10px] text-slate-500">Types de dépenses</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
            <FileText size={18} />
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique en barres (2 colonnes) */}
        <div className="lg:col-span-2 bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white">Dépenses par mois</h2>
            <span className="text-[10px] font-mono text-slate-500">Valeurs en €</span>
          </div>
          {barData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500">
              Aucune donnée disponible
            </div>
          ) : (
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A263B" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111C2E', borderColor: '#1A263B', borderRadius: '12px' }}
                    itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
                  />
                  <Bar dataKey="Dépenses" fill="#FF6B2C" radius={[4, 4, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Graphique en camembert (1 colonne) */}
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex flex-col">
          <h2 className="text-sm font-bold text-white mb-4">Répartition par catégorie</h2>
          {pieData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Aucune donnée
            </div>
          ) : (
            <>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#64748B'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111C2E', borderColor: '#1A263B', borderRadius: '12px' }}
                      itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
                      formatter={(value) => [`${value} €`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-4">
                {pieData.map((item, idx) => {
                  const percentage = totalAmount > 0 ? Math.round((item.value / totalAmount) * 100) : 0;
                  return (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#64748B' }} />
                      <span className="text-slate-400 truncate">{item.name}</span>
                      <span className="font-mono font-bold text-white ml-auto">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Alertes et insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111C2E] border border-red-500/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider font-semibold">Alerte</span>
              <h3 className="text-sm font-bold text-white mt-1">Dépassement détecté</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Les dépenses de la catégorie <span className="text-white font-semibold">Hébergement</span> ont dépassé le seuil recommandé de <span className="text-red-400 font-mono">+15%</span> ce mois-ci.
          </p>
          <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer">
            Analyser les détails
          </button>
        </div>

        <div className="bg-[#111C2E] border border-green-500/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider font-semibold">Insight</span>
              <h3 className="text-sm font-bold text-white mt-1">Optimisation possible</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Réduction de <span className="text-green-400 font-mono font-semibold">-8.5%</span> sur les frais de transport. Continuez à promouvoir le covoiturage.
          </p>
          <button className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer">
            Voir les recommandations
          </button>
        </div>
      </div>
    </div>
  );
}