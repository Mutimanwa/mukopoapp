import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Landmark, DollarSign, Calendar, FileText, User } from 'lucide-react';
import Input from '../../components/UI/Input';

const mockPayouts = {
  "REM-001": { employee: "Safi Kibasomba", total: "1450.00", dept: "DEPT-TECH-01", bank: "Banque Commerciale du Burundi (BCB)", iban: "BI76 0010 2003 4567 8901 2345 67", details: "Remboursement NDF Q1 (Matériel informatique + hôtel)" },
  "REM-002": { employee: "Alain Ndikumana", total: "120.00", dept: "DEPT-INFRAS-02", bank: "Interbank Burundi (IBB)", iban: "BI76 0020 4005 6789 0123 4567 89", details: "Frais carburant camionnette technique" },
  "REM-003": { employee: "Clément Nkurunziza", total: "410.00", dept: "DEPT-COMPTA-01", bank: "Ecobank Burundi", iban: "BI76 0030 6007 8901 2345 6789 01", details: "Séminaire de formation RE-START" }
};

export default function PayoutDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const activeId = id && mockPayouts[id] ? id : "REM-001";
  const payout = mockPayouts[activeId];

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    navigate('/finance/traiter');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={14} /> Annuler le traitement
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Bordereau de virement (Style ticket de caisse / facture physique premium - 7 colonnes) */}
        <div className="lg:col-span-7 bg-muko-card border border-slate-800/80 rounded-2xl overflow-hidden relative">
          {/* Ruban orange décoratif */}
          <div className="h-1.5 w-full bg-linear-to-r from-[#FF6B2C] to-amber-500"></div>
          
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-800/60 pb-6">
              <div>
                <span className="text-[10px] font-mono text-[#FF6B2C] uppercase tracking-widest font-bold">Ordre de Virement Interne</span>
                <h2 className="text-lg font-black text-white font-mono mt-0.5">{activeId}</h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-muko-orange/10 border border-muko-orange/20 flex items-center justify-center text-muko-orange">
                <Landmark size={18} />
              </div>
            </div>

            {/* Fiche technique de transfert */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-800/40 pb-2.5">
                <span className="text-slate-500 flex items-center gap-1.5"><User size={13} /> Salarié destinataire :</span>
                <span className="text-white font-bold">{payout.employee}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2.5">
                <span className="text-slate-500">Service / Département :</span>
                <span className="text-white font-medium">{payout.dept}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2.5">
                <span className="text-slate-500">Établissement Bancaire :</span>
                <span className="text-white font-medium">{payout.bank}</span>
              </div>
              <div className="flex flex-col space-y-1 border-b border-slate-800/40 pb-2.5">
                <span className="text-slate-500">IBAN de destination :</span>
                <span className="text-white font-mono font-semibold tracking-wider bg-[#0B131F]/60 p-2.5 rounded-lg border border-slate-800/50 mt-1 select-all">
                  {payout.iban}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-slate-500">Motif de règlement :</span>
                <span className="text-slate-300 italic bg-[#0B131F]/30 p-3 rounded-lg border border-slate-800/30">
                  "{payout.details}"
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-[#0B131F]/80 border border-slate-800 p-5 rounded-xl flex justify-between items-center mt-6">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Montant Net à Rembourser</span>
                <p className="text-[10px] text-slate-400">Total validé en attente de versement</p>
              </div>
              <span className="text-2xl font-black font-mono text-[#FF6B2C]">{parseFloat(payout.total).toFixed(2)} €</span>
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
            defaultValue="2026-06-04" 
            icon={Calendar} 
            required 
          />

          <button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-opacity-90 text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/10 active:scale-[0.98] cursor-pointer"
          >
            <CheckCircle2 size={14} /> Valider le décaissement
          </button>
        </form>
      </div>
    </div>
  );
}