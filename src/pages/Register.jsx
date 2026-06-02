import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Building2, Lock, Eye } from 'lucide-react';
import Input from '../components/UI/Input';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulation d'inscription -> Redirection directe vers le tableau de bord
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-[#0B131F] flex items-center justify-center p-6 selection:bg-[#FF6B2C]/30">
      <div className="w-full max-w-5xl aspect-4/3 bg-[#111C2E] rounded-3xl overflow-hidden border border-slate-800/50 shadow-2xl flex">
        
        {/* BLOC GAUCHE : Branding & Jauge Dynamique */}
        <div className="w-1/2 bg-linear-to-br from-[#0B131F] to-[#111C2E] p-12 flex flex-col justify-between relative border-r border-slate-800/40">
          <div>
            <h1 className="text-2xl font-black text-[#FF6B2C] tracking-wider font-sans uppercase">
              MUKOPOAPP
            </h1>
            <p className="text-slate-400 text-sm mt-4 max-w-xs leading-relaxed">
              Optimisez la gestion de vos dépenses avec une rapidité et une précision sans précédent.
            </p>
          </div>

          {/* Widget Remboursement en cours (Fidèle à la maquette) */}
          <div className="bg-[#1A263B]/40 border border-[#FF6B2C]/20 rounded-xl p-5 backdrop-blur-sm max-w-sm shadow-xl shadow-[#FF6B2C]/5">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-slate-300 tracking-wider">
              <span>Remboursement en cours</span>
              <span className="text-[#FF6B2C]">⚡</span>
            </div>
            {/* Montant */}
            <div className="text-base font-bold text-white mt-2 font-mono">
              4 250,00 €
            </div>
            {/* Barre d'état */}
            <div className="w-full h-1.5 bg-[#0B131F] rounded-full mt-3 overflow-hidden">
              <div className="h-full  bg-[#FF6B2C]  rounded-full w-[78%]"></div>
            </div>
            <div className="text-right text-[9px] font-mono text-slate-500 mt-1.5 animate-pulse">
              Finishing...
            </div>
          </div>

          <div className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">
            Propulsé par <span className="text-slate-400">Safi Kibasomba</span>
          </div>
        </div>

        {/* BLOC DROITE : Formulaire d'inscription */}
        <div className="w-1/2 p-16 flex flex-col justify-between">
          <div className="space-y-6 my-auto">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Créer un compte</h2>
              <p className="text-slate-400 text-sm mt-2">Rejoignez l'élite de la gestion financière.</p>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              <Input 
                label="Nom complet" 
                type="text" 
                placeholder="Nom complet" 
                icon={User} 
                required
              />

              <Input 
                label="Adresse Email" 
                type="email" 
                placeholder="jemail@entreprise.com" 
                icon={Mail} 
                required
              />

              <Input 
                label="Entreprise" 
                type="text" 
                placeholder="Nom de votre société" 
                icon={Building2} 
                required
              />
              
              <div className="relative">
                <Input 
                  label="Mot de passe" 
                  type="password" 
                  placeholder="••••••••" 
                  icon={Lock} 
                  required
                />
                <button type="button" className="absolute right-4 bottom-3.5 text-slate-400 hover:text-slate-200">
                  <Eye size={18} />
                </button>
              </div>

              <button type="submit" className="w-full bg-[#FF6B2C] hover:bg-opacity-90 text-white font-medium py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-6 shadow-lg shadow-[#FF6B2C]/10 active:scale-[0.99] cursor-pointer">
                Créer un compte →
              </button>
            </form>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-slate-400">
              Vous avez déjà un compte ?{' '}
              <Link to="/connexion" className="text-[#FF6B2C] hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}