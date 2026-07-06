import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, Calendar, ShieldCheck, Printer, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '../../services/api';

export default function RefundDetail() {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const { data } = await apiClient.get('/expenses/myexpenses');
        // Filtrer les dépenses payées
        const paidExpenses = data.filter(e => e.status === 'Payé');
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

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
      <Loader2 className="animate-spin" size={20} /> Chargement...
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 mb-4 cursor-pointer">
          <ArrowLeft size={14} /> Retour
        </button>
        <h1 className="text-2xl font-bold text-white tracking-tight">Mes remboursements</h1>
        <p className="text-slate-400 text-xs mt-1">Historique complet de vos remboursements.</p>
      </div>

      {error ? (
        <div className="text-center py-10 text-red-400 flex items-center justify-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      ) : (
        <>
          {/* Résumé */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Total remboursé</span>
                <p className="text-2xl font-black text-green-400 font-mono">{totalRefunded.toFixed(2)} €</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
                <Landmark size={22} />
              </div>
            </div>

            <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Nombre de remboursements</span>
                <p className="text-2xl font-black text-white font-mono">{refunds.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 flex items-center justify-center">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          {/* Liste des remboursements */}
          <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl overflow-hidden">
            <div className="p-4 bg-[#0B131F]/30 border-b border-slate-800 text-slate-500 uppercase tracking-wider font-bold text-xs flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#FF6B2C]" />
              Historique des paiements
            </div>

            <div className="divide-y divide-slate-800/40">
              {refunds.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>Aucun remboursement effectué.</p>
                </div>
              ) : (
                refunds.map((refund, index) => (
                  <div key={refund._id} className="p-6 hover:bg-[#0B131F]/20 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-[#FF6B2C] font-bold">
                            #REF-{refund._id.substring(refund._id.length - 6).toUpperCase()}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            Remboursé
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {refund.category} • {new Date(refund.updatedAt || refund.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white font-mono">{refund.amount.toFixed(2)} {refund.currency}</p>
                        <p className="text-[10px] text-slate-500">Payé le {new Date(refund.updatedAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}