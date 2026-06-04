import { useState } from 'react';
import { GitFork, Shield, Bell, Zap, ChevronRight, Save } from 'lucide-react';

const INITIAL_RULES = [
  {
    id: 'r1',
    title: 'Validation standard double facteur',
    desc: 'Toute note inferieure a 1 500 USD passe du Manager directement au Comptable.',
    active: true,
    steps: ['Manager direct', 'Service Comptabilite'],
    threshold: '1500',
    category: 'Validation',
  },
  {
    id: 'r2',
    title: 'Validation haute valeur',
    desc: 'Notes superieures a 1 500 USD requierent une double approbation : Manager + DG.',
    active: true,
    steps: ['Manager direct', 'Directeur General', 'Finance'],
    threshold: '5000',
    category: 'Validation',
  },
  {
    id: 'r3',
    title: 'Escalade automatique',
    desc: 'Si une note reste non traitee 48h, elle est remontee automatiquement au niveau superieur.',
    active: false,
    steps: ['Attente 48h', 'Escalade N+1'],
    threshold: null,
    category: 'Automatisation',
  },
  {
    id: 'r4',
    title: 'Notification de refus',
    desc: "Envoie une notification email a l'employe et au Manager lors d'un rejet.",
    active: true,
    steps: ['Email Employe', 'Email Manager'],
    threshold: null,
    category: 'Notifications',
  },
];

const CATEGORY_COLOR = {
  Validation:     { bg: 'bg-blue-500/10',  border: 'border-blue-500/15',  text: 'text-blue-400'  },
  Automatisation: { bg: 'bg-purple-500/10',border: 'border-purple-500/15',text: 'text-purple-400' },
  Notifications:  { bg: 'bg-amber-500/10', border: 'border-amber-500/15', text: 'text-amber-400'  },
};

const CATEGORY_ICON = {
  Validation:     Shield,
  Automatisation: Zap,
  Notifications:  Bell,
};

export default function WorkflowSettings() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [saved,  setSaved]  = useState(false);

  const toggle = (id) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const activeCount = rules.filter((r) => r.active).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Parametres des Workflows</h1>
          <p className="text-slate-400 text-xs mt-1">Configurez les paliers de signatures et les circuits de validation automatiques.</p>
        </div>
        <button
          onClick={handleSave}
          className={`text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
            saved ? 'bg-green-600' : 'bg-muko-orange hover:bg-opacity-90 shadow-lg shadow-muko-orange/10'
          }`}
        >
          <Save size={14} /> {saved ? 'Sauvegarde !' : 'Sauvegarder'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-muko-orange/10 border border-muko-orange/15 text-muko-orange flex items-center justify-center">
            <GitFork size={18} />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Regles configurees</p>
            <p className="text-xl font-black text-white font-mono">{rules.length} regles</p>
          </div>
        </div>
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
            <Shield size={18} />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Regles actives</p>
            <p className="text-xl font-black text-white font-mono">{activeCount} actives</p>
          </div>
        </div>
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-700/30 border border-slate-700/40 text-slate-400 flex items-center justify-center">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Inactives</p>
            <p className="text-xl font-black text-white font-mono">{rules.length - activeCount} off</p>
          </div>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-4">
        {rules.map((rule) => {
          const { bg, border, text } = CATEGORY_COLOR[rule.category];
          const Icon = CATEGORY_ICON[rule.category];
          return (
            <div key={rule.id} className={`bg-muko-card border rounded-2xl p-6 transition-all ${rule.active ? 'border-slate-800/80' : 'border-slate-800/40 opacity-60'}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl ${bg} border ${border} ${text} flex-shrink-0 flex items-center justify-center`}>
                    <Icon size={16} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-bold text-white">{rule.title}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${bg} ${border} border ${text}`}>
                        {rule.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{rule.desc}</p>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggle(rule.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 cursor-pointer ${rule.active ? 'bg-muko-orange' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${rule.active ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>

              {/* Circuit visuel */}
              {rule.active && (
                <div className="mt-5 pt-4 border-t border-slate-800/40 flex items-center flex-wrap gap-2">
                  {rule.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-300 bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-700/50">
                        {step}
                      </span>
                      {i < rule.steps.length - 1 && <ChevronRight size={12} className="text-slate-600" />}
                    </div>
                  ))}
                  {rule.threshold && (
                    <span className="ml-auto text-[10px] font-mono text-muko-orange bg-muko-orange/10 border border-muko-orange/15 px-2 py-1 rounded-lg">
                      Seuil : {parseInt(rule.threshold).toLocaleString()} USD
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}