export default function Input({ label, type = 'text', placeholder, icon: Icon, ...props }) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full bg-[#1A263B] text-slate-200 placeholder-slate-500 text-sm rounded-xl py-3.5 border border-transparent focus:border-[#FF6B2C]/50 focus:outline-none transition-all duration-200
            ${Icon ? 'pl-12 pr-4' : 'px-4'}`}
          {...props}
        />
      </div>
    </div>
  );
}