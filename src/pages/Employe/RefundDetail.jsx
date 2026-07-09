import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Landmark,
  Calendar,
  ShieldCheck,
  Printer,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Download,
  FileText,
  CreditCard,
  Clock,
  TrendingUp,
  Wallet
} from 'lucide-react';
import apiClient from '../../services/api';
import { extractData } from '../../utils/dataHelpers';

export default function RefundDetail() {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Tous');

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const { data } = await apiClient.get('/expenses/myexpenses');
        const expenses = extractData(data);
        
        const paidExpenses = expenses.filter(e => e.status === 'Payé' || e.status === 'Approuvée');
        paidExpenses.sort((a, b) => new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date));
        setRefunds(paidExpenses);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les remboursements.");
      } finally {
        setLoading(false);
      }
    };
    fetchRefunds();
  }, []);

  const totalRefunded = refunds.reduce((sum, item) => sum + (item.amount || 0), 0);
  const pendingRefunds = refunds.filter(e => e.status === 'Approuvée');
  const pendingTotal = pendingRefunds.reduce((sum, item) => sum + (item.amount || 0), 0);
  const paidRefunds = refunds.filter(e => e.status === 'Payé');
  const paidTotal = paidRefunds.reduce((sum, item) => sum + (item.amount || 0), 0);

  const filteredRefunds = refunds.filter(item => {
    if (selectedFilter === 'Payé') return item.status === 'Payé';
    if (selectedFilter === 'Approuvée') return item.status === 'Approuvée';
    return true;
  });

  const handleExport = () => {
    alert('Export CSV en cours de développement...');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
      <Loader2 className="animate-spin" size={20} /> Chargement...
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Retour
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Mes remboursements</h1>
            <p className="text-slate-400 text-xs mt-1">Historique complet de vos remboursements.</p>
          </div>
          <button
            onClick={handleExport}
            className="bg-[#1A263B] hover:bg-opacity-80 text-slate-300 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-800 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download size={14} /> Exporter CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Total remboursé</span>
            <p className="text-2xl font-black text-green-400 font-mono">
              {totalRefunded.toFixed(2)} €
            </p>
            <span className="text-[10px] text-slate-500">{refunds.length} transactions</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
            <Wallet size={22} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">En attente</span>
            <p className="text-2xl font-black text-amber-400 font-mono">
              {pendingTotal.toFixed(2)} €
            </p>
            <span className="text-[10px] text-slate-500">{pendingRefunds.length} demandes</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-400 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Déjà payé</span>
            <p className="text-2xl font-black text-blue-400 font-mono">
              {paidTotal.toFixed(2)} €
            </p>
            <span className="text-[10px] text-slate-500">{paidRefunds.length} virements</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 flex items-center justify-center">
            <CreditCard size={22} />
          </div>
        </div>
      </div>

      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {['Tous', 'Payé', 'Approuvée'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${selectedFilter === filter
                  ? 'bg-[#FF6B2C] text-white border-transparent'
                  : 'bg-[#1A263B] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
            >
              {filter === 'Tous' ? '📋 Tous' : filter === 'Payé' ? '✅ Payés' : '⏳ En attente'}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            {filteredRefunds.length} résultat{filteredRefunds.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          {error ? (
            <div className="text-center py-10 text-red-400 flex items-center justify-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          ) : filteredRefunds.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-[#1A263B] flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-slate-600" />
              </div>
              <p className="font-medium">Aucun remboursement trouvé</p>
              <p className="text-xs text-slate-600 mt-1">
                {selectedFilter === 'Tous'
                  ? 'Vous n\'avez pas encore de remboursements.'
                  : `Aucun remboursement ${selectedFilter === 'Payé' ? 'payé' : 'en attente'}.`}
              </p>
            </div>
          ) : (
            filteredRefunds.map((refund) => (
              <div
                key={refund._id}
                className="bg-[#1A263B]/40 border border-slate-800/60 rounded-xl p-5 hover:border-slate-700/80 transition-all group"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${refund.status === 'Payé'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                      {refund.status === 'Payé' ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Clock size={18} />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-mono text-[#FF6B2C] font-bold">
                          #REF-{refund._id.substring(refund._id.length - 6).toUpperCase()}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${refund.status === 'Payé'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                          {refund.status === 'Payé' ? '✅ Remboursé' : '⏳ En attente'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A263B] text-slate-400 border border-slate-800">
                          {refund.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(refund.date).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {refund.project && (
                          <span className="flex items-center gap-1">
                            <FileText size={12} />
                            {refund.project}
                          </span>
                        )}
                        {refund.description && (
                          <span className="text-slate-500 truncate max-w-[200px]">
                            "{refund.description}"
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-lg font-bold text-white font-mono">
                      {refund.amount.toFixed(2)} {refund.currency || '€'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {refund.status === 'Payé'
                        ? `Payé le ${new Date(refund.updatedAt).toLocaleDateString('fr-FR')}`
                        : 'En attente de validation'
                      }
                    </p>
                    <button
                      onClick={() => navigate(`/note-detail/${refund._id}`)}
                      className="text-[10px] font-semibold text-[#FF6B2C] hover:text-white transition-colors flex items-center gap-1 ml-auto"
                    >
                      Voir détails →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredRefunds.length > 0 && (
          <div className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="text-slate-500">
              Affichage de {filteredRefunds.length} remboursement{filteredRefunds.length > 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <TrendingUp size={12} className="text-[#FF6B2C]" />
                Total: <span className="text-white font-bold font-mono">
                  {filteredRefunds.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2)} €
                </span>
              </span>
              <button className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                <Printer size={12} /> Imprimer
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-[#FF6B2C]/10 to-transparent border border-[#FF6B2C]/20 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/20 text-[#FF6B2C] flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Processus de remboursement</h4>
            <p className="text-xs text-slate-400">
              Les remboursements sont effectués dans un délai de 5 à 10 jours ouvrables après approbation.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Service actif
        </div>
      </div>
    </div>
  );
}