import { useState } from 'react';
import { Plus, Tag, Search, TrendingUp, DollarSign, Building2 } from 'lucide-react';

const CC_DATA = [
  { code: "CC-RD-01",     label: "Pole R&D Logiciel",       budget: 25000, spent: 18450, manager: "A. Ndikumana",  dept: "Technique"  },
  { code: "CC-MKT-02",   label: "Lancement RE-START",       budget: 12500, spent: 4820,  manager: "B. Inamahoro", dept: "Marketing"  },
  { code: "CC-OPS-03",   label: "Operations & Logistique",  budget: 8000,  spent: 6100,  manager: "C. Nkurunziza",dept: "Operations" },
  { code: "CC-INF-04",   label: "Infrastructure Reseau",    budget: 18000, spent: 7300,  manager: "A. Ndikumana",  dept: "Technique"  },
];

const DEPTS = ["Tous", "Technique", "Marketing", "Operations"];

export default function OrgStructure() {
  const [search, setSearch] = useState('');
  const [dept,   setDept]   = useState('Tous');

  const filtered = CC_DATA.filter((cc) => {
    const q = search.toLowerCase();
    const matchQ = cc.code.toLowerCase().includes(q) || cc.label.toLowerCase().includes(q) || cc.manager.toLowerCase().includes(q);
    const matchD = dept === 'Tous' || cc.dept === dept;
    return matchQ && matchD;
  });

  const totalBudget = CC_DATA.reduce((s, c) => s + c.budget, 0);
  const totalSpent  = CC_DATA.reduce((s, c) => s + c.spent,  0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Organisation &amp; Centres de couts</h1>
          <p className="text-slate-400 text-xs mt-1">Configurez les enveloppes budgetaires par entite operationnelle.</p>
        </div>
        <button className="bg-muko-orange hover:bg-opacity-90 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-muko-orange/10 transition-all active:scale-[0.98] cursor-pointer">
          <Plus size={14} /> Nouveau Centre
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Budget total alloue</span>
            <p className="text-xl font-black text-white font-mono">{totalBudget.toLocaleString()} USD</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 flex items-center justify-center">
            <DollarSign size={18} />
          </div>
        </div>
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Total consomme</span>
            <p className="text-xl font-black text-[#FF6B2C] font-mono">{totalSpent.toLocaleString()} USD</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/15 text-[#FF6B2C] flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="bg-muko-card border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">Centres actifs</span>
            <p className="text-xl font-black text-white font-mono">{CC_DATA.length} centres</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 flex items-center justify-center">
            <Building2 size={18} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher un centre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muko-card text-slate-200 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 outline-none focus:border-muko-orange/50 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {DEPTS.map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                dept === d ? 'bg-muko-orange text-white border-transparent' : 'bg-muko-card text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >{d}</button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? filtered.map((cc) => {
          const pct      = Math.min((cc.spent / cc.budget) * 100, 100);
          const rem      = cc.budget - cc.spent;
          const barCls   = pct > 80 ? 'bg-red-500'   : pct > 60 ? 'bg-amber-500' : 'bg-green-500';
          const pctCls   = pct > 80 ? 'text-red-400' : pct > 60 ? 'text-amber-400' : 'text-green-400';
          return (
            <div key={cc.code} className="bg-muko-card border border-slate-800/80 rounded-2xl p-6 space-y-5 hover:border-slate-700/80 transition-all">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-muko-orange/10 border border-muko-orange/15 text-muko-orange flex items-center justify-center">
                    <Tag size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-white">{cc.code}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{cc.dept}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-800">Resp : {cc.manager}</span>
              </div>
              <p className="text-xs font-semibold text-white">{cc.label}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-500">Consommation annuelle</span>
                  <span className={`font-bold ${pctCls}`}>{pct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className={`h-full rounded-full transition-all ${barCls}`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800/40 text-xs">
                <div>
                  <p className="text-[9px] font-mono text-slate-500 uppercase mb-0.5">Alloue</p>
                  <p className="font-bold font-mono text-white">{cc.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-slate-500 uppercase mb-0.5">Consomme</p>
                  <p className="font-bold font-mono text-[#FF6B2C]">{cc.spent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-slate-500 uppercase mb-0.5">Restant</p>
                  <p className={`font-bold font-mono ${rem < 0 ? 'text-red-400' : 'text-green-400'}`}>{rem.toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium">Aucun centre correspondant.</div>
        )}
      </div>
    </div>
  );
}