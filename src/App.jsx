import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';

// Pages Employé
import Dashboard from './pages/Employe/Dashboard';
import Expenses from './pages/Employe/Expenses';
import NewExpense from './pages/Employe/NewExpense';
import ExpenseDetail from './pages/Employe/ExpenseDetail';
import EditExpense from './pages/Employe/EditExpense';
import ReceiptsGallery from './pages/Employe/ReceiptsGallery';
import RefundDetail from './pages/Employe/RefundDetail';

// Pages Manager
import ManagerDashboard from './pages/Manager/ManagerDashboard';
import PendingExpenses from './pages/Manager/PendingExpenses';
import ApprovalDetail from './pages/Manager/ApprovalDetail';
import ValidationHistory from './pages/Manager/ValidationHistory';
import TeamList from './pages/Manager/TeamList';
import TeamMemberDetail from './pages/Manager/TeamMemberDetail';

// Pages Finance
import FinanceDashboard from './pages/Finance/FinanceDashboard';
import PendingPayouts from './pages/Finance/PendingPayouts';
import PayoutDetail from './pages/Finance/PayoutDetail';
import PayoutHistory from './pages/Finance/PayoutHistory';
import AuditingExpenses from './pages/Finance/AuditingExpenses';
import ExpenseReports from './pages/Finance/ExpenseReports';

// Pages Admin
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import UserForm from './pages/Admin/UserForm';
import AuditLogs from './pages/Admin/AuditLogs';

// Pages communes
import Settings from './pages/Settings';
import Reports from './pages/Reports';

function DashboardRouter() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  switch (role) {
    case 'manager':
      return <ManagerDashboard />;
    case 'finance':
      return <FinanceDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Dashboard />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/connexion" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Dashboard - Point d'entrée selon le rôle */}
              <Route index element={<DashboardRouter />} />
              
              {/* Routes communes */}
              <Route path="profil" element={<Settings />} />
              <Route path="equipe/rapports" element={<Reports />} />

              {/* Routes Employé */}
              <Route path="mes-notes" element={<Expenses />} />
              <Route path="nouvelle-note" element={<NewExpense />} />
              <Route path="note-detail/:id" element={<ExpenseDetail />} />
              <Route path="modifier-note/:id" element={<EditExpense />} />
              <Route path="mes-justificatifs" element={<ReceiptsGallery />} />
              <Route path="mes-remboursements" element={<RefundDetail />} />

              {/* Routes Manager */}
              <Route path="validation/attente" element={<PendingExpenses />} />
              <Route path="validation/detail/:id" element={<ApprovalDetail />} />
              <Route path="validation/historique" element={<ValidationHistory />} />
              <Route path="equipe/collaborateurs" element={<TeamList />} />
              <Route path="equipe/collaborateur/:id" element={<TeamMemberDetail />} />

              {/* Routes Finance */}
              <Route path="finance/traiter" element={<PendingPayouts />} />
              <Route path="finance/payer/:id" element={<PayoutDetail />} />
              <Route path="finance/historique" element={<PayoutHistory />} />
              <Route path="finance/controle" element={<AuditingExpenses />} />
              <Route path="finance/rapports" element={<ExpenseReports />} />

              {/* Routes Admin */}
              <Route path="admin/utilisateurs" element={<UserManagement />} />
              <Route path="admin/utilisateurs/creer" element={<UserForm />} />
              <Route path="admin/utilisateurs/modifier/:id" element={<UserForm />} />
              <Route path="admin/audit" element={<AuditLogs />} />

              {/* Redirection 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}