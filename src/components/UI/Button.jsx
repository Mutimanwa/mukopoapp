export default function Button({ children, onClick, variant = 'primary', className = '' }) {
  const baseStyle = "w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 text-center text-sm";
  
  const variants = {
    primary: "bg-[#FF6B2C] text-white hover:bg-opacity-90 shadow-lg shadow-[#FF6B2C]/20 active:scale-[0.98]",
    secondary: "border border-[#FF6B2C] text-[#FF6B2C] hover:bg-[#FF6B2C]/10",
    ghost: "text-slate-400 hover:text-white hover:bg-[#111C2E]"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}