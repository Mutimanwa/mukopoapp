import { useState, useEffect } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import apiClient from '../../services/api';

const TYPE_COLOR = {
  'Approbation': 'text-green-400',
  'Rejet': 'text-red-400',
  'Soumission': 'text-blue-400',
  'Paiement': 'text-muko-orange',
  'Utilisateur': 'text-cyan-400',
  'default': 'text-slate-400',
};

function getLogType(status) {
  if (status === 'Approuvée') return 'Approbation';
  if (status === 'Rejeté') return 'Rejet';
  if (status === 'Payé') return 'Paiement';
  return 'Soumission';
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      // On récupère toutes les dépenses et on les utilise comme journal d'audit
      const { data } = await apiClient.get('/expenses');

      // On aplatit les entrées d'historique de chaque dépense
      const auditEntries = [];
      data.forEach(exp => {
        // Entrée initiale (soumission)
        auditEntries.push({
          timestamp: new Date(exp.createdAt || exp.date).toLocaleString('fr-FR'),
          actor: exp.userId?.name || 'Inconnu',
          action: `Soumission note de frais - ${exp.category} - ${exp.amount} ${exp.currency || '€'}`,
          type: 'Soumission',
          id: exp._id + '_submit'
        });

        // Entrées d'historique (approuv, rejet, etc.)
        if (exp.history && exp.history.length > 0) {
          exp.history.forEach((h, idx) => {
            auditEntries.push({
              timestamp: new Date(h.date || exp.updatedAt).toLocaleString('fr-FR'),
              actor: h.updatedBy?.name || 'Système',
              action: `${getLogType(h.status)} de la note ${exp._id.substring(exp._id.length - 6).toUpperCase()} : "${h.comment || 'Aucun commentaire'}"`,
              type: getLogType(h.status),
              id: exp._id + '_h' + idx
            });
          });
        }
      });

      // Trier par date décroissante
      auditEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setLogs(auditEntries);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement du journal d'audit.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Journal d'activité système (Audit)</h1>
          <p className="text-slate-400 text-xs mt-1">Registre historique complet retraçant l'ensemble des opérations exécutées sur le noyau.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-[#1A263B] border border-slate-800 px-3 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw size={13} /> Actualiser
        </button>
      </div>

      <div className="bg-muko-card border border-slate-800/80 rounded-2xl overflow-hidden font-mono text-[11px]">
        <div className="p-4 bg-[#0B131F]/30 border-b border-slate-800 text-slate-500 uppercase tracking-wider font-bold flex items-center gap-2">
          <Shield size={14} className="text-muko-orange" />
          Flux d'événements temps réel
          {!loading && <span className="ml-auto text-xs text-slate-600 normal-case">{logs.length} entrées</span>}
        </div>

        <div className="p-4 space-y-3.5 divide-y divide-slate-800/40 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={14} /> Chargement du journal...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-400 flex items-center justify-center gap-2">
              <AlertTriangle size={14} /> {error}
            </div>
          ) : logs.length > 0 ? (
            logs.map((log) => {
              const colorClass = TYPE_COLOR[log.type] || TYPE_COLOR.default;
              return (
                <div key={log.id} className="flex items-start justify-between gap-4 pt-3 first:pt-0">
                  <div className="space-y-1">
                    <p className="text-slate-200">
                      <span className="text-slate-500 font-bold">[{log.timestamp}]</span> -{' '}
                      <span className="text-muko-orange font-bold">{log.actor}</span> : {log.action}
                    </p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider shrink-0 ${colorClass}`}>{log.type}</span>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-500">Aucun événement enregistré.</div>
          )}
        </div>
      </div>
    </div>
  );
}