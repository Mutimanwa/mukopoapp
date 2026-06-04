import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  // Si l'utilisateur n'est pas connecté, rediriger vers l'écran de connexion
  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  // Si le rôle de l'utilisateur n'est pas autorisé pour ce groupe de routes, rediriger vers la racine
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Si tout est valide, afficher les sous-routes
  return <Outlet />;
}
