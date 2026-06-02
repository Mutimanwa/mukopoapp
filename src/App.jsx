import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/AppLayout';

// Importation des pages (on va les créer juste après)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Register from './pages/Register';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes d'authentification (Sans Sidebar) */}
        <Route path="/" element={<Login />} />
        <Route path='/register' element={<Register />} />
        
        {/* Routes de l'application (Avec Sidebar via le composant Layout) */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/depenses" element={<Layout><Expenses /></Layout>} />
        <Route path="/rapports" element={<Layout><Reports /></Layout>} />
        <Route path="/parametres" element={<Layout><Settings /></Layout>} />

        {/* Redirection automatique si la route n'existe pas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}