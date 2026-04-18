import { NavLink, useNavigate } from 'react-router-dom'
import { Dumbbell, LayoutDashboard, CalendarDays, Salad, Target, BarChart3, Zap, LogOut, ChevronRight, UserCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

const NAV = [
  { to: '/dashboard',            label: 'Overview',       icon: LayoutDashboard },
  { to: '/dashboard/workout',    label: 'Workout Plan',   icon: CalendarDays },
  { to: '/dashboard/diet',       label: 'Diet Plan',      icon: Salad },
  { to: '/dashboard/milestones', label: 'Milestones',     icon: Target },
  { to: '/dashboard/protein',    label: 'Protein Tracker',icon: Zap },
  { to: '/dashboard/records',    label: 'Records',        icon: BarChart3 },
  { to: '/dashboard/profile',    label: 'My Profile',     icon: UserCircle },
]

export default function Sidebar({ onClose }) {
  const { user, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-col h-full bg-surface-900 border-r border-surface-700 w-64">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-surface-700">
        <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Dumbbell size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg text-white">Go-to-Fitness</span>
      </div>

      {/* User badge */}
      {user && (
        <div className="mx-3 mt-4 p-3 bg-surface-800 rounded-xl border border-surface-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Menu</p>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-surface-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-brand-400' : 'text-gray-500 group-hover:text-gray-300'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-brand-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-surface-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
