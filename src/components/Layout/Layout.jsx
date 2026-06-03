import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';


export default function Layout() {
  return (
    <div className="flex bg-[#0B131F] min-h-screen text-slate-100 selection:bg-muko-orange/30 antialiased font-sans">
      {/* Barre latérale dynamique */}
      <Sidebar />

      {/* Conteneur principal de la page courante */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}