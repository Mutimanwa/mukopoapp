import { useState, useEffect } from 'react';
import { Shield, Loader2, AlertTriangle, RefreshCw, User, Clock, Activity, Filter } from 'lucide-react';
import apiClient from '../../services/api';

const TYPE_COLOR = {
  'Approbation': 'text-green-400',
  'Rejet': 'text-red-400',
  'Soumission': 'text-blue-400',
  'Paiement': 'text-[#FF6B2C]',
  'Utilisateur': 'text-cyan-400',
  'Modification': 'text-amber-400',
  'default': 'text-slate-400',
};

const TYPE_ICON = {
  'Approbation': '✅',
  'Rejet': '❌',
  'Soumission': '📤',
  'Paiement': '💰',
  'Utilisateur': '👤',
  'Modification': '✏️',
  'default': '📋',
};

function getLogType(status) {
  if (status === 'Approuvée' || status === 'Approuvé') return 'Approbation';
  if (status === 'Rejeté') return 'Rejet';
  if (status === 'Payé') return 'Paiement';
  if (status === 'Modification') return 'Modification';
  return 'Soumission';
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Tous');

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Récupérer toutes les dépenses
      const { data } = await apiClient.get('/expenses');

      // Construire le journal d'audit
      const auditEntries = [];
      
      data.forEach(exp => {
        // Entrée initiale (soumission)
        auditEntries.push({
          timestamp: new Date(exp.createdAt || exp.date).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          actor: exp.userId?.name || 'Inconnu',
          action: `Soumission - ${exp.category} - ${exp.amount.toFixed(2)} ${exp.currency || '€'}`,
          type: 'Soumission',
          id: exp._id + '_submit',
          userId: exp.userId?._id,
          category: exp.category
        });

        // Entrées d'historique
        if (exp.history && exp.history.length > 0) {
          exp.history.forEach((h, idx) => {
            const type = getLogType(h.status);
            auditEntries.push({
              timestamp: new Date(h.updatedAt || Date.now()).toLocaleString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              actor: h.updatedBy?.name || 'Système',
              action: `${type} - ${exp._id.substring(exp._id.length - 6).toUpperCase()} : "${h.comment || 'Aucun commentaire'}"`,
              type: type,
              id: exp._id + '_h' + idx,
              userId: h.updatedBy?._id,
              category: exp.category
            });
          });
        }
      });

      // Ajouter les logs utilisateurs (création/modification/suppression)
      try {
        const usersRes = await apiClient.get('/users');
        usersRes.data.forEach(user => {
          auditEntries.push({
            timestamp: new Date(user.createdAt).toLocaleString('fr-FR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            actor: 'Système',
            action: `Création utilisateur - ${user.name} (${user.email}) [${user.role}]`,
            type: 'Utilisateur',
            id: user._id + '_create',
            userId: user._id
          });
        });
      } catch (e) {
        // Ignorer les erreurs de récupération des utilisateurs
      }

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

  const filteredLogs = filter === 'Tous' 
    ? logs 
    : logs.filter(log => log.type === filter);

  const logTypes = ['Tous', ...new Set(logs.map(log => log.type))];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Journal d'audit</h1>
          <p className="text-slate-400 text-xs mt-1">Registre complet retraçant l'ensemble des opérations.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-[#1A263B] border border-slate-800 px-3 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> 
          {loading ? 'Chargement...' : 'Actualiser'}
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4">
          <p className="text-2xl font-black text-white">{logs.length}</p>
          <p className="text-[10px] text-slate-500 font-mono">Total événements</p>
        </div>
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4">
          <p className="text-2xl font-black text-green-400">
            {logs.filter(l => l.type === 'Approbation').length}
          </p>
          <p className="text-[10px] text-slate-500 font-mono">Approbations</p>
        </div>
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4">
          <p className="text-2xl font-black text-red-400">
            {logs.filter(l => l.type === 'Rejet').length}
          </p>
          <p className="text-[10px] text-slate-500 font-mono">Rejets</p>
        </div>
        <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4">
          <p className="text-2xl font-black text-[#FF6B2C]">
            {logs.filter(l => l.type === 'Paiement').length}
          </p>
          <p className="text-[10px] text-slate-500 font-mono">Paiements</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          {logTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                filter === type
                  ? 'bg-[#FF6B2C] text-white border-transparent'
                  : 'bg-[#1A263B] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {type === 'Tous' ? '📋 Tous' : `${TYPE_ICON[type] || '📋'} ${type}`}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <Activity size={12} /> {filteredLogs.length} entrées
          </span>
        </div>
      </div>

      {/* Liste des logs */}
      <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl overflow-hidden font-mono text-[11px]">
        <div className="p-4 bg-[#0B131F]/30 border-b border-slate-800 text-slate-500 uppercase tracking-wider font-bold flex items-center gap-2">
          <Shield size={14} className="text-[#FF6B2C]" />
          Flux d'événements
        </div>

        <div className="p-4 space-y-3.5 divide-y divide-slate-800/40 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={14} /> Chargement...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-400 flex items-center justify-center gap-2">
              <AlertTriangle size={14} /> {error}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <Shield size={24} className="mx-auto text-slate-700 mb-2" />
              Aucun événement enregistré.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const colorClass = TYPE_COLOR[log.type] || TYPE_COLOR.default;
              const icon = TYPE_ICON[log.type] || '📋';
              return (
                <div key={log.id} className="flex items-start justify-between gap-4 pt-3 first:pt-0 hover:bg-[#0B131F]/20 -mx-2 px-2 py-2 rounded-xl transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#FF6B2C] font-bold">{icon}</span>
                      <span className="text-slate-500 font-bold text-[10px]">[{log.timestamp}]</span>
                      <span className="text-[#FF6B2C] font-bold text-xs">{log.actor}</span>
                      <span className="text-slate-400 text-xs">:</span>
                      <span className="text-slate-200 text-xs">{log.action}</span>
                    </div>
                    {log.category && (
                      <div className="text-[9px] text-slate-600 font-mono">
                        Catégorie: {log.category}
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider shrink-0 ${colorClass}`}>
                    {log.type}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}