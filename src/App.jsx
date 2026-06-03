import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout global
import Layout from './components/Layout/Layout';

// Pages Auth
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Pages Rôles (On crée des points d'entrées intelligents)
import Dashboard from './pages/Dashboard'; // Dashboard Employé
import Expenses from './pages/Expenses';   // Mes Dépenses / Notes
import NewExpense from './pages/Employe/NewExpense';
import ExpenseDetail from './pages/Employe/ExpenseDetail';
import EditExpense from './pages/Employe/EditExpense';
import ReceiptsGallery from './pages/Employe/ReceiptsGallery';
import RefundDetail from './pages/Employe/RefundDetail';
import ApprovalDetail from './pages/Manager/ApprovalDetail';
import PendingExpenses from './pages/Manager/PendingExpenses';
import ValidationHistory from './pages/Manager/ValidationHistory';
import TeamList from './pages/Manager/TeamList';
import TeamMemberDetail from './pages/Manager/TeamMemberDetail';
import ManagerDashboard from './pages/Manager/ManagerDashbaord';
import ExpenseReports from './pages/Finance/ExpenseReports';
import AuditingExpenses from './pages/Finance/AuditingExpenses';
import PayoutHistory from './pages/Finance/PayoutHistory';
import PayoutDetail from './pages/Finance/PayoutDetail';
import PendingPayouts from './pages/Finance/PendingPayouts';
import FinanceDashboard from './pages/Finance/FinanceDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import UserForm from './pages/Admin/UserForm';
import OrgStructure from './pages/Admin/OrgStructure';
import WorkflowSettings from './pages/Admin/WorkflowSettings';
import AuditLogs from './pages/Admin/AuditLogs';

// Nous allons créer un composant de routage pour le tableau de bord selon le rôle
function SwitchDashboard() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'manager':
      return <ManagerDashboard />;
    case 'finance':
      return <FinanceDashboard />; // On réutilise le module analytique poussé pour la finance
    case 'admin':
      return <AdminDashboard />; // L'administrateur arrive directement sur les configurations
    case 'employee':
    default:
      return <Dashboard />; // L'employé par défaut
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes d'accès authentification autonomes */}
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          {/* Application protégée par le Layout applicatif */}
          <Route path="/" element={<Layout />}>
            {/* Le point d'entrée s'adapte dynamiquement selon le rôle simulé */}
            <Route index element={<SwitchDashboard />} />

            {/* Routes Employé */}
            <Route path="mes-notes" element={<Expenses />} />
            <Route path="nouvelle-note" element={<NewExpense />} />
            <Route path="note-detail/:id" element={<ExpenseDetail />} />
            <Route path="modifier-note/:id" element={<EditExpense />} />
            <Route path="mes-justificatifs" element={<ReceiptsGallery />} />
            <Route path="mes-remboursements" element={<RefundDetail />} />

            {/* Routes Manager / Validation */}
            {/* Routes Manager / Validation */}
            <Route path="validation/attente" element={<PendingExpenses />} />
            <Route path="validation/detail/:id" element={<ApprovalDetail />} />
            <Route path="validation/historique" element={<ValidationHistory />} />
            <Route path="equipe/collaborateurs" element={<TeamList />} />
            <Route path="equipe/collaborateur/:id" element={<TeamMemberDetail />} />

            {/* Routes Comptables / Financières */}
            <Route path="finance/traiter" element={<PendingPayouts />} />
            <Route path="finance/payer/:id" element={<PayoutDetail />} />
            <Route path="finance/historique" element={<PayoutHistory />} />
            <Route path="finance/controle" element={<AuditingExpenses />} />
            <Route path="finance/rapports" element={<ExpenseReports />} />

            {/* Routes d'Administration */}
            <Route path="admin/utilisateurs" element={<UserManagement />} />
            <Route path="admin/utilisateurs/creer" element={<UserForm />} />
            <Route path="admin/utilisateurs/modifier/:id" element={<UserForm />} />
            <Route path="admin/organisation" element={<OrgStructure />} />
            <Route path="admin/parametres" element={<WorkflowSettings />} />
            <Route path="admin/audit" element={<AuditLogs />} /></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}