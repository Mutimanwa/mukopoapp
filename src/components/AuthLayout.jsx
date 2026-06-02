export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#0B131F] flex items-center justify-center p-4">
      {/* Conteneur principal de la carte */}
      <div className="w-full max-w-5xl aspect-4/3 bg-[#111C2E] rounded-3xl overflow-hidden border border-slate-800/50 shadow-2xl flex">
        
        {/* SECTION GAUCHE : Visuel & Branding */}
        <div className="w-1/2 bg-linear-to-br from-[#0B131F] to-[#111C2E] p-12 flex flex-col justify-between relative border-r border-slate-800/40">
          <div>
            <h1 className="text-2xl font-black text-[#FF6B2C] tracking-wider font-sans uppercase">
              MUKOPOAPP
            </h1>
            <p className="text-slate-400 text-sm mt-4 max-w-xs leading-relaxed">
              Gérez vos dépenses avec une précision chirurgicale et une vitesse fulgurante. Conçu pour les professionnels qui exigent le meilleur.
            </p>
          </div>

          {/* Widget Vitesse de traitement */}
          <div className="bg-[#1A263B]/60 border border-slate-800/60 rounded-xl p-5 backdrop-blur-sm max-w-sm">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[#FF6B2C] tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse"></span>
              Vitesse de traitement
            </div>
            {/* Barre de progression */}
            <div className="w-full h-2 bg-[#0B131F] rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-[#FF6B2C] rounded-full w-[85%]"></div>
            </div>
            <div className="text-[9px] font-mono text-slate-500 mt-2 italic">
              Optimisé par Safi Kibasomba
            </div>
          </div>
        </div>

        {/* SECTION DROITE : Formulaire */}
       
           {children}
      
       

      </div>
    </div>
  );
}