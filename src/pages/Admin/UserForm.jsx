import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Shield, User, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import Input from '../../components/UI/Input';
import apiClient from '../../services/api';

const rolePermissions = {
  Employe: [
    { label: "Créer et modifier ses notes de frais", active: true },
    { label: "Importer des justificatifs de caisse", active: true },
    { label: "Demander des remboursements", active: true },
    { label: "Valider les notes d'une équipe", active: false },
    { label: "Émettre des règlements comptables", active: false },
    { label: "Gérer la configuration de la plateforme", active: false }
  ],
  Manager: [
    { label: "Créer et modifier ses notes de frais", active: true },
    { label: "Importer des justificatifs de caisse", active: true },
    { label: "Demander des remboursements", active: true },
    { label: "Valider les notes d'une équipe", active: true },
    { label: "Émettre des règlements comptables", active: false },
    { label: "Gérer la configuration de la plateforme", active: false }
  ],
  Finance: [
    { label: "Créer et modifier ses notes de frais", active: true },
    { label: "Importer des justificatifs de caisse", active: true },
    { label: "Demander des remboursements", active: true },
    { label: "Valider les notes d'une équipe", active: false },
    { label: "Émettre des règlements comptables", active: true },
    { label: "Gérer la configuration de la plateforme", active: false }
  ],
  Admin: [
    { label: "Créer et modifier ses notes de frais", active: true },
    { label: "Importer des justificatifs de caisse", active: true },
    { label: "Demander des remboursements", active: true },
    { label: "Valider les notes d'une équipe", active: true },
    { label: "Émettre des règlements comptables", active: true },
    { label: "Gérer la configuration de la plateforme", active: true }
  ]
};

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [role, setRole] = useState('Employe');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const { data } = await apiClient.get(`/users/${id}`);
          setName(data.name || '');
          setEmail(data.email || '');
          setRole(data.role || 'Employe');
        } catch (err) {
          console.error(err);
          setError("Erreur chargement utilisateur.");
        } finally {
          setFetching(false);
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await apiClient.put(`/users/${id}`, { name, email, role });
      } else {
        await apiClient.post('/auth/register', { name, email, password: password || '123456', role }); // mot de passe par défaut
      }
      navigate('/admin/utilisateurs');
    } catch (err) {
      console.error(err);
      setError("Échec de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const permissions = rolePermissions[role] || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={14} /> Retour à l'annuaire
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Formulaire Principal (7 colonnes) */}
        {!fetching ? (
          <form onSubmit={handleSave} className="lg:col-span-7 bg-muko-card border border-slate-800/80 rounded-2xl p-8 space-y-6">
            <div className="border-b border-slate-800/60 pb-4">
              <h2 className="text-base font-bold text-white">
                {id ? `Modifier le compte de ${name}` : "Créer un nouveau profil"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Assurez-vous de l'exactitude des informations d'identification d'entreprise.</p>
            </div>

            {/* Zone Avatar Interactive MOCK */}
            <div className="flex items-center gap-4 py-2">
              <div className="w-14 h-14 rounded-2xl bg-[#1A263B] border border-slate-700/60 flex items-center justify-center font-black text-lg text-[#FF6B2C]">
                {name ? name.substring(0, 2).toUpperCase() : <User size={20} />}
              </div>
              <div>
                <button type="button" className="bg-[#1A263B] hover:bg-opacity-80 border border-slate-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all cursor-pointer">
                  Télécharger une photo
                </button>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">Recommandé : JPG ou PNG, max 1MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Nom complet"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Alain Ndikumana"
                required
              />

              <Input
                label="Adresse Email Pro"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom.p@mukopo.com"
                required
              />

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">Rôle Plateforme</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors cursor-pointer"
                >
                  <option value="Employe">Employé (Soumission de frais)</option>
                  <option value="Manager">Manager / Responsable (Approbation)</option>
                  <option value="Finance">Comptable / Service Financier</option>
                  <option value="Admin">Administrateur Système</option>
                </select>
              </div>

              {!id && (
                <div>
                  <Input
                    label="Mot de passe temporaire"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Laisser vide pour '123456'"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">L'utilisateur pourra le modifier après première connexion.</p>
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">Département Affecté</label>
                <select className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors cursor-pointer">
                  <option value="tech">Direction Technique</option>
                  <option value="marketing">Marketing & Événementiel</option>
                  <option value="ops">Opérations & Logistique</option>
                  <option value="compta">Comptabilité & Finances</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800/60">
              {error && <p className="text-red-400 text-xs mr-4 font-bold flex items-center">{error}</p>}
              <button type="submit" disabled={loading} className="bg-muko-orange hover:bg-opacity-90 disabled:opacity-50 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-muko-orange/10 transition-all active:scale-[0.98] cursor-pointer">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {loading ? "Sauvegarde..." : "Sauvegarder la fiche"}
              </button>
            </div>
          </form>
        ) : (
          <div className="lg:col-span-7 bg-muko-card border border-slate-800/80 rounded-2xl p-8 flex items-center justify-center text-slate-400 h-64">
            <Loader2 size={24} className="animate-spin" />
          </div>
        )}

        {/* Panneau de Privilèges Dynamique (5 colonnes) */}
        <div className="lg:col-span-5 bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white border-b border-slate-800/60 pb-3">
            <Shield size={16} className="text-[#FF6B2C]" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold">Privilèges et Permissions</h3>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Permissions activées en temps réel pour le rôle <span className="text-[#FF6B2C] font-mono uppercase font-bold">{role}</span> :
          </p>

          <div className="space-y-3 pt-2">
            {permissions.map((perm, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs py-1">
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${perm.active
                    ? 'border-green-500/30 bg-green-500/10 text-green-400'
                    : 'border-slate-800 bg-slate-900/50 text-slate-600'
                  }`}>
                  {perm.active && <Sparkles size={8} className="fill-green-400" />}
                </div>
                <span className={perm.active ? 'text-slate-200' : 'text-slate-500 line-through'}>
                  {perm.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}