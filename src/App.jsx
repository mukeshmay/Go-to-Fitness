import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import AdminLogin, { isAdminLoggedIn } from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUserEdit from './pages/admin/AdminUserEdit'

function RequireAuth({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RequireProfile({ children }) {
  const { user, profile } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (!profile) return <Navigate to="/onboarding" replace />
  return children
}

function RequireAdmin({ children }) {
  if (!isAdminLoggedIn()) return <Navigate to="/admin" replace />
  return children
}

function AppRoutes() {
  const { user, profile } = useApp()

  return (
    <Routes>
      {/* Public */}
      <Route path="/login"   element={user ? <Navigate to={profile ? '/dashboard' : '/onboarding'} replace /> : <Login />} />
      <Route path="/signup"  element={user ? <Navigate to={profile ? '/dashboard' : '/onboarding'} replace /> : <Signup />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Admin */}
      <Route path="/admin"                  element={isAdminLoggedIn() ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} />
      <Route path="/admin/dashboard"        element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
      <Route path="/admin/user/:email"      element={<RequireAdmin><AdminUserEdit /></RequireAdmin>} />

      {/* User app */}
      <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
      <Route path="/dashboard/*" element={<RequireProfile><Dashboard /></RequireProfile>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? (profile ? '/dashboard' : '/onboarding') : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
