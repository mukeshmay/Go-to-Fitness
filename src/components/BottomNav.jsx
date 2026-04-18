import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Salad, Target, Zap } from 'lucide-react'

const NAV = [
  { to: '/dashboard',            label: 'Home',    icon: LayoutDashboard, end: true },
  { to: '/dashboard/workout',    label: 'Workout', icon: CalendarDays },
  { to: '/dashboard/diet',       label: 'Diet',    icon: Salad },
  { to: '/dashboard/milestones', label: 'Goals',   icon: Target },
  { to: '/dashboard/protein',    label: 'Protein', icon: Zap },
]

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-900 border-t border-surface-700 bottom-nav-safe">
      <div className="flex items-stretch">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] text-xs font-medium transition-colors ${
                isActive ? 'text-brand-400' : 'text-gray-500 active:text-gray-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="text-[11px] leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
