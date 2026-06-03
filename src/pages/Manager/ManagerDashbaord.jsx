import { useNavigate } from 'react-router-dom';
import { CheckSquare, AlertCircle, Clock, TrendingUp, Users } from 'lucide-react';

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "À valider", count: "12 demandes", icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/10" },
    { label: "Validées ce mois", count: "48 notes", icon: CheckSquare, color: "text-green-400 bg-green-500/10 border-green-500/10" },
    { label: "Refusées / Corrections", count: "3 requêtes", icon: AlertCircle, color: "text-red-400 bg-red-500/10 border-red-500/10" },
    { label: "Budget Équipe Consommé", count: "8,450.00 €", icon: TrendingUp, color: "text-muko-orange bg-muko-orange/10 border-muko-orange/10" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Responsable</h1>
        <p className="text-slate-400 text-xs mt-1">Supervisez les engagements financiers et pilotez les validations de votre équipe.</p>
      </div>

      {/* Grille d'indicateurs rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">{stat.label}</span>
                <p className="text-lg font-black text-white">{stat.count}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Raccourci vers l'action principale */}
      <div className="bg-[#1A263B]/30 border border-slate-800/80 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Des notes de frais attendent votre arbitrage
          </h4>
          <p className="text-xs text-slate-400">12 collaborateurs ont soumis des justificatifs à vérifier pour traitement comptable.</p>
        </div>
        <button 
          onClick={() => navigate('/validation/attente')}
          className="bg-muko-orange hover:bg-opacity-90 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-muko-orange/10 cursor-pointer"
        >
          Ouvrir la file d'attente
        </button>
      </div>
    </div>
  );
}