import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { RouteGuard } from './components/auth/RouteGuard';

// Layout
import { AppLayout } from './layouts/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { SearchCasesPage } from './pages/SearchCasesPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { CrimeAnalyticsPage } from './pages/CrimeAnalyticsPage';
import { CrimeMapPage } from './pages/CrimeMapPage';
import { CriminalNetworkPage } from './pages/CriminalNetworkPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Main Tactical Layout Wrapper */}
          <Route element={<RouteGuard />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
            <Route path="ai-assistant" element={<AiAssistantPage />} />
            <Route path="cases" element={<SearchCasesPage />} />
            <Route path="cases/:id" element={<CaseDetailPage />} />
            <Route path="analytics" element={<CrimeAnalyticsPage />} />
            <Route path="map" element={<CrimeMapPage />} />
            <Route path="network" element={<CriminalNetworkPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="admin" element={<AdminPanelPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
