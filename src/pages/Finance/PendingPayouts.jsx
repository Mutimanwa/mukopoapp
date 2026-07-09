import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Search, Landmark, Clock, FileText, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '../../services/api';
import { extractData } from '../../utils/dataHelpers';

export default function PendingPayouts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const { data } = await apiClient.get('/expenses');
        // Extraire les données correctement
        const expenses = extractData(data);
        
        // Vérifier que c'est un tableau
        if (!Array.isArray(expenses)) {
          console.error('Les dépenses ne sont pas un tableau:', expenses);
          setError("Format de données invalide.");
          setLoading(false);
          return;
        }

        // Garder uniquement celles qui sont Approuvées par le Manager
        const approved = expenses.filter(e => e.status === 'Approuvée');

        // Grouper par collaborateur
        const grouped = approved.reduce((acc, exp) => {
          const uId = exp.userId?._id || exp.userId || 'unknown';
          const uName = exp.userId?.name || 'Inconnu';
          if (!acc[uId]) {
            acc[uId] = {
              _id: uId,
              employee: uName,
              itemsCount: 0,
              total: 0,
              approvedBy: "Validation Manager"
            };
          }
          acc[uId].itemsCount += 1;
          acc[uId].total += (exp.amount || 0);
          return acc;
        }, {});

        setPayouts(Object.values(grouped));
      } catch (err) {
        console.error('Erreur fetchPayouts:', err);
        setError(err.response?.data?.message || "Impossible de charger les paiements en attente.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  const filteredPayouts = useMemo(() => {
    if (!Array.isArray(payouts)) return [];
    if (!search) return payouts;
    return payouts.filter(row =>
      row.employee?.toLowerCase().includes(search.toLowerCase()) ||
      row._id?.toLowerCase().includes(search.toLowerCase()) ||
      row.approvedBy?.toLowerCase().includes(search.toLowerCase())
    );
  }, [payouts, search]);

  const totalSum = useMemo(() => {
    if (!Array.isArray(filteredPayouts)) return 0;
    return filteredPayouts.reduce((sum, item) => sum + (item.total || 0), 0);
  }, [filteredPayouts]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Remboursements à libérer</h1>
        <p className="text-slate-400 text-xs mt-1">Sélectionnez un dossier pour insérer sa référence de transaction bancaire et archiver le paiement.</p>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Montant total à verser</span>
            <p className="text-xl font-black text-[#FF6B2C] font-mono">{totalSum.toFixed(2)} €</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/15 text-[#FF6B2C] flex items-center justify-center">
            <Landmark size={18} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Ordres de virements en attente</span>
            <p className="text-xl font-black text-white font-mono">{loading ? '...' : (Array.isArray(filteredPayouts) ? filteredPayouts.length : 0)} virements</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-400 flex items-center justify-center">
            <Clock size={18} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par bénéficiaire ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A263B] text-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-[#FF6B2C]/50 transition-colors"
            />
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                <th className="pb-3 px-4">Réf Dossier</th>
                <th className="pb-3 px-4">Bénéficiaire</th>
                <th className="pb-3 px-4">Volume groupé</th>
                <th className="pb-3 px-4">Validation d'origine</th>
                <th className="pb-3 px-4 text-right">Montant Net</th>
                <th className="pb-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Extraction des paiements...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-red-400">
                    <div className="flex justify-center items-center gap-2">
                      <AlertTriangle size={16} />
                      {error}
                    </div>
                  </td>
                </tr>
              ) : !Array.isArray(filteredPayouts) || filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                    Aucun virement en attente trouvé.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((row) => (
                  <tr key={row._id} className="hover:bg-[#0B131F]/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-400">
                      {row._id && typeof row._id === 'string' ? row._id.substring(row._id.length - 6).toUpperCase() : 'N/A'}
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">{row.employee || 'Inconnu'}</td>
                    <td className="py-4 px-4 text-slate-400">{row.itemsCount || 0} note{row.itemsCount > 1 ? 's' : ''} de frais</td>
                    <td className="py-4 px-4 text-slate-500 font-medium">✅ {row.approvedBy || 'Validation Manager'}</td>
                    <td className="py-4 px-4 font-mono font-bold text-white text-right">{(row.total || 0).toFixed(2)} €</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => navigate(`/finance/payer/${row._id}`)}
                        className="bg-[#1A263B] hover:bg-[#FF6B2C] hover:text-white text-slate-300 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-800 transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <CreditCard size={12} /> Émettre le virement
                      </button>
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