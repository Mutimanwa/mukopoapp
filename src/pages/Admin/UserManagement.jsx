import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Edit2, Shield, MoreVertical } from 'lucide-react';

export default function UserManagement() {
  const navigate = useNavigate();

  const userRegistry = [
    { id: "USR-001", name: "Safi Kibasomba", email: "safi.k@mukopo.com", role: "Employé", dept: "R&D", status: "Actif" },
    { id: "USR-002", name: "Alain Ndikumana", email: "alain.n@mukopo.com", role: "Manager", dept: "Infras", status: "Actif" },
    { id: "USR-003", name: "Clément Nkurunziza", email: "clement.n@mukopo.com", role: "Finance", dept: "Comptabilité", status: "Actif" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-slate-400 text-xs mt-1">Créez, modifiez et contrôlez les autorisations d'accès aux profils salariés.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/utilisateurs/creer')}
          className="bg-muko-orange hover:bg-opacity-90 text-white text-xs font-bold py-3 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-muko-orange/10 cursor-pointer"
        >
          <UserPlus size={14} /> Ajouter un utilisateur
        </button>
      </div>

      <div className="bg-muko-card border border-slate-800/80 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider bg-[#0B131F]/30">
              <th className="py-4 px-6">Identifiant / Nom</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">Département</th>
              <th className="py-4 px-4">Privilège</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
            {userRegistry.map((account) => (
              <tr key={account.id} className="hover:bg-[#1A263B]/10 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-bold text-white">{account.name}</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">{account.id}</div>
                </td>
                <td className="py-4 px-4 font-mono text-slate-400">{account.email}</td>
                <td className="py-4 px-4 text-slate-400 font-medium">{account.dept}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    account.role === 'Manager' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                    account.role === 'Finance' ? 'bg-green-500/5 border-green-500/20 text-green-400' :
                    'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    {account.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button 
                    onClick={() => navigate(`/admin/utilisateurs/modifier/${account.id}`)}
                    className="p-2 bg-[#1A263B] text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
                  >
                    <Edit2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}