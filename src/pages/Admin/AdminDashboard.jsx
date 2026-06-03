import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Server, Activity, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const systemStats = [
    { label: "Utilisateurs Actifs", value: "148 comptes", sub: "4 rôles configurés", icon: Users, color: "text-muko-orange bg-muko-orange/10 border-muko-orange/10" },
    { label: "Flux Total Traité", value: "24,580.00 €", sub: "312 demandes soumises", icon: Server, color: "text-green-400 bg-green-500/10 border-green-500/10" },
    { label: "Événements Systèmes", value: "1,204 logs", sub: "0 anomalie critique", icon: Activity, color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/10" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
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