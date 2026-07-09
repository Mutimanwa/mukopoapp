import { useState, useEffect } from 'react';
import { Eye, Download, Search, FileText, Loader2, AlertTriangle, Image, File } from 'lucide-react';
import apiClient from '../../services/api';
import { extractData } from '../../utils/dataHelpers';

export default function ReceiptsGallery() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const { data } = await apiClient.get('/expenses/myexpenses');
        const expenses = extractData(data);
        
        const receiptsFromExpenses = expenses
          .filter(exp => exp.receiptUrl)
          .map(exp => ({
            _id: exp._id,
            name: exp.receiptUrl.split('/').pop() || `justificatif-${exp._id}.pdf`,
            category: exp.category,
            date: exp.date,
            amount: exp.amount,
            currency: exp.currency,
            url: exp.receiptUrl,
            status: exp.status
          }));
        setReceipts(receiptsFromExpenses);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les justificatifs.");
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  const filteredReceipts = receipts.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
      <Loader2 className="animate-spin" size={20} /> Chargement...
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mes justificatifs</h1>
          <p className="text-slate-400 text-xs mt-1">Coffre-fort numérique de vos reçus et preuves d'achats.</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher un reçu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111C2E] text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-[#FF6B2C]/40 transition-colors"
          />
        </div>
      </div>

      {error ? (
        <div className="text-center py-10 text-red-400 flex items-center justify-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReceipts.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-16">
              <FileText size={48} className="mx-auto text-slate-700 mb-4" />
              <p>Aucun justificatif trouvé.</p>
              <p className="text-xs text-slate-600 mt-2">Ajoutez un justificatif lors de la création d'une note de frais.</p>
            </div>
          ) : (
            filteredReceipts.map((file) => (
              <div key={file._id} className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between group hover:border-slate-700/80 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1A263B] text-[#FF6B2C] flex items-center justify-center border border-slate-800 shrink-0">
                    {file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <Image size={20} />
                    ) : (
                      <File size={20} />
                    )}
                  </div>
                  <div className="truncate space-y-1 flex-1">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-[#FF6B2C] transition-colors">
                      {file.name}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-500">
                      {file.category} • {new Date(file.date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      {file.amount.toFixed(2)} {file.currency}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/40">
                  <button className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white bg-[#0B131F]/60 py-2 rounded-lg border border-slate-800/60 transition-colors cursor-pointer">
                    <Eye size={12} /> Aperçu
                  </button>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white bg-[#FF6B2C]/10 hover:bg-[#FF6B2C]/20 border border-[#FF6B2C]/20 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download size={12} className="text-[#FF6B2C]" /> Télécharger
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