import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Server, Activity, ShieldAlert, ArrowRight, Database, RefreshCw, Trash2, Cpu } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [backupStatus, setBackupStatus] = useState('Dernière sauvegarde : Aujourd\'hui 04:00');
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleBackup = () => {
    setIsBackingUp(true);
    setBackupStatus('Sauvegarde en cours...');
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupStatus('Sauvegarde réussie ! à ' + new Date().toLocaleTimeString());
    }, 2000);
  };

  const systemStats = [
    { label: "Utilisateurs Actifs", value: "148 comptes", sub: "4 rôles configurés", icon: Users, color: "text-[#FF6B2C] bg-[#FF6B2C]/10 border-[#FF6B2C]/10" },
    { label: "Flux Total Traité", value: "24,580.00 €", sub: "312 demandes soumises", icon: Server, color: "text-green-400 bg-green-500/10 border-green-500/10" },
    { label: "Événements Systèmes", value: "1,204 logs", sub: "0 anomalie critique", icon: Activity, color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/10" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Panneau d'Administration</h1>
        <p className="text-slate-400 text-xs mt-1">Supervision de l'infrastructure logicielle, contrôle des accès et intégrité des données.</p>
      </div>

      {/* Cartes KPI d'Infrastructure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {systemStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
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

      {/* État du Serveur et Actions d'Administration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Serveur (Prend 2 colonnes) */}
        <div className="lg:col-span-2 bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu size={16} className="text-[#FF6B2C]" />
            Santé et performance du noyau système
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* CPU */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-400 font-mono">
                <span>Charge processeur CPU</span>
                <span className="text-white font-bold">12%</span>
              </div>
              <div className="w-full h-2 bg-[#0B131F] rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-green-500 rounded-full w-[12%]"></div>
              </div>
            </div>

            {/* RAM */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-400 font-mono">
                <span>Mémoire Vive active</span>
                <span className="text-white font-bold">42%</span>
              </div>
              <div className="w-full h-2 bg-[#0B131F] rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-green-500 rounded-full w-[42%]"></div>
              </div>
            </div>

            {/* DB */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-400 font-mono">
                <span>Latence Base de données</span>
                <span className="text-white font-bold">18 ms</span>
              </div>
              <div className="w-full h-2 bg-[#0B131F] rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-[#FF6B2C] rounded-full w-[18%]"></div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-[#0B131F]/50 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">Statut des services</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                Opérationnel
              </span>
            </div>
          </div>
        </div>

        {/* Actions Rapides Système */}
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database size={16} className="text-[#FF6B2C]" />
              Maintenance Base
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={handleBackup}
                disabled={isBackingUp}
                className="w-full bg-[#1A263B] hover:bg-[#FF6B2C] hover:text-white text-slate-300 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} className={isBackingUp ? "animate-spin" : ""} />
                Sauvegarde Immédiate
              </button>
              
              <button 
                className="w-full bg-[#1A263B] text-slate-300 hover:text-red-400 text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 size={14} />
                Vider les caches logs
              </button>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 mt-4 text-center">
            {backupStatus}
          </div>
        </div>

      </div>

      {/* Raccourci d'audit critique */}
      <div className="bg-[#1A263B]/30 border border-slate-800/80 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Journal d'audit de sécurité opérationnel</h4>
            <p className="text-xs text-slate-400">Suivez en continu les connexions suspectes, les changements de privilèges de rôle et l'historique des modifications critiques.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/admin/audit')}
          className="bg-[#1A263B] hover:bg-muko-orange hover:text-white text-slate-300 text-xs font-bold py-2.5 px-5 rounded-xl border border-slate-800 transition-all flex items-center gap-2 cursor-pointer"
        >
          Inspecter les logs <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}