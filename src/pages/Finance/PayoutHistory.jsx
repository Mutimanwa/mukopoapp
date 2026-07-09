import { useState, useEffect, useMemo } from 'react';
import { Landmark, Search, Download, FileText, CheckCircle2, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '../../services/api';
import { extractData } from '../../utils/dataHelpers';

export default function PayoutHistory() {
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await apiClient.get('/expenses?status=Payé');
        // Extraire les données correctement
        const expenses = extractData(data);
        
        // Vérifier que c'est un tableau
        if (!Array.isArray(expenses)) {
          console.error('Les dépenses ne sont pas un tableau:', expenses);
          setError("Format de données invalide.");
          setLoading(false);
          return;
        }

        setHistory(expenses);
      } catch (err) {
        console.error('Erreur fetchHistory:', err);
        setError(err.response?.data?.message || "Impossible de charger l'historique.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Filtrer l'historique
  const filteredHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];
    if (!search) return history;
    return history.filter(row =>
      row.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      row._id?.toLowerCase().includes(search.toLowerCase()) ||
      row.category?.toLowerCase().includes(search.toLowerCase())
    );
  }, [history, search]);

  // Calculer le total
  const totalSum = useMemo(() => {
    if (!Array.isArray(filteredHistory)) return 0;
    return filteredHistory.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [filteredHistory]);

  // Compter les éléments valides
  const validHistoryCount = Array.isArray(filteredHistory) ? filteredHistory.length : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Historique des décaissements</h1>
          <p className="text-slate-400 text-xs mt-1">Journal complet des remboursements archivés et lettrés en comptabilité.</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-[#1A263B] border border-slate-800 text-slate-300 hover:text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer">
            <Download size={14} /> Exporter en CSV
          </button>
          <button className="bg-[#1A263B] border border-slate-800 text-slate-300 hover:text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer">
            <FileText size={14} /> Exporter en PDF
          </button>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Total décaissé</span>
            <p className="text-xl font-black text-green-400 font-mono">{totalSum.toFixed(2)} €</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Règlements archivés</span>
            <p className="text-xl font-black text-white font-mono">{loading ? '...' : `${validHistoryCount} virements`}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/15 text-[#FF6B2C] flex items-center justify-center">
            <Landmark size={18} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Méthode préférée</span>
            <p className="text-xl font-black text-white font-mono">SEPA (92%)</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 flex items-center justify-center">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>

      {/* Recherche et Table */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher par salarié ou référence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A263B] text-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-[#FF6B2C]/50 transition-colors"
          />
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                <th className="pb-3 px-4">Réf Interne</th>
                <th className="pb-3 px-4">Salarié</th>
                <th className="pb-3 px-4">Date Paiement</th>
                <th className="pb-3 px-4">Mode / Référence Bancaire</th>
                <th className="pb-3 px-4 text-right">Montant Clôturé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">
                    <Loader2 className="inline-block animate-spin mr-2" />Chargement...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-red-400">
                    <AlertTriangle className="inline-block mr-2" />{error}
                  </td>
                </tr>
              ) : !Array.isArray(filteredHistory) || filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">
                    Aucun historique de décaissement ne correspond à vos critères.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-[#0B131F]/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-400">
                      REM-{item._id?.slice(-6)?.toUpperCase() || 'N/A'}
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      {item.userId?.name || 'Inconnu'}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400">
                      <div className="flex items-center gap-1.5 py-1">
                        <Landmark size={12} className="text-slate-600 shrink-0" />
                        <span>Virement (TR-{item._id?.slice(-8)?.toUpperCase() || 'N/A'})</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-green-400 font-mono">
                      {(item.amount || 0).toFixed(2)} {item.currency || '€'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}