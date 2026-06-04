import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, ArrowRight, Search, Landmark, ShieldCheck } from 'lucide-react';

const initialMembers = [
  { id: "USR-01", name: "Alain Ndikumana", email: "alain.n@mukopo.com", role: "Ingénieur Réseau", dept: "Infras", spent: "1240.00", limit: "2500.00", pendingCount: 1 },
  { id: "USR-02", name: "Bella Inamahoro", email: "bella.i@mukopo.com", role: "UI/UX Designer", dept: "Design", spent: "320.50", limit: "1500.00", pendingCount: 1 },
  { id: "USR-03", name: "Safi Kibasomba", email: "safi.k@mukopo.com", role: "Développeur Full-Stack", dept: "R&D", spent: "2150.00", limit: "3000.00", pendingCount: 0 },
];

export default function TeamList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tous');

  const filteredMembers = initialMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) || 
                          member.role.toLowerCase().includes(search.toLowerCase()) ||
                          member.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'Tous' || member.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mes collaborateurs</h1>
          <p className="text-slate-400 text-xs mt-1">Liste des membres rattachés à votre pôle d'approbation budgétaire.</p>
        </div>
      </div>

      {/* Barre d'actions (Recherche + Filtres) */}
      <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Recherche */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Rechercher un collaborateur..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A263B] text-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors"
          />
        </div>

        {/* Filtres de Département */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['Tous', 'R&D', 'Infras', 'Design'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                selectedDept === dept 
                  ? 'bg-muko-orange text-white border-transparent' 
                  : 'bg-[#1A263B] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((user) => {
            const spentPercent = (parseFloat(user.spent) / parseFloat(user.limit)) * 100;
            return (
              <div key={user.id} className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between group hover:border-slate-700/80 transition-all space-y-6">
                
                {/* Header Carte */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muko-orange/10 text-muko-orange border border-muko-orange/15 flex items-center justify-center font-bold text-xs uppercase">
                        {user.name.substring(0, 2)}
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-[#FF6B2C] transition-colors">{user.name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">{user.role}</p>
                      </div>
                    </div>

                    {user.pendingCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse">
                        {user.pendingCount} en attente
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono pt-1">
                    <Mail size={12} className="text-slate-600 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>

                {/* Barre de budget */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/40">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Limite budget mensuel</span>
                    <span className="text-white font-semibold">
                      {parseFloat(user.spent).toFixed(0)} / {parseFloat(user.limit).toFixed(0)} €
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0B131F] rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        spentPercent > 85 ? 'bg-red-500' : spentPercent > 60 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(spentPercent, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Footer Carte */}
                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase font-mono">Département</p>
                    <p className="text-xs font-bold text-white mt-0.5">{user.dept}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/equipe/collaborateur/${user.id}`)}
                    className="text-[11px] font-bold text-[#FF6B2C] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    Fiche profil <ArrowRight size={12} />
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium">
            Aucun collaborateur correspondant aux filtres.
          </div>
        )}
      </div>
    </div>
  );
}