import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dashboard } from "@/pages/Dashboard";
import { EntrepreneursPage } from "@/pages/EntrepreneursPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/entrepreneurs" element={
          <ProtectedRoute>
            <DashboardLayout>
              <EntrepreneursPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/reports" element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/settings" element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;