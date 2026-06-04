import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '../../components/UI/Input';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('safi.k@mukopo.com');
  const [role, setRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(role);
    navigate('/');
  };

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
        <div className="w-1/2 p-12 flex flex-col justify-between">
          <div className="space-y-6 my-auto">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Bienvenue</h2>
              <p className="text-slate-400 text-xs mt-2">Veuillez vous connecter pour accéder à votre espace.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Adresse Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.com"
                icon={Mail}
                required
              />

              <div className="relative">
                <Input
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  defaultValue="12345678"
                  placeholder="••••••••"
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-3.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Rôle pour la simulation */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Rôle de connexion (Simulation)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-muko-orange/50 cursor-pointer"
                >
                  <option value="employee">👨‍💻 Employé</option>
                  <option value="manager">💼 Manager</option>
                  <option value="finance">🏦 Comptable / Finance</option>
                  <option value="admin">⚙️ Administrateur</option>
                </select>
              </div>

              {/* Se souvenir de moi */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-700 bg-[#1A263B] text-[#FF6B2C] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none">
                  Se souvenir de moi
                </label>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                className="w-full bg-[#FF6B2C] hover:bg-opacity-90 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#FF6B2C]/10 active:scale-[0.99] cursor-pointer"
              >
                Se connecter →
              </button>
            </form>
          </div>

          {/* Footer de la carte */}
          <div className="text-center space-y-3">
            <div className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">
              Propulsé par <span className="text-slate-400 font-semibold">Safi Kibasomba</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}