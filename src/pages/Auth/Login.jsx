import { Mail, Lock, Eye } from 'lucide-react';
import Input from '../../components/UI/Input';

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-[#0B131F] flex items-center justify-center p-4">
      {/* Conteneur principal de la carte */}
      <div className="w-full max-w-5xl aspect-4/3 bg-[#111C2E] rounded-3xl overflow-hidden border border-slate-800/50 shadow-2xl flex">
        
        {/* SECTION GAUCHE : Visuel & Branding */}
        <div className="w-1/2 bg-linear-to-br from-[#0B131F] to-[#111C2E] p-12 flex flex-col justify-between relative border-r border-slate-800/40">
          <div>
            <h1 className="text-2xl font-black text-[#FF6B2C] tracking-wider font-sans uppercase">
              MUKOPOAPP
            </h1>
            <p className="text-slate-400 text-sm mt-4 max-w-xs leading-relaxed">
              Gérez vos dépenses avec une précision chirurgicale et une vitesse fulgurante. Conçu pour les professionnels qui exigent le meilleur.
            </p>
          </div>

          {/* Widget Vitesse de traitement */}
          <div className="bg-[#1A263B]/60 border border-slate-800/60 rounded-xl p-5 backdrop-blur-sm max-w-sm">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[#FF6B2C] tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse"></span>
              Vitesse de traitement
            </div>
            {/* Barre de progression */}
            <div className="w-full h-2 bg-[#0B131F] rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-[#FF6B2C] rounded-full w-[85%]"></div>
            </div>
            <div className="text-[9px] font-mono text-slate-500 mt-2 italic">
              Optimisé par Safi Kibasomba
            </div>
          </div>
        </div>

        {/* SECTION DROITE : Formulaire */}
        <div className="w-1/2 p-16 flex flex-col justify-between">
          <div className="space-y-8 my-auto">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Bienvenue</h2>
              <p className="text-slate-400 text-sm mt-2">Veuillez vous connecter pour accéder à votre espace.</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <Input 
                label="Adresse Email" 
                type="email" 
                placeholder="nom@entreprise.com" 
                icon={Mail} 
              />
              
              <div className="relative">
                <Input 
                  label="Mot de passe" 
                  type="password" 
                  placeholder="••••••••" 
                  icon={Lock} 
                />
                <button type="button" className="absolute right-4 bottom-3.5 text-slate-400 hover:text-slate-200">
                  <Eye size={18} />
                </button>
                
              </div>

              {/* Se souvenir de moi */}
              <div className="flex justify-between">
                <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="w-4 h-4 rounded border-slate-700 bg-[#1A263B] text-[#FF6B2C] focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none">
                  Se souvenir de moi
                </label>
              </div>
              {/* <div className="text-right mt-1">
                  <a href="#" className="text-[13px] font-mono text-[#FF6B2C]/80 hover:text-[#FF6B2C] transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div> */}
              </div>
              

              {/* Bouton de connexion */}
              <button className="w-full bg-[#FF6B2C] hover:bg-opacity-90 text-white font-medium py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#FF6B2C]/10 active:scale-[0.99]">
               <a href="/dashboard"> Se connecter →</a>
              </button>
            </form>
          </div>

          {/* Footer de la carte */}
          <div className="text-center space-y-4">
            <p className="text-xs text-slate-400">
              Vous n'avez pas de compte ? <a href="/register" className="text-[#FF6B2C] hover:underline">Créer un profil</a>
            </p>
            <div className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">
              Propulsé par <span className="text-slate-400 font-semibold">Safi Kibasomba</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}