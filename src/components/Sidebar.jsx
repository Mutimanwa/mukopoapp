import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, Settings, Plus, LogOut } from 'lucide-react';

export default function Sidebar() {
  // Liste des liens de navigation pour éviter la répétition de code
  const menuItems = [
    { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mes Dépenses', path: '/depenses', icon: Receipt },
    { name: 'Rapports', path: '/rapports', icon: BarChart3 },
    { name: 'Paramètres', path: '/parametres', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-[#111C2E] border-r border-slate-800/60 fixed top-0 left-0 flex flex-col justify-between p-6 z-30">
      
      {/* Haut de la Sidebar : Logo & Profil */}
      <div className="space-y-8">
        {/* Branding */}
        <div>
          <h1 className="text-xl font-black text-[#FF6B2C] tracking-wider uppercase font-sans">
            MUKOPOAPP
          </h1>
          <p className="text-[10px] font-mono text-slate-500 mt-1">Safi Kibasomba</p>
        </div>

        {/* Liens du Menu */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3  text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-[#0B131F] text-white border-l-3 border-[#FF6B2C] shadow-inner shadow-black/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B131F]/40'}
                `}
              >
                <Icon size={18} className="shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bas de la Sidebar : Actions */}
      <div className="space-y-4">
        {/* Bouton Nouvelle Dépense Orange */}
        <button className="w-full bg-[#FF6B2C] hover:bg-opacity-90 text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all active:scale-[0.98]">
          <Plus size={16} />
          Nouvelle Dépense
        </button>

        <hr className="border-slate-800/60" />

        {/* Bouton Déconnexion */}
        <NavLink 
          to="/connexion" 
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/5 transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </NavLink>
      </div>

    </aside>
  );
}