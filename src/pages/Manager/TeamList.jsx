import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, ArrowRight, Search, Briefcase, Loader2, AlertTriangle, UserCheck, UserX } from 'lucide-react';
import apiClient from '../../services/api';

export default function TeamList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tous');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await apiClient.get('/users');
        // Filtrer pour ne garder que les employés (pas les managers, admins, etc.)
        const employees = data.filter(u => u.role === 'Employe');
        setTeamMembers(employees);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'équipe.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      (member.team || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'Tous' || member.team === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Statistiques
  const totalMembers = teamMembers.length;
  const departments = [...new Set(teamMembers.map(m => m.team).filter(Boolean))];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mon équipe</h1>
          <p className="text-slate-400 text-xs mt-1">Liste des collaborateurs rattachés à votre pôle d'approbation.</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 bg-[#111C2E] border border-slate-800 px-4 py-2 rounded-xl">
          <Users size={14} className="text-[#FF6B2C]" />
          {loading ? '...' : totalMembers} collaborateurs
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Total équipe</span>
            <p className="text-xl font-black text-white font-mono">{loading ? '...' : totalMembers}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Départements</span>
            <p className="text-xl font-black text-white font-mono">{departments.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
            <Briefcase size={18} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Actifs</span>
            <p className="text-xl font-black text-green-400 font-mono">{loading ? '...' : totalMembers}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
            <UserCheck size={18} />
          </div>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un collaborateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A263B] text-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-[#FF6B2C]/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['Tous', ...departments].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-[#FF6B2C] text-white border-transparent'
                    : 'bg-[#1A263B] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Grille de cartes */}
        {loading ? (
          <div className="text-center py-10 text-slate-500">
            <Loader2 className="inline-block animate-spin mr-2" size={20} />
            Chargement...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-400">
            <AlertTriangle className="inline-block mr-2" size={16} />
            {error}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <UserX size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="font-medium">Aucun collaborateur trouvé</p>
            <p className="text-xs text-slate-600 mt-1">Ajustez vos filtres de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredMembers.map((user) => (
              <div
                key={user._id}
                className="bg-[#1A263B]/40 border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/80 transition-all group cursor-pointer"
                onClick={() => navigate(`/equipe/collaborateur/${user._id}`)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/15 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-[#FF6B2C] transition-colors">
                      {user.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                      <Mail size={10} /> {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1A263B] text-slate-400 border border-slate-800">
                        {user.team || 'Non assigné'}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        Actif
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-[#FF6B2C] transition-colors shrink-0 mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredMembers.length > 0 && (
          <div className="pt-4 border-t border-slate-800/60 text-xs text-slate-500">
            Affichage de {filteredMembers.length} collaborateur{filteredMembers.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}