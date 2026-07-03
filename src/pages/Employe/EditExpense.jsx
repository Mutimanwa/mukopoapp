import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import Input from '../../components/UI/Input';
import apiClient from '../../services/api';

export default function EditExpense() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    amount: '',
    category: '',
    date: '',
    description: '',
    project: '',
    currency: 'EUR',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const { data } = await apiClient.get('/expenses/myexpenses');
        const found = data.find(e => e._id === id);
        if (found) {
          setForm({
            amount: found.amount || '',
            category: found.category || '',
            date: found.date ? new Date(found.date).toISOString().split('T')[0] : '',
            description: found.description || '',
            project: found.project || '',
            currency: found.currency || 'EUR',
          });
        } else {
          setError("Note introuvable.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // PUT /api/expenses/:id (mise à jour)
      await apiClient.put(`/expenses/${id}`, form);
      navigate('/mes-notes');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Supprimer définitivement cette note de frais ?")) return;
    try {
      await apiClient.delete(`/expenses/${id}`);
      navigate('/mes-notes');
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer la note.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
      <Loader2 className="animate-spin" size={20} /> Chargement...
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer">
          <ArrowLeft size={14} /> Annuler les modifications
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/10 cursor-pointer"
        >
          <Trash2 size={14} /> Supprimer la note
        </button>
      </div>

      <form onSubmit={handleUpdate} className="bg-muko-card border border-slate-800/80 rounded-2xl p-8 space-y-6">
        <div className="border-b border-slate-800/60 pb-4">
          <h2 className="text-base font-bold text-white">Modifier la note de frais</h2>
          <p className="text-xs text-slate-500 mt-0.5">Identifiant de dossier : <span className="text-muko-orange font-mono font-bold">{id?.substring(id.length - 8).toUpperCase()}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            required
          />
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">Catégorie</label>
            <select
              value={form.category}
              onChange={handleChange('category')}
              className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-3.5 border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors"
              required
            >
              <option value="Transport">Transport</option>
              <option value="Restauration">Restauration</option>
              <option value="Hébergement">Hébergement</option>
              <option value="Fournitures">Fournitures</option>
              <option value="Carburant">Carburant</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <Input
            label="Montant"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange('amount')}
            required
          />
          <Input
            label="Projet"
            type="text"
            value={form.project}
            onChange={handleChange('project')}
            placeholder="Nom du projet"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-2">Description</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={handleChange('description')}
            className="w-full bg-[#1A263B] text-slate-200 text-xs rounded-xl p-4 border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors resize-none"
          ></textarea>
        </div>

        {error && <p className="text-red-400 text-xs font-bold">{error}</p>}

        <div className="flex justify-end pt-4 border-t border-slate-800/60">
          <button
            type="submit"
            disabled={saving}
            className="bg-muko-orange hover:bg-opacity-90 disabled:opacity-50 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-muko-orange/10 transition-all active:scale-[0.98] cursor-pointer"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Enregistrement..." : "Enregistrer les changements"}
          </button>
        </div>
      </form>
    </div>
  );
}