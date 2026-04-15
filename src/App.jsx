import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'

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

function AppRoutes() {
  const { user, profile } = useApp()

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to={profile ? '/dashboard' : '/onboarding'} replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to={profile ? '/dashboard' : '/onboarding'} replace /> : <Signup />}
      />
      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <Onboarding />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <RequireProfile>
            <Dashboard />
          </RequireProfile>
        }
      />
      <Route
        path="*"
        element={<Navigate to={user ? (profile ? '/dashboard' : '/onboarding') : '/login'} replace />}
      />
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
