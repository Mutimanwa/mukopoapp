import React from 'react';
import { FolderOpen, Eye, Download, Search, FileText } from 'lucide-react';

export default function ReceiptsGallery() {
  const receipts = [
    { id: 1, name: "Facture_Hotel_Nil.pdf", size: "1.2 MB", date: "28 Mai 2026", type: "application/pdf" },
    { id: 2, name: "Recu_Bistro_Bujumbura.jpg", size: "840 KB", date: "25 Mai 2026", type: "image/jpeg" },
    { id: 3, name: "Ticket_SNCF_Voyage.pdf", size: "420 KB", date: "10 Oct 2025", type: "application/pdf" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mes justificatifs</h1>
          <p className="text-slate-400 text-xs mt-1">Coffre-fort numérique de stockage de vos reçus et preuves d'achats.</p>
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Rechercher un reçu..." 
            className="w-full bg-muko-card text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-muko-orange/40 transition-colors"
          />
        </div>
      </div>

      {/* Grille de documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {receipts.map((file) => (
          <div key={file.id} className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between group hover:border-slate-700/80 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1A263B] text-muko-orange flex items-center justify-center border border-slate-800 shrink-0">
                <FileText size={20} />
              </div>
              <div className="truncate space-y-1">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-muko-orange transition-colors">{file.name}</h4>
                <p className="text-[10px] font-mono text-slate-500">{file.size} • {file.date}</p>
              </div>
            </div>

            {/* Actions de fichiers */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800/40">
              <button className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white bg-[#0B131F]/60 py-2 rounded-lg border border-slate-800/60 transition-colors cursor-pointer">
                <Eye size={12} /> Aperçu
              </button>
              <button className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white bg-muko-orange/10 hover:bg-muko-orange/20 border border-muko-orange/20 py-2 rounded-lg transition-colors cursor-pointer">
                <Download size={12} className="text-muko-orange" /> Ouvrir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}