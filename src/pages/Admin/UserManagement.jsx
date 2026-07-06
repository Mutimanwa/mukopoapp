import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Edit2, Shield, MoreVertical, Search, ShieldCheck, Users, Loader2, AlertTriangle, Trash2, Mail, User, Briefcase } from 'lucide-react';
import apiClient from '../../services/api';

export default function UserManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('Tous');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer définitivement ${name} ? Cette action est irréversible.`)) return;
    
    setDeleting(id);
    try {
      await apiClient.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de la suppression.");
    } finally {
      setDeleting(null);
    }
  };

  // Statistiques
  const totalUsers = users.length;
  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const filteredUsers = users.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(search.toLowerCase()) ||
      account.email.toLowerCase().includes(search.toLowerCase()) ||
      (account.team || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'Tous' || account.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'Manager': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'Finance': return 'bg-green-500/10 border-green-500/20 text-green-400';
      default: return 'bg-[#1A263B] border-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-slate-400 text-xs mt-1">Créez, modifiez et contrôlez les autorisations d'accès.</p>
        </div>
        <button
          onClick={() => navigate('/admin/utilisateurs/creer')}
          className="bg-[#FF6B2C] hover:bg-opacity-90 text-white text-xs font-bold py-3 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all active:scale-[0.98] cursor-pointer"
        >
          <UserPlus size={14} /> Ajouter un utilisateur
        </button>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Total</span>
            <p className="text-xl font-black text-white font-mono">{loading ? '...' : totalUsers}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>

        {['Admin', 'Manager', 'Finance', 'Employe'].map(role => (
          <div key={role} className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">{role}</span>
              <p className="text-xl font-black text-white font-mono">{loading ? '...' : (roleCounts[role] || 0)}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${getRoleColor(role)}`}>
              <Shield size={18} />
            </div>
          </div>
        ))}
      </div>

      {/* Barre d'outils */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, équipe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A263B] text-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-[#FF6B2C]/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['Tous', 'Admin', 'Manager', 'Finance', 'Employe'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedRole === role
                    ? 'bg-[#FF6B2C] text-white border-transparent'
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
                <th className="pb-3 px-4">Utilisateur</th>
                <th className="pb-3 px-4">Email</th>
                <th className="pb-3 px-4">Équipe</th>
                <th className="pb-3 px-4">Rôle</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    <Loader2 className="inline-block animate-spin mr-2" size={16} />
                    Chargement...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-red-400">
                    <AlertTriangle className="inline-block mr-2" size={16} />
                    {error}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((account) => (
                  <tr key={account._id} className="hover:bg-[#0B131F]/30 transition-colors">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FF6B2C]/5 border border-[#FF6B2C]/15 text-[#FF6B2C] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {account.name.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{account.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">ID: {account._id.substring(account._id.length - 6)}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400 flex items-center gap-1">
                      <Mail size={12} className="text-slate-600" />
                      {account.email}
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-1">
                        <Briefcase size={12} className="text-slate-600" />
                        {account.team || "Non assigné"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getRoleColor(account.role)}`}>
                        {account.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/utilisateurs/modifier/${account._id}`)}
                          className="p-2 bg-[#1A263B] text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(account._id, account.name)}
                          disabled={deleting === account._id}
                          className="p-2 bg-[#1A263B] text-red-400 hover:text-red-300 rounded-lg border border-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                          title="Supprimer"
                        >
                          {deleting === account._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > 0 && (
          <div className="pt-4 border-t border-slate-800/60 text-xs text-slate-500">
            Affichage de {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}