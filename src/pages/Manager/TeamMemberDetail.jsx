import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, BarChart } from 'lucide-react';

export default function TeamMemberDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={14} /> Retour à l'équipe
      </button>

      <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-8 max-w-3xl space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800/60">
          <div className="w-14 h-14 rounded-2xl bg-[#1A263B] border border-slate-800 flex items-center justify-center text-muko-orange"><User size={26} /></div>
          <div>
            <h2 className="text-lg font-bold text-white">Fiche d'activité de l'agent</h2>
            <p className="text-xs text-slate-500 mt-0.5">Identifiant unique système : <span className="font-mono text-slate-400">{id || "USR-01"}</span></p>
          </div>
        </div>

        {/* Bloc analytique rapide */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#0B131F]/40 border border-slate-800 p-4 rounded-xl">
            <span className="text-[9px] font-mono uppercase text-slate-500">Département d'affectation</span>
            <p className="text-xs font-bold text-white mt-1">Technique & Innovation</p>
          </div>
          <div className="bg-[#0B131F]/40 border border-slate-800 p-4 rounded-xl">
            <span className="text-[9px] font-mono uppercase text-slate-500">Plafond mensuel de dépenses accordé</span>
            <p className="text-xs font-bold text-green-400 mt-1">2,500.00 € / mois</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white flex items-center gap-2"><BarChart size={14} className="text-muko-orange" /> Note de cadrage</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cet utilisateur est autorisé à imputer ses notes sur les enveloppes budgétaires des projets d'infrastructure validés. Aucun incident de conformité sur ses justificatifs n'a été répertorié au cours de l'exercice fiscal actuel.
          </p>
        </div>
      </div>
    </div>
  );
}