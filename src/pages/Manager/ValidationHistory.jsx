import { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle, Clock, Calendar, Loader2, AlertTriangle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';

export default function ValidationHistory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await apiClient.get('/expenses');
        // Filtrer les dépenses approuvées ou rejetées
        const processed = data.filter(e => e.status === 'Approuvée' || e.status === 'Rejeté');
        // Trier par date décroissante
        processed.sort((a, b) => new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date));
        setHistory(processed);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'historique.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(row => {
    const employeeName = row.userId?.name || 'Inconnu';
    const matchesSearch = employeeName.toLowerCase().includes(search.toLowerCase()) ||
      row._id.toLowerCase().includes(search.toLowerCase()) ||
      row.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'Tous' || row.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const approvedCount = history.filter(item => item.status === 'Approuvée').length;
  const approvedTotal = history
    .filter(item => item.status === 'Approuvée')
    .reduce((sum, item) => sum + (item.amount || 0), 0);
  const rejectedCount = history.filter(item => item.status === 'Rejeté').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Historique des arbitrages</h1>
          <p className="text-slate-400 text-xs mt-1">Consultez l'historique complet des notes approuvées ou rejetées.</p>
        </div>
        <button
          onClick={() => navigate('/validation/attente')}
          className="bg-[#FF6B2C] hover:bg-opacity-90 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all cursor-pointer"
        >
          <Clock size={14} /> Nouvelles demandes
        </button>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Approuvées</span>
            <p className="text-xl font-black text-white font-mono">{loading ? '...' : approvedCount} dossiers</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Montant approuvé</span>
            <p className="text-xl font-black text-[#FF6B2C] font-mono">{loading ? '...' : `${approvedTotal.toFixed(2)} €`}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/15 text-[#FF6B2C] flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Refusées</span>
            <p className="text-xl font-black text-white font-mono">{loading ? '...' : rejectedCount} dossiers</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 flex items-center justify-center">
            <XCircle size={18} />
          </div>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par dossier ou collaborateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A263B] text-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-[#FF6B2C]/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['Tous', 'Approuvée', 'Rejeté'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-[#FF6B2C] text-white border-transparent'
                    : 'bg-[#1A263B] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {status === 'Tous' ? '📋 Tous' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                <th className="pb-3 px-4">ID</th>
                <th className="pb-3 px-4">Collaborateur</th>
                <th className="pb-3 px-4">Catégorie</th>
                <th className="pb-3 px-4">Date</th>
                <th className="pb-3 px-4 text-right">Montant</th>
                <th className="pb-3 px-4 text-right">Décision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    <Loader2 className="inline-block animate-spin mr-2" size={16} />
                    Chargement...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-red-400">
                    <AlertTriangle className="inline-block mr-2" size={16} />
                    {error}
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                    Aucun historique trouvé.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((row) => (
                  <tr key={row._id} className="hover:bg-[#0B131F]/30 transition-colors cursor-pointer" 
                      onClick={() => navigate(`/note-detail/${row._id}`)}>
                    <td className="py-4 px-4 font-mono font-bold text-slate-400">
                      #{row._id.substring(row._id.length - 6).toUpperCase()}
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">{row.userId?.name || 'Inconnu'}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#1A263B] text-slate-300 border border-slate-800/50">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(row.updatedAt || row.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-white">
                      {row.amount.toFixed(2)} {row.currency || '€'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        row.status === 'Approuvée'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {row.status === 'Approuvée' ? '✅ Approuvée' : '❌ Rejetée'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredHistory.length > 0 && (
          <div className="pt-4 border-t border-slate-800/60 text-xs text-slate-500">
            Affichage de {filteredHistory.length} résultat{filteredHistory.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}