
import { Search, Bell, HelpCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-20 border-b border-slate-800/50 bg-[#0B131F]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
      
      {/* Gauche : Barre de recherche globale */}
      <div className="w-96 relative flex items-center">
        <Search size={16} className="absolute left-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Rechercher une transaction..." 
          className="w-full bg-[#111C2E] text-sm text-slate-200 placeholder-slate-500 pl-11 pr-4 py-2.5 rounded-xl border border-slate-800/80 focus:border-[#FF6B2C]/40 focus:outline-none transition-all"
        />
      </div>

      {/* Droite : Actions & Profil Utilisateur */}
      <div className="flex items-center gap-6">
        {/* Icônes Utilitaires */}
        <div className="flex items-center gap-4 text-slate-400 border-r border-slate-800 pr-6">
          <button className="hover:text-slate-200 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#FF6B2C] rounded-full"></span>
          </button>
          <button className="hover:text-slate-200 transition-colors">
            <HelpCircle size={18} />
          </button>
        </div>

        {/* Bloc Profil Administrateur */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">Safi Kibasomba</div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Admin Principal</div>
          </div>
          {/* Avatar (Remplacé par une image ou une div stylisée si l'image manque) */}
          <div className="w-10 h-10 rounded-full border border-[#FF6B2C]/40 overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-xs text-[#FF6B2C]">
            SK
          </div>
        </div>
      </div>

    </header>
  );
}