import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, PlusCircle, FolderOpen, CreditCard,
  CheckSquare, Users, BarChart3, ShieldAlert, Settings,
  History, Landmark, Layers, ShieldCheck, LogOut
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();

  // Définition des menus par rôle selon le cahier des charges
  const menus = {
    employee: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/mes-notes', label: 'Mes Notes de Frais', icon: FileText },
      { to: '/nouvelle-note', label: 'Nouvelle Note', icon: PlusCircle },
      { to: '/mes-justificatifs', label: 'Mes Justificatifs', icon: FolderOpen },
      { to: '/mes-remboursements', label: 'Mes Remboursements', icon: CreditCard },
      { to: '/profil', label: 'Mon Profil', icon: Settings },
    ],
    manager: [
      { to: '/', label: 'Dashboard Manager', icon: LayoutDashboard },
      { to: '/validation/attente', label: 'Notes à Valider', icon: CheckSquare },
      { to: '/validation/historique', label: 'Historique Validations', icon: History },
      { to: '/equipe/collaborateurs', label: 'Mes Collaborateurs', icon: Users },
      { to: '/equipe/rapports', label: 'Rapport d\'Équipe', icon: BarChart3 },
    ],
    finance: [
      { to: '/', label: 'Dashboard Finance', icon: LayoutDashboard },
      { to: '/finance/traiter', label: 'Remboursements à Traiter', icon: Landmark },
      { to: '/finance/historique', label: 'Historique Paiements', icon: History },
      { to: '/finance/controle', label: 'Contrôle des Notes', icon: ShieldCheck },
      { to: '/finance/rapports', label: 'Rapports Financiers', icon: BarChart3 },
    ],
    admin: [
      { to: '/', label: 'Dashboard Admin', icon: LayoutDashboard },
      { to: '/admin/utilisateurs', label: 'Gestion Utilisateurs', icon: Users },
      { to: '/admin/organisation', label: 'Structure Org', icon: Layers },
      { to: '/admin/parametres', label: 'Workflows & Rôles', icon: Settings },
      { to: '/admin/audit', label: 'Journal d\'Audit', icon: ShieldAlert },
    ]
  };

  const currentMenu = menus[user?.role] || [];

  return (
    <div className="w-64 min-h-screen bg-[#111C2E] border-r border-slate-800/60 flex flex-col justify-between p-4 font-sans">
      <div className="space-y-8">
        {/* Branding */}
        <div className="px-3 py-2">
          <h1 className="text-xl font-black text-muko-orange tracking-wider uppercase">MUKOPOAPP</h1>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mt-0.5">Enterprise Suite</span>
        </div>

        {/* Liens de Navigation */}
        <nav className="space-y-1">
          {currentMenu.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200
                  ${isActive
                    ? 'bg-muko-orange text-white shadow-lg shadow-muko-orange/15'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A263B]/40'}
                `}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* SÉLECTEUR DE RÔLE (Pour les tests de développement) */}
      <div className="pt-4 border-t border-slate-800/60">
        {/* Infos utilisateur connecté */}
        <div className="flex items-center justify-between px-2 text-xs bg-[#0B131F] rounded-xl p-3 border border-slate-800/60">
          <button onClick={logout} className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer" title="Déconnexion">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}