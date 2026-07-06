import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, BarChart, FileText, CheckCircle2, AlertCircle, Clock, Mail, Briefcase, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../../services/api';

export default function TeamMemberDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        // Récupérer les infos de l'utilisateur
        const userRes = await apiClient.get(`/users/${id}`);
        setMember(userRes.data);

        // Récupérer toutes les dépenses
        const expRes = await apiClient.get('/expenses');
        // Filtrer les dépenses de cet utilisateur
        const userExpenses = expRes.data.filter(e => e.userId?._id === id || e.userId === id);
        setExpenses(userExpenses);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données du collaborateur.");
      } finally {
        setLoading(false);
      }
    };
    fetchMemberData();
  }, [id]);

  // Statistiques
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const pendingCount = expenses.filter(e => e.status === 'En attente').length;
  const approvedCount = expenses.filter(e => e.status === 'Approuvée').length;
  const paidCount = expenses.filter(e => e.status === 'Payé').length;

  // Données pour le graphique (groupées par mois)
  const chartData = expenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleString('fr-FR', { month: 'short' });
    if (!acc[month]) acc[month] = 0;
    acc[month] += exp.amount || 0;
    return acc;
  }, {});

  const chartDataArray = Object.entries(chartData).map(([name, value]) => ({
    name,
    Dépenses: Math.round(value)
  }));

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
      <Loader2 className="animate-spin" size={20} /> Chargement...
    </div>
  );

  if (error || !member) return (
    <div className="flex items-center justify-center h-64 text-red-400 gap-2">
      <AlertCircle size={20} /> {error || "Collaborateur introuvable"}
    </div>
  );

  const spentPercent = totalSpent > 0 ? (totalSpent / 3000) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={() => navigate('/equipe/collaborateurs')} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={14} /> Retour à l'équipe
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche : Profil */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/15 flex items-center justify-center font-bold text-lg uppercase">
                {member.name.substring(0, 2)}
              </div>
              <div className="truncate">
                <h2 className="text-base font-bold text-white truncate">{member.name}</h2>
                <p className="text-xs text-slate-500 font-mono">{member.role}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800/40 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 flex items-center gap-1"><Mail size={12} /> Email</span>
                <span className="text-white font-mono truncate max-w-[150px]">{member.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 flex items-center gap-1"><Briefcase size={12} /> Département</span>
                <span className="text-white font-medium">{member.team || 'Non assigné'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Statut</span>
                <span className="text-green-400 font-semibold">Actif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ID</span>
                <span className="text-slate-400 font-mono text-[10px]">{member._id.substring(member._id.length - 6).toUpperCase()}</span>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/40">
              <div className="text-center">
                <p className="text-lg font-bold text-white">{expenses.length}</p>
                <p className="text-[9px] text-slate-500">Total</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-400">{pendingCount}</p>
                <p className="text-[9px] text-slate-500">En attente</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">{approvedCount + paidCount}</p>
                <p className="text-[9px] text-slate-500">Validées</p>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2 pt-4 border-t border-slate-800/40">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">Budget consommé</span>
                <span className="text-[#FF6B2C] font-bold">{Math.min(spentPercent, 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-[#0B131F] rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full ${spentPercent > 80 ? 'bg-red-500' : 'bg-[#FF6B2C]'}`}
                  style={{ width: `${Math.min(spentPercent, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>{totalSpent.toFixed(2)} €</span>
                <span>Max : 3 000.00 €</span>
              </div>
            </div>
          </div>

          {/* Note de cadrage */}
          <div className="bg-[#1A263B]/30 border border-slate-800/60 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
              <BarChart size={14} className="text-[#FF6B2C]" /> Note
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {member.role === 'Employe' 
                ? 'Collaborateur actif avec un historique de dépenses conforme aux politiques internes.'
                : 'Membre de l\'équipe avec un accès aux fonctionnalités de gestion.'}
            </p>
          </div>
        </div>

        {/* Colonne Droite : Graphique et transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Graphique */}
          <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Évolution des dépenses</h3>
            {chartDataArray.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-slate-500">
                Aucune donnée disponible
              </div>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartDataArray} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A263B" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111C2E', borderColor: '#1A263B', borderRadius: '12px' }}
                      itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
                    />
                    <Bar dataKey="Dépenses" fill="#FF6B2C" radius={[4, 4, 0, 0]} barSize={30} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Dernières dépenses */}
          <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Dernières dépenses</h3>
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText size={32} className="mx-auto text-slate-700 mb-2" />
                Aucune dépense enregistrée
              </div>
            ) : (
              <div className="divide-y divide-slate-800/40 text-xs">
                {expenses.slice(0, 5).map((exp) => (
                  <div key={exp._id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1A263B] text-[#FF6B2C] flex items-center justify-center border border-slate-800">
                        <FileText size={14} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{exp.category}</h4>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {new Date(exp.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-white">{exp.amount.toFixed(2)} {exp.currency}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] border font-semibold ${
                        exp.status === 'Payé' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        exp.status === 'Approuvée' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        exp.status === 'Rejeté' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {exp.status || 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}