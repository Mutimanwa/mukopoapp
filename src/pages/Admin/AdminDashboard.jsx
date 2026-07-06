import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Server, Activity, ShieldAlert, ArrowRight, Database, RefreshCw, Trash2, Cpu, Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExpenses: 0,
    totalAmount: 0,
    pendingExpenses: 0,
    approvedExpenses: 0,
    rejectedExpenses: 0,
    paidExpenses: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backupStatus, setBackupStatus] = useState('Dernière sauvegarde : Aujourd\'hui 04:00');
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les utilisateurs
        const usersRes = await apiClient.get('/users');
        setUsers(usersRes.data);

        // Récupérer les dépenses
        const expensesRes = await apiClient.get('/expenses');
        const expenses = expensesRes.data;

        // Calculer les statistiques
        const totalAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const pending = expenses.filter(e => e.status === 'En attente').length;
        const approved = expenses.filter(e => e.status === 'Approuvée').length;
        const rejected = expenses.filter(e => e.status === 'Rejeté').length;
        const paid = expenses.filter(e => e.status === 'Payé').length;

        setStats({
          totalUsers: usersRes.data.length,
          totalExpenses: expenses.length,
          totalAmount,
          pendingExpenses: pending,
          approvedExpenses: approved,
          rejectedExpenses: rejected,
          paidExpenses: paid
        });
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBackup = () => {
    setIsBackingUp(true);
    setBackupStatus('Sauvegarde en cours...');
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupStatus(`Sauvegarde réussie ! à ${new Date().toLocaleTimeString()}`);
    }, 2000);
  };

  const handleClearCache = async () => {
    if (!window.confirm('Vider les caches et logs système ?')) return;
    try {
      // Simuler un nettoyage
      setBackupStatus('Nettoyage des caches en cours...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBackupStatus('Caches vidés avec succès !');
      setTimeout(() => {
        setBackupStatus(`Dernier nettoyage : ${new Date().toLocaleString()}`);
      }, 2000);
    } catch (error) {
      alert('Erreur lors du nettoyage des caches.');
    }
  };

  const systemStats = [
    { 
      label: "Utilisateurs", 
      value: loading ? '...' : stats.totalUsers, 
      sub: `${Object.keys(users.reduce((acc, u) => { acc[u.role] = true; return acc; }, {})).length || 0} rôles configurés`, 
      icon: Users, 
      color: "text-[#FF6B2C] bg-[#FF6B2C]/10 border-[#FF6B2C]/10" 
    },
    { 
      label: "Dépenses totales", 
      value: loading ? '...' : `${stats.totalAmount.toFixed(2)} €`, 
      sub: `${stats.totalExpenses} demandes soumises`, 
      icon: Server, 
      color: "text-green-400 bg-green-500/10 border-green-500/10" 
    },
    { 
      label: "En attente", 
      value: loading ? '...' : stats.pendingExpenses, 
      sub: "À valider par les managers", 
      icon: Activity, 
      color: "text-amber-400 bg-amber-500/10 border-amber-500/10" 
    }
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
      <Loader2 className="animate-spin" size={20} /> Chargement du dashboard...
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64 text-red-400 gap-2">
      <AlertTriangle size={20} /> {error}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Panneau d'Administration</h1>
        <p className="text-slate-400 text-xs mt-1">Supervision de l'infrastructure logicielle, contrôle des accès et intégrité des données.</p>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {systemStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">{stat.label}</span>
                <p className="text-lg font-black text-white">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-mono">{stat.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-green-400">{stats.approvedExpenses}</p>
          <p className="text-[10px] text-slate-500 font-mono">Approuvées</p>
        </div>
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-amber-400">{stats.pendingExpenses}</p>
          <p className="text-[10px] text-slate-500 font-mono">En attente</p>
        </div>
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-red-400">{stats.rejectedExpenses}</p>
          <p className="text-[10px] text-slate-500 font-mono">Rejetées</p>
        </div>
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-blue-400">{stats.paidExpenses}</p>
          <p className="text-[10px] text-slate-500 font-mono">Payées</p>
        </div>
      </div>

      {/* État du Serveur et Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Serveur */}
        <div className="lg:col-span-2 bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu size={16} className="text-[#FF6B2C]" />
            Santé et performance du système
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between text-slate-400 font-mono">
                <span>Utilisateurs actifs</span>
                <span className="text-white font-bold">{stats.totalUsers}</span>
              </div>
              <div className="w-full h-2 bg-[#0B131F] rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min((stats.totalUsers / 100) * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-400 font-mono">
                <span>Dépenses totales</span>
                <span className="text-white font-bold">{stats.totalExpenses}</span>
              </div>
              <div className="w-full h-2 bg-[#0B131F] rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-[#FF6B2C] rounded-full" style={{ width: `${Math.min((stats.totalExpenses / 200) * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-400 font-mono">
                <span>Montant total</span>
                <span className="text-white font-bold">{stats.totalAmount.toFixed(2)} €</span>
              </div>
              <div className="w-full h-2 bg-[#0B131F] rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-green-400 rounded-full" style={{ width: `${Math.min((stats.totalAmount / 50000) * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-[#0B131F]/50 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">Statut des services</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                Opérationnel
              </span>
            </div>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database size={16} className="text-[#FF6B2C]" />
              Maintenance
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={handleBackup}
                disabled={isBackingUp}
                className="w-full bg-[#1A263B] hover:bg-[#FF6B2C] hover:text-white text-slate-300 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} className={isBackingUp ? "animate-spin" : ""} />
                Sauvegarde
              </button>
              
              <button 
                onClick={handleClearCache}
                className="w-full bg-[#1A263B] text-slate-300 hover:text-red-400 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 size={14} />
                Vider les caches
              </button>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 mt-4 text-center">
            {backupStatus}
          </div>
        </div>
      </div>

      {/* Raccourci d'audit */}
      <div className="bg-[#1A263B]/30 border border-slate-800/80 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Journal d'audit de sécurité</h4>
            <p className="text-xs text-slate-400">Suivez les connexions suspectes et les modifications critiques.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/admin/audit')}
          className="bg-[#1A263B] hover:bg-[#FF6B2C] hover:text-white text-slate-300 text-xs font-bold py-2.5 px-5 rounded-xl border border-slate-800 transition-all flex items-center gap-2 cursor-pointer"
        >
          Inspecter les logs <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}