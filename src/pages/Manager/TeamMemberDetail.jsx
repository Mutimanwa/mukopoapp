import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, BarChart, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const membersData = {
  "USR-01": {
    name: "Alain Ndikumana",
    email: "alain.n@mukopo.com",
    role: "Ingénieur Réseau",
    dept: "Infras",
    spent: "1240.00",
    limit: "2500.00",
    status: "Actif",
    chartData: [
      { name: 'Jan', Dépenses: 320 },
      { name: 'Fév', Dépenses: 450 },
      { name: 'Mar', Dépenses: 890 },
      { name: 'Avr', Dépenses: 240 },
      { name: 'Mai', Dépenses: 1240 },
      { name: 'Juin', Dépenses: 0 },
    ],
    expenses: [
      { id: "NDF-891", date: "02 Juin 2026", merchant: "Station Gitega", category: "Transport", amount: "120.00 €", status: "En attente" },
      { id: "NDF-804", date: "15 Mai 2026", merchant: "Amazon Infras", category: "Matériel", amount: "1000.00 €", status: "Approuvé" },
      { id: "NDF-702", date: "12 Avr 2026", merchant: "Hotel Burundi", category: "Hébergement", amount: "240.00 €", status: "Approuvé" }
    ]
  },
  "USR-02": {
    name: "Bella Inamahoro",
    email: "bella.i@mukopo.com",
    role: "UI/UX Designer",
    dept: "Design",
    spent: "320.50",
    limit: "1500.00",
    status: "Actif",
    chartData: [
      { name: 'Jan', Dépenses: 120 },
      { name: 'Fév', Dépenses: 200 },
      { name: 'Mar', Dépenses: 340 },
      { name: 'Avr', Dépenses: 150 },
      { name: 'Mai', Dépenses: 320 },
      { name: 'Juin', Dépenses: 0 },
    ],
    expenses: [
      { id: "NDF-892", date: "01 Juin 2026", merchant: "Figma Pro", category: "Licence", amount: "45.50 €", status: "En attente" },
      { id: "NDF-809", date: "24 Mai 2026", merchant: "Bistro Bujumbura", category: "Restauration", amount: "275.00 €", status: "Approuvé" }
    ]
  },
  "USR-03": {
    name: "Safi Kibasomba",
    email: "safi.k@mukopo.com",
    role: "Développeur Full-Stack",
    dept: "R&D",
    spent: "2150.00",
    limit: "3000.00",
    status: "Actif",
    chartData: [
      { name: 'Jan', Dépenses: 400 },
      { name: 'Fév', Dépenses: 850 },
      { name: 'Mar', Dépenses: 1300 },
      { name: 'Avr', Dépenses: 950 },
      { name: 'Mai', Dépenses: 2150 },
      { name: 'Juin', Dépenses: 0 },
    ],
    expenses: [
      { id: "NDF-722", date: "24 Mai 2026", merchant: "Hôtel source du Nil", category: "Hébergement", amount: "450.00 €", status: "Approuvé" },
      { id: "NDF-710", date: "10 Mai 2026", merchant: "GitHub Pro", category: "Licence", amount: "1700.00 €", status: "Approuvé" }
    ]
  }
};

export default function TeamMemberDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const userKey = id && membersData[id] ? id : "USR-01";
  const member = membersData[userKey];
  const spentPercent = (parseFloat(member.spent) / parseFloat(member.limit)) * 100;

  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={14} /> Retour à l'équipe
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Gauche : Infos profil & Cadrage */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muko-orange/10 text-muko-orange border border-muko-orange/15 flex items-center justify-center font-bold text-lg uppercase">
                {member.name.substring(0, 2)}
              </div>
              <div className="truncate">
                <h2 className="text-base font-bold text-white truncate">{member.name}</h2>
                <p className="text-xs text-slate-500 font-mono">{member.role}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800/40 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Département</span><span className="text-white font-medium">{member.dept}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="text-white font-mono">{member.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Statut système</span><span className="text-green-400 font-semibold">{member.status}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">ID Agent</span><span className="text-slate-400 font-mono">{userKey}</span></div>
            </div>

            {/* Plafond de budget */}
            <div className="space-y-2 pt-4 border-t border-slate-800/40">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">Budget consommé ce mois</span>
                <span className="text-[#FF6B2C] font-bold">
                  {spentPercent.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#0B131F] rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full rounded-full ${spentPercent > 80 ? 'bg-red-500' : 'bg-[#FF6B2C]'}`}
                  style={{ width: `${Math.min(spentPercent, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>{parseFloat(member.spent).toFixed(2)} €</span>
                <span>Max : {parseFloat(member.limit).toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Note de cadrage */}
          <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <BarChart size={14} className="text-muko-orange" /> Note de cadrage
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cet utilisateur est autorisé à imputer ses dépenses sur les enveloppes budgétaires des projets d'infrastructure validés. Aucun incident de conformité sur ses justificatifs n'a été répertorié au cours de l'exercice fiscal actuel.
            </p>
          </div>
        </div>

        {/* Colonne Droite : Graphique & Dernières transactions (2 colonnes) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Graphique de dépenses d'agent */}
          <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Évolution mensuelle des dépenses</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={member.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A263B" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111C2E', borderColor: '#1A263B', borderRadius: '12px' }}
                    itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
                  />
                  <Bar dataKey="Dépenses" fill="#FF6B2C" radius={[4, 4, 0, 0]} barSize={25} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Liste des dépenses soumises */}
          <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Dossiers de dépenses récents</h3>
            
            <div className="divide-y divide-slate-800/40 text-xs">
              {member.expenses.map((exp, index) => (
                <div key={exp.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A263B] text-muko-orange flex items-center justify-center border border-slate-800">
                      <FileText size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{exp.merchant}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{exp.id} • {exp.date} • {exp.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <span className="font-mono font-bold text-white">{exp.amount}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] border font-semibold ${
                      exp.status === 'Approuvé' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {exp.status === 'Approuvé' ? <CheckCircle2 size={10} className="inline mr-1" /> : <Clock size={10} className="inline mr-1" />}
                      {exp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}