import { useState, useEffect } from 'react';
import { Eye, Download, Search, FileText, Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '../../services/api';

export default function ReceiptsGallery() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        // On suppose que les justificatifs sont liés aux dépenses
        const { data } = await apiClient.get('/expenses/my-expenses');
        const receiptsFromExpenses = data.filter(exp => exp.receiptUrl).map(exp => ({
          _id: exp._id,
          name: exp.receiptUrl.split('/').pop(), // Extrait le nom du fichier de l'URL
          size: 'N/A', // La taille n'est pas dans le modèle Expense
          date: exp.date,
          url: exp.receiptUrl
        }));
        setReceipts(receiptsFromExpenses);
      } catch (err) {
        setError("Impossible de charger les justificatifs.");
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

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
      {loading ? (
        <div className="text-center py-10 text-slate-500"><Loader2 className="inline-block animate-spin" /> Chargement...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-400"><AlertTriangle className="inline-block mr-2" /> {error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {receipts.length === 0 ? (
            <p className="col-span-full text-center text-slate-500 py-10">Aucun justificatif trouvé.</p>
          ) : (
            receipts.map((file) => (
              <div key={file._id} className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between group hover:border-slate-700/80 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1A263B] text-muko-orange flex items-center justify-center border border-slate-800 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="truncate space-y-1">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-muko-orange transition-colors">{file.name}</h4>
                    <p className="text-[10px] font-mono text-slate-500">{file.size} • {new Date(file.date).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Actions de fichiers */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800/40">
                  <button className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white bg-[#0B131F]/60 py-2 rounded-lg border border-slate-800/60 transition-colors cursor-pointer">
                    <Eye size={12} /> Aperçu
                  </button>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white bg-muko-orange/10 hover:bg-muko-orange/20 border border-muko-orange/20 py-2 rounded-lg transition-colors cursor-pointer">
                    <Download size={12} className="text-muko-orange" /> Ouvrir
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}