import { useNavigate } from 'react-router-dom';
import { Users, Mail, ArrowRight, Shield } from 'lucide-react';

export default function TeamList() {
  const navigate = useNavigate();

  const members = [
    { id: "USR-01", name: "Alain Ndikumana", email: "alain.n@mukopo.com", role: "Ingénieur Réseau", spent: "1,240.00 €" },
    { id: "USR-02", name: "Bella Inamahoro", email: "bella.i@mukopo.com", role: "UI/UX Designer", spent: "320.50 €" },
    { id: "USR-03", name: "Safi Kibasomba", email: "safi.k@mukopo.com", role: "Développeur Full-Stack", spent: "2,150.00 €" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Mes collaborateurs</h1>
        <p className="text-slate-400 text-xs mt-1">Liste des membres rattachés à votre pôle d'approbation budgétaire.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((user) => (
          <div key={user.id} className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between group hover:border-slate-700/80 transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muko-orange/5 text-muko-orange border border-muko-orange/10 flex items-center justify-center font-bold text-xs uppercase">{user.name.substring(0,2)}</div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono"><Mail size={12} className="text-slate-600" />{user.email}</div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/40 flex items-center justify-between">
              <div><p className="text-[9px] text-slate-500 uppercase font-mono">Total Remboursé</p><p className="text-xs font-bold font-mono text-white mt-0.5">{user.spent}</p></div>
              <button 
                onClick={() => navigate(`/equipe/collaborateur/${user.id}`)}
                className="text-[11px] font-bold text-muko-orange flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                Fiche profil <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}