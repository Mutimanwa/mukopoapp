import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Landmark, DollarSign, Calendar, FileText, User, Loader2, AlertTriangle } from 'lucide-react';
import Input from '../../components/UI/Input';
import apiClient from '../../services/api';

export default function PayoutDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expenses, setExpenses] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPayouts = async () => {
      try {
        const { data } = await apiClient.get('/expenses');
        // Filtre les dépenses approuvées de l'utilisateur concerné
        const userExpenses = data.filter(e => e.status === 'Approuvée' && (e.userId?._id === id || e.userId === id));

        if (userExpenses.length === 0) {
          setError("Aucun versement en attente pour cet utilisateur.");
          setLoading(false);
          return;
        }

        setExpenses(userExpenses);
        setTotal(userExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0));

        // Simuler des infos bancaires (si non présentes dans User)
        setEmployeeInfo({
          name: userExpenses[0].userId?.name || 'Inconnu',
          dept: 'Support & Opérations',
          bank: 'Interbank Burundi (IBB)',
          iban: 'BI76 0000 0000 0000 0000 0000 00'
        });
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des notes de frais.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserPayouts();
  }, [id]);

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (expenses.length === 0) return;
    setProcessing(true);
    try {
      await Promise.all(expenses.map(exp =>
        apiClient.put(`/expenses/${exp._id}/status`, { status: 'Payé', comment: 'Remboursement traité par Finance' })
      ));
      navigate('/finance/attente');
    } catch (err) {
      console.error("Erreur de paiement", err);
      alert("Une erreur est survenue lors du paiement.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={14} /> Annuler le traitement
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {loading ? (
          <div className="lg:col-span-12 p-8 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={16} /> Chargement des détails du décaissement...
          </div>
        ) : error ? (
          <div className="lg:col-span-12 p-8 text-center text-red-500 font-bold flex items-center justify-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        ) : employeeInfo ? (
          <>
            {/* Bordereau de virement (Style ticket de caisse / facture physique premium - 7 colonnes) */}
            <div className="lg:col-span-7 bg-muko-card border border-slate-800/80 rounded-2xl overflow-hidden relative">
              {/* Ruban orange décoratif */}
              <div className="h-1.5 w-full bg-linear-to-r from-[#FF6B2C] to-amber-500"></div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start border-b border-slate-800/60 pb-6">
                  <div>
                    <span className="text-[10px] font-mono text-[#FF6B2C] uppercase tracking-widest font-bold">Ordre de Virement Interne</span>
                    <h2 className="text-lg font-black text-white font-mono mt-0.5">PAY-{id.substring(id.length - 6).toUpperCase()}</h2>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-muko-orange/10 border border-muko-orange/20 flex items-center justify-center text-muko-orange">
                    <Landmark size={18} />
                  </div>
                </div>

                {/* Fiche technique de transfert */}
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5">
                    <span className="text-slate-500 flex items-center gap-1.5"><User size={13} /> Salarié destinataire :</span>
                    <span className="text-white font-bold">{employeeInfo.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5">
                    <span className="text-slate-500">Service / Département :</span>
                    <span className="text-white font-medium">{employeeInfo.dept}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5">
                    <span className="text-slate-500">Établissement Bancaire :</span>
                    <span className="text-white font-medium">{employeeInfo.bank}</span>
                  </div>
                  <div className="flex flex-col space-y-1 border-b border-slate-800/40 pb-2.5">
                    <span className="text-slate-500">IBAN de destination :</span>
                    <span className="text-white font-mono font-semibold tracking-wider bg-[#0B131F]/60 p-2.5 rounded-lg border border-slate-800/50 mt-1 select-all">
                      {employeeInfo.iban}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-slate-500">Motif de règlement :</span>
                    <span className="text-slate-300 italic bg-[#0B131F]/30 p-3 rounded-lg border border-slate-800/30">
                      Notes de frais groupées ({expenses.length} justificatifs inclus). Catégories: {Array.from(new Set(expenses.map(e => e.category))).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-[#0B131F]/80 border border-slate-800 p-5 rounded-xl flex justify-between items-center mt-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Montant Net à Rembourser</span>
                    <p className="text-[10px] text-slate-400">Total validé en attente de versement</p>
                  </div>
                  <span className="text-2xl font-black font-mono text-[#FF6B2C]">{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Formulaire d'enregistrement comptable (5 colonnes) */}
            <form onSubmit={handleConfirmPayment} className="lg:col-span-5 bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-5">
              <div className="border-b border-slate-800/60 pb-3">
                <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">Clôture & Décaissement</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Saisissez les détails comptables pour solder le dossier.</p>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-2">Mode de règlement</label>
                <select className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors cursor-pointer">
                  <option value="sepa">Virement Bancaire (SEPA / National)</option>
                  <option value="momo">Mobile Money Professionnel</option>
                  <option value="cash">Caisse (Espèces / Cash)</option>
                </select>
              </div>

              <Input
                label="Référence de transaction bancaire"
                type="text"
                placeholder="Ex: TR-9023411-MUKO"
                icon={Landmark}
                required
              />

              <Input
                label="Date valeur comptable"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                icon={Calendar}
                required
              />

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-green-500 hover:bg-opacity-90 disabled:opacity-50 text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/10 active:scale-[0.98] cursor-pointer"
              >
                <CheckCircle2 size={14} /> {processing ? "Traitement..." : "Valider le décaissement"}
              </button>
            </form>
          </>
        ) : null}
      </div>
    </div>
  );
}