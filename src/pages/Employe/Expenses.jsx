import { useState, useEffect } from 'react';
import { Calendar, Filter, Download, Printer, Utensils, Train, Hotel, ShoppingBag, Fuel, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import { extractData } from '../../utils/dataHelpers';

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'restauration': return Utensils;
    case 'transport': return Train;
    case 'hébergement': return Hotel;
    case 'fournitures': return ShoppingBag;
    case 'carburant': return Fuel;
    default: return ShoppingBag;
  }
};

export default function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data } = await apiClient.get('/expenses/myexpenses');
        const expensesData = extractData(data);
        setExpenses(expensesData);
        
        if (data.total !== undefined) {
          setPagination({
            total: data.total,
            page: data.page || 1,
            totalPages: data.totalPages || 1
          });
        }
      } catch (err) {
        console.error('Erreur fetchExpenses:', err);
        setError(err.response?.data?.message || "Erreur de chargement des dépenses.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const totalAmount = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);
  const pendingTotal = expenses.filter(e => e.status === 'En attente').reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Dépensé</span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-black text-white font-mono tracking-tight">{loading ? '...' : `${totalAmount.toFixed(2)} €`}</h2>
              <span className="text-[10px] font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded-md border border-red-500/20">
                {expenses.length} notes
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-20 mt-6 w-full opacity-60 group-hover:opacity-80 transition-opacity">
            <div className="bg-linear-to-t from-[#FF6B2C]/40 to-[#FF6B2C]/10 w-full h-[40%] rounded-t-lg"></div>
            <div className="bg-linear-to-t from-[#FF6B2C]/40 to-[#FF6B2C]/10 w-full h-[60%] rounded-t-lg"></div>
            <div className="bg-linear-to-t from-[#FF6B2C]/40 to-[#FF6B2C]/10 w-full h-[85%] rounded-t-lg"></div>
            <div className="bg-linear-to-t from-[#FF6B2C]/40 to-[#FF6B2C]/10 w-full h-[55%] rounded-t-lg"></div>
          </div>
        </div>

        <div className="bg-linear-to-br from-[#FF6B2C] to-[#E25316] rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl shadow-[#FF6B2C]/10">
          <div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
              <Printer size={18} />
            </div>
            <h3 className="text-base font-bold mt-4">En Attente</h3>
            <p className="text-white/70 text-xs mt-0.5">{expenses.filter(e => e.status === 'En attente').length} notes en attente</p>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black font-mono">{pendingTotal.toFixed(2)} €</div>
            <button
              onClick={() => navigate('/nouvelle-note')}
              className="w-full bg-[#0B131F] text-white hover:bg-opacity-90 font-semibold text-xs py-3 px-4 rounded-xl mt-3 transition-all active:scale-[0.98] cursor-pointer"
            >
              Nouvelle Note
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-[#1A263B] text-slate-300 text-xs px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2 hover:text-white">
              <Calendar size={14} /> Toutes
            </button>
            <button className="bg-[#1A263B] text-slate-300 text-xs px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2 hover:text-white">
              <Filter size={14} /> Filtrer
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-[#1A263B] border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
              <Download size={16} />
            </button>
            <button className="p-2.5 bg-[#1A263B] border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
              <Printer size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="pb-4">Date</th>
                <th className="pb-4">Catégorie</th>
                <th className="pb-4 text-right">Montant</th>
                <th className="pb-4 text-right">Statut</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    <Loader2 className="inline-block animate-spin mr-2" size={16} /> Chargement...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-red-400">
                    <AlertTriangle className="inline-block mr-2" size={16} /> {error}
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">Aucune dépense.</td>
                </tr>
              ) : (
                expenses.map((exp) => {
                  const IconComponent = getCategoryIcon(exp.category);
                  return (
                    <tr key={exp._id} className="hover:bg-[#0B131F]/30 transition-colors">
                      <td className="py-4 text-slate-400">{new Date(exp.date).toLocaleDateString('fr-FR')}</td>
                      <td className="py-4 font-semibold text-white flex items-center gap-2.5">
                        <span className="text-[#FF6B2C]"><IconComponent size={15} /></span>
                        {exp.category}
                      </td>
                      <td className="py-4 text-right font-mono font-bold text-sm text-white">{exp.amount.toFixed(2)} {exp.currency}</td>
                      <td className="py-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium border ${exp.status === 'Approuvée' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          exp.status === 'En attente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          exp.status === 'Payé' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                          {exp.status || 'En attente'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => navigate(`/note-detail/${exp._id}`)}
                          className="text-[#FF6B2C] hover:text-white transition-colors cursor-pointer"
                        >
                          Détails →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-500">
            <div>Affichage de 1-{pagination.total} sur {pagination.total} transactions</div>
          </div>
        )}
      </div>
    </div>
  );
}