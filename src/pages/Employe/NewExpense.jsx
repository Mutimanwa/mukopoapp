import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, UploadCloud, DollarSign, Briefcase, Layers } from 'lucide-react';
import Input from '../../components/UI/Input';
import apiClient from '../../services/api';

export default function NewExpense() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Restauration',
    amount: '',
    currency: 'EUR',
    project: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiClient.post('/expenses', {
        date: formData.date,
        category: formData.category,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        description: formData.description,
        project: formData.project
      });
      navigate('/mes-notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Nouvelle note de frais</h1>
        <p className="text-slate-400 text-xs mt-1">Saisissez les détails de votre dépense et joignez votre justificatif.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-[#111C2E] border border-slate-800/80 rounded-2xl p-8 space-y-6">
          {error && (
            <div className="text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Date" type="date" name="date" value={formData.date} onChange={handleChange} required />

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">Catégorie</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-[#FF6B2C]/50 transition-colors cursor-pointer">
                <option value="Restauration">Restauration</option>
                <option value="Transport">Transport</option>
                <option value="Hébergement">Hébergement</option>
                <option value="Fournitures">Fournitures</option>
                <option value="Carburant">Carburant</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <Input label="Montant" type="number" name="amount" value={formData.amount} onChange={handleChange} step="0.01" placeholder="0.00" icon={DollarSign} required />

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">Devise</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-[#FF6B2C]/50 transition-colors cursor-pointer">
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar ($)</option>
              </select>
            </div>

            <Input label="Projet" type="text" name="project" value={formData.project} onChange={handleChange} placeholder="Nom du projet" icon={Briefcase} />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Expliquez brièvement le contexte..."
              className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-4 border border-slate-800 outline-none focus:border-[#FF6B2C]/50 transition-colors resize-none"
            ></textarea>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111C2E] border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">Justificatif</h3>

            <div className="border-2 border-dashed border-slate-800 hover:border-[#FF6B2C]/40 bg-[#0B131F]/40 rounded-2xl p-6 text-center transition-all group cursor-pointer relative aspect-square flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/png, image/jpeg, application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="w-12 h-12 rounded-full bg-[#FF6B2C]/10 text-[#FF6B2C] flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud size={22} />
              </div>
              <p className="text-xs text-slate-300 font-medium mt-4">
                {file ? file.name : "Glissez ou cliquez pour ajouter"}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-2">PDF, JPG, PNG</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/mes-notes')} className="flex-1 bg-[#1A263B] hover:bg-opacity-80 text-slate-300 text-xs font-semibold py-3.5 rounded-xl border border-slate-800 transition-all cursor-pointer">
              Annuler
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 bg-[#FF6B2C] hover:bg-opacity-90 disabled:opacity-50 text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B2C]/10 transition-all active:scale-[0.98] cursor-pointer">
              <Save size={14} /> {isLoading ? 'Sauvegarde...' : 'Soumettre'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}