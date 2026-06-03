import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Landmark } from 'lucide-react';
import Input from '../../components/UI/Input';

export default function PayoutDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    // Étape 7 du workflow : clôture et archivage
    navigate('/finance/traiter');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
        <ArrowLeft size={14} /> Annuler le traitement
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Rappel des informations de la fiche à liquider */}
        <div className="lg:col-span-2 bg-muko-card border border-slate-800/80 rounded-2xl p-8 space-y-6">
          <div className="border-b border-slate-800/60 pb-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Ordre de règlement interne</span>
            <h2 className="text-lg font-bold text-white font-mono mt-0.5">{id || "REM-001"}</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between border-b border-slate-800/40 pb-2"><span className="text-slate-500">Salarié destinataire :</span><span className="text-white font-bold">Safi Kibasomba</span></div>
            <div className="flex justify-between border-b border-slate-800/40 pb-2"><span className="text-slate-500">Total approuvé cumulé :</span><span className="text-white font-mono font-bold">1,450.00 €</span></div>
            <div className="flex justify-between border-b border-slate-800/40 pb-2"><span className="text-slate-500">Imputation analytique :</span><span className="text-white font-mono font-medium">DEPT-TECH-01</span></div>
          </div>
        </div>

        {/* Formulaire d'enregistrement comptable */}
        <form onSubmit={handleConfirmPayment} className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-5">
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">Clôture & Enregistrement</h3>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">Mode de règlement</label>
            <select className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-muko-orange/50 cursor-pointer">
              <option value="sepa">Virement Bancaire Corporatif</option>
              <option value="momo">Mobile Money Professionnel</option>
              <option value="cash">Caisse d'avance (Espèces)</option>
            </select>
          </div>

          <Input label="Référence de transaction" type="text" placeholder="Ex: TR-91024-MUKOPO" icon={Landmark} required />
          <Input label="Date valeur comptable" type="date" required />

          <button type="submit" className="w-full bg-green-500 hover:bg-opacity-90 text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/10 cursor-pointer">
            <CheckCircle2 size={14} /> Valider le décaissement
          </button>
        </form>
      </div>
    </div>
  );
}