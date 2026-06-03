import React from 'react';
import { DownloadCloud, FileText, BarChart3, HelpCircle } from 'lucide-react';

export default function ExpenseReports() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Rapports & Clôtures comptables</h1>
        <p className="text-slate-400 text-xs mt-1">Compilez et exportez les rapports périodiques consolidés pour la liasse fiscale.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="w-9 h-9 bg-muko-orange/10 text-muko-orange rounded-xl flex items-center justify-center border border-muko-orange/10"><BarChart3 size={16} /></div>
          <div>
            <h4 className="text-xs font-bold text-white">Livre des Dépenses consolidées</h4>
            <p className="text-[11px] text-slate-500 mt-1">Export complet regroupant l'ensemble des dépenses par pôle projet et centre de coût.</p>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="text-[11px] font-bold text-white bg-muko-orange/10 hover:bg-muko-orange/20 border border-muko-orange/20 py-2 px-4 rounded-lg transition-colors cursor-pointer">Export .XLSX (Excel)</button>
            <button className="text-[11px] font-bold text-slate-400 hover:text-white bg-[#1A263B] py-2 px-4 rounded-lg border border-slate-800 transition-colors cursor-pointer">Export .PDF</button>
          </div>
        </div>

        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="w-9 h-9 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center border border-green-500/10"><FileText size={16} /></div>
          <div>
            <h4 className="text-xs font-bold text-white">Synthèse des Remboursements mensuels</h4>
            <p className="text-[11px] text-slate-500 mt-1">Tableau analytique récapitulant les délais de virement moyens et les sommes décaissées.</p>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="text-[11px] font-bold text-white bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 py-2 px-4 rounded-lg transition-colors cursor-pointer">Export .XLSX (Excel)</button>
          </div>
        </div>
      </div>
    </div>
  );
}