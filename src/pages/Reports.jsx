import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Calendar, DownloadCloud, TrendingUp, AlertTriangle, FileText } from 'lucide-react';

// 1. Données pour le graphique de comparaison (Budget vs Réel)
const comparisonData = [
  { name: 'Marketing', Budget: 5000, Reel: 4800 },
  { name: 'R&D', Budget: 8000, Reel: 9200 },
  { name: 'Opérations', Budget: 4000, Reel: 3100 },
  { name: 'RH', Budget: 2500, Reel: 2400 },
  { name: 'Ventes', Budget: 6000, Reel: 5500 },
];

// 2. Données pour le graphique en anneau (Donut Chart)
const categoryData = [
  { name: 'Hébergement', value: 45, color: '#FF6B2C' }, // Muko Orange
  { name: 'Transport', value: 28, color: '#3B82F6' },   // Blue
  { name: 'Restauration', value: 15, color: '#10B981' }, // Green
  { name: 'Autres', value: 12, color: '#64748B' },       // Slate
];

export default function Reports() {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* EN-TÊTE DE LA PAGE */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Rapports & Analyses</h1>
          <p className="text-slate-400 text-xs mt-1">Visualisez la répartition et l'efficacité de vos budgets de dépenses.</p>
        </div>
        
        {/* Actions rapides */}
        <div className="flex items-center gap-3">
          <button className="bg-[#1A263B] text-slate-300 text-xs px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
            <Calendar size={14} /> Trimestre en cours
          </button>
          <button className="bg-[#FF6B2C] hover:bg-opacity-90 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all active:scale-[0.98] cursor-pointer">
            <DownloadCloud size={14} /> Exporter le PDF
          </button>
        </div>
      </div>

      {/* ZONE GRAPHIQUE PRINCIPALE (Grille 2 Colonnes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graphique de comparaison des budgets (Prend 2 colonnes) */}
        <div className="lg:col-span-2 bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white tracking-tight">Suivi Budgétaire par Département</h2>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Valeurs en EUR (€)</span>
          </div>
          
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A263B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111C2E', borderColor: '#1A263B', borderRadius: '12px' }}
                  itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Bar dataKey="Budget" fill="#1A263B" radius={[4, 4, 0, 0]} name="Budget Alloué" />
                <Bar dataKey="Reel" fill="#FF6B2C" radius={[4, 4, 0, 0]} name="Dépenses Réelles" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique Donut de répartition par catégorie (Prend 1 colonne) */}
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">Structure des coûts</h2>
          
          {/* Le Graphique Circulaire */}
          <div className="h-44 w-full relative flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Texte au centre du Donut */}
            <div className="absolute text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Total</span>
              <p className="text-xl font-black text-white font-mono">100%</p>
            </div>
          </div>

          {/* Légende personnalisée en bas */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-400 truncate">{item.name}</span>
                <span className="font-mono font-bold text-white ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTIONS ALERTES ET CONTRÔLE DES ANOMALIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Boite d'Alerte : Dépassement Budgétaire */}
        <div className="bg-[#111C2E] border border-red-500/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider font-semibold block">Alerte Seuil</span>
              <h3 className="text-sm font-bold text-white">Dépassement R&D</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Le département **R&D** a dépassé son budget initial de <span className="text-red-400 font-mono font-semibold">+1,200.00 €</span> ce mois-ci dû aux frais d'infrastructure serveur.
          </p>
          <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer">
            Ajuster le budget
          </button>
        </div>

        {/* Carte Insight : Optimisation des coûts */}
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider font-semibold block">Optimisation</span>
              <h3 className="text-sm font-bold text-white">Économie Opérations</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bonne nouvelle ! Le secteur **Opérations** enregistre une réduction de <span className="text-green-400 font-mono font-semibold">-22.5%</span> par rapport aux projections trimestrielles.
          </p>
          <button className="w-full bg-[#1A263B] text-slate-300 text-xs font-semibold py-2.5 rounded-xl border border-slate-800 hover:text-white transition-all cursor-pointer">
            Voir l'analyse
          </button>
        </div>

        {/* Historique des rapports générés */}
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-white">Rapports récents</h3>
          <div className="divide-y divide-slate-800/40">
            {[
              { title: 'Rapport_Q1_2026.pdf', date: 'Créé le 15 Mai' },
              { title: 'Depenses_Avril_Signe.pdf', date: 'Créé le 02 Mai' },
              { title: 'Synthese_Fiscale_MUKO.pdf', date: 'Créé le 28 Avr' },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 group">
                <div className="flex items-center gap-2.5 text-xs truncate">
                  <FileText size={14} className="text-[#FF6B2C] shrink-0" />
                  <span className="text-slate-300 truncate group-hover:text-white font-medium">{doc.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">{doc.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}