import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // Attendre le chargement de l'authentification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B131F]">
        <div className="text-slate-500">Chargement...</div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la connexion
  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  // Normaliser les rôles pour la comparaison
  const userRole = user.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles?.map(role => role.toLowerCase());

  // Si des rôles sont spécifiés et que l'utilisateur n'a pas le bon rôle
  if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(userRole)) {
    // Rediriger vers le dashboard (qui adaptera l'affichage selon le rôle)
    return <Navigate to="/" replace />;
  }

  // Si tout est valide, afficher les sous-routes
  return <Outlet />;
}