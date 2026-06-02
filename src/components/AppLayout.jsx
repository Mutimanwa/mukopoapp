import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0B131F] text-slate-200 antialiased">
      {/* Sidebar - Fixe à gauche */}
      <Sidebar />
      
      {/* Contenu principal - Prend le reste de l'espace */}
      <div className="flex-1 flex flex-col pl-64"> {/* 64 correspond à la largeur de la sidebar */}
        <Navbar />
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}