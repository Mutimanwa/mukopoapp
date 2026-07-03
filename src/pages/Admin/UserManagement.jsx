import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Edit2, Shield, MoreVertical, Search, ShieldCheck, Users, Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '../../services/api';

export default function UserManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('Tous');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await apiClient.get('/users');
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les utilisateurs.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(search.toLowerCase()) ||
      account.email.toLowerCase().includes(search.toLowerCase());
    // Normaliser notre selectedRole pour MongoDB.
    const normalizedSelectedRole = selectedRole === 'Employé' ? 'Employe' : selectedRole;
    const matchesRole = selectedRole === 'Tous' || account.role === normalizedSelectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-slate-400 text-xs mt-1">Créez, modifiez et contrôlez les autorisations d'accès aux profils salariés.</p>
        </div>
        <button
          onClick={() => navigate('/admin/utilisateurs/creer')}
          className="bg-muko-orange hover:bg-opacity-90 text-white text-xs font-bold py-3 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-muko-orange/10 transition-all active:scale-[0.98] cursor-pointer"
        >
          <UserPlus size={14} /> Ajouter un utilisateur
        </button>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Total comptes</span>
            <p className="text-xl font-black text-white font-mono">{loading ? '...' : users.length} comptes</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>

        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Comptes Actifs</span>
            <p className="text-xl font-black text-green-400 font-mono">3 actifs</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
        </div>

        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Invitations en attente</span>
            <p className="text-xl font-black text-white font-mono">1 invitation</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-400 flex items-center justify-center">
            <UserPlus size={18} />
          </div>
        </div>
      </div>

      {/* Barre d'outils et recherche */}
      <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, pôle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A263B] text-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['Tous', 'Employé', 'Manager', 'Finance'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${selectedRole === role
                  ? 'bg-muko-orange text-white border-transparent'
                  : 'bg-[#1A263B] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                <th className="pb-3 px-4">Identifiant / Nom</th>
                <th className="pb-3 px-4">Email</th>
                <th className="pb-3 px-4">Département</th>
                <th className="pb-3 px-4">Privilège</th>
                <th className="pb-3 px-4">Statut</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Chargement des utilisateurs...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-red-400">
                    <div className="flex justify-center items-center gap-2">
                      <AlertTriangle size={16} />
                      {error}
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((account) => (
                  <tr key={account._id} className="hover:bg-[#0B131F]/30 transition-colors">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muko-orange/5 border border-muko-orange/15 text-[#FF6B2C] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {account.name.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{account.name}</div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">{account._id.substring(account._id.length - 6)}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400">{account.email}</td>
                    <td className="py-4 px-4 text-slate-400 font-medium">{account.team || "Non classifié"}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${account.role === 'Manager' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                        account.role === 'Finance' ? 'bg-green-500/5 border-green-500/20 text-green-400' :
                          'bg-[#1A263B] border-slate-800 text-slate-300'
                        }`}>
                        {account.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold border bg-green-500/10 text-green-400 border-green-500/20">
                        Actif
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/utilisateurs/modifier/${account._id}`)}
                        className="p-2 bg-[#1A263B] text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
                        title="Modifier l'utilisateur"
                      >
                        <Edit2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}