import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import Login from './pages/Login.jsx';
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';
import StaffDirectory from './pages/owner/StaffDirectory.jsx';
import OwnerExpenses from './pages/owner/OwnerExpenses.jsx';
import Reports from './pages/owner/Reports.jsx';
import StaffDashboard from './pages/staff/StaffDashboard.jsx';
import MyExpenses from './pages/staff/MyExpenses.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

function RoleHome() {
  const { profile } = useAuth();
  if (!profile) return <LoadingScreen label="Loading your workspace" />;
  return <Navigate to={profile.role === 'owner' ? '/owner' : '/staff'} replace />;
}

function ProtectedRoute({ allowedRoles, children }) {
  const { session, profile, loading } = useAuth();

  if (loading) return <LoadingScreen label="Securing session" />;
  if (!session) return <Navigate to="/login" replace />;
  if (!profile) return <LoadingScreen label="Preparing profile" />;
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to={profile.role === 'owner' ? '/owner' : '/staff'} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RoleHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        <Route path="staff" element={<StaffDirectory />} />
        <Route path="expenses" element={<OwnerExpenses />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="expenses" element={<MyExpenses />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
