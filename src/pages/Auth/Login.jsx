import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '../../components/UI/Input';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorLine, setErrorLine] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorLine('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setErrorLine(res.message || 'Erreur de connexion');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B131F] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl aspect-4/3 bg-[#111C2E] rounded-3xl overflow-hidden border border-slate-800/50 shadow-2xl flex">

        <div className="w-1/2 bg-linear-to-br from-[#0B131F] to-[#111C2E] p-12 flex flex-col justify-between relative border-r border-slate-800/40">
          <div>
            <h1 className="text-2xl font-black text-[#FF6B2C] tracking-wider font-sans uppercase">
              MUKOPOAPP
            </h1>
            <p className="text-slate-400 text-sm mt-4 max-w-xs leading-relaxed">
              Gérez vos dépenses avec une précision chirurgicale et une vitesse fulgurante.
            </p>
          </div>

          <div className="bg-[#1A263B]/60 border border-slate-800/60 rounded-xl p-5 backdrop-blur-sm max-w-sm">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[#FF6B2C] tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse"></span>
              Vitesse de traitement
            </div>
            <div className="w-full h-2 bg-[#0B131F] rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-[#FF6B2C] rounded-full w-[85%]"></div>
            </div>
            <div className="text-[9px] font-mono text-slate-500 mt-2 italic">
              Optimisé par Safi Kibasomba
            </div>
          </div>
        </div>

        <div className="w-1/2 p-12 flex flex-col justify-between">
          <div className="space-y-6 my-auto">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Bienvenue</h2>
              <p className="text-slate-400 text-xs mt-2">Veuillez vous connecter.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {errorLine && (
                <div className="text-red-400 text-xs mt-2 bg-red-400/10 p-2 rounded-lg border border-red-400/20">
                  {errorLine}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B2C] hover:bg-opacity-90 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#FF6B2C]/10 active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? 'Connexion...' : 'Se connecter →'}
              </button>
            </form>
          </div>

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