import React from 'react';
import { Shield, Key, Database } from 'lucide-react';

export default function AuditLogs() {
  const systemLogs = [
    { timestamp: "03/06/2026 14:22", actor: "Admin", action: "Modification circuit d'approbation", type: "Gouvernance", color: "text-cyan-400" },
    { timestamp: "03/06/2026 10:05", actor: "Système", action: "Sauvegarde de la base de données réussie", type: "Fichier", color: "text-green-400" },
    { timestamp: "02/06/2026 17:48", actor: "C. Nkurunziza", action: "Clôture du lot de remboursement REM-001", type: "Finance", color: "text-muko-orange" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Journal d'activité système (Audit)</h1>
        <p className="text-slate-400 text-xs mt-1">Registre historique complet retraçant l'ensemble des opérations exécutées sur le noyau.</p>
      </div>

      <div className="bg-muko-card border border-slate-800/80 rounded-2xl overflow-hidden font-mono text-[11px]">
        <div className="p-4 bg-[#0B131F]/30 border-b border-slate-800 text-slate-500 uppercase tracking-wider font-bold">Flux d'événements temps réel</div>
        
        <div className="p-4 space-y-3.5 divide-y divide-slate-800/40">
          {systemLogs.map((log, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 pt-3 first:pt-0">
              <div className="space-y-1">
                <p className="text-slate-200"><span className="text-slate-500 font-bold">[{log.timestamp}]</span> - <span className="text-muko-orange font-bold">{log.actor}</span> : {log.action}</p>
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${log.color}`}>{log.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}