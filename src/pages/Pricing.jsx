import { Link } from 'react-router-dom'
import { Check, Dumbbell, Zap, Shield, Crown, Star } from 'lucide-react'

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: 100,
    duration: '1 Month',
    icon: Zap,
    color: 'brand',
    ring: 'ring-brand-500/40',
    badge: null,
    features: [
      'Full personalised workout plan',
      'Custom diet plan (veg / non-veg)',
      'Protein tracker',
      'Milestone tracking',
      'Progress records',
    ],
  },
  {
    id: 'quarterly',
    label: 'Quarterly',
    price: 200,
    duration: '3 Months',
    icon: Star,
    color: 'cyan',
    ring: 'ring-cyan-500/50',
    badge: 'Most Popular',
    savings: 'Save ₹100',
    features: [
      'Everything in Monthly',
      '3-month plan continuity',
      'Plan regeneration anytime',
      'Priority gym support',
    ],
  },
  {
    id: 'half_yearly',
    label: 'Half Yearly',
    price: 400,
    duration: '6 Months',
    icon: Shield,
    color: 'purple',
    ring: 'ring-purple-500/40',
    badge: null,
    savings: 'Save ₹200',
    features: [
      'Everything in Quarterly',
      '6-month progress tracking',
      'Trainer consultation support',
      'Custom plan adjustments',
    ],
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: 600,
    duration: '12 Months',
    icon: Crown,
    color: 'emerald',
    ring: 'ring-emerald-500/40',
    badge: 'Best Value',
    savings: 'Save ₹600',
    features: [
      'Everything in Half Yearly',
      'Full year access',
      'VIP support',
      'Custom meal planning',
      'Exclusive gym perks',
    ],
  },
]

const COLOR_MAP = {
  brand:   { text: 'text-brand-400',   bg: 'bg-brand-500/15',   border: 'border-brand-500/30',   btn: 'bg-brand-600 hover:bg-brand-500',   badge: 'bg-brand-500/20 text-brand-300' },
  cyan:    { text: 'text-cyan-400',    bg: 'bg-cyan-500/15',    border: 'border-cyan-500/40',    btn: 'bg-cyan-600 hover:bg-cyan-500',    badge: 'bg-cyan-500/20 text-cyan-300' },
  purple:  { text: 'text-purple-400',  bg: 'bg-purple-500/15',  border: 'border-purple-500/30',  btn: 'bg-purple-600 hover:bg-purple-500',  badge: 'bg-purple-500/20 text-purple-300' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', btn: 'bg-emerald-600 hover:bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300' },
}

export default function Pricing() {
  return (
    <div className="min-h-dvh-safe bg-surface-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-surface-700">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
            <Dumbbell size={18} className="text-white" />
          </div>
          <span className="font-bold text-white">Go-to-Fitness</span>
        </div>
        <Link to="/login" className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Sign In →
        </Link>
      </header>

      <main className="flex-1 px-4 py-10 max-w-5xl mx-auto w-full">
        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-4">
            <Zap size={12} /> Gym Membership Plans
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Simple, Transparent<br />
            <span className="text-gradient">Pricing</span>
          </h1>
          <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-md mx-auto">
            Choose a plan that works for you. All plans include a personalised workout + diet plan built around your goals.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(plan => {
            const c = COLOR_MAP[plan.color]
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                className={`relative card p-5 flex flex-col gap-4 border ${c.border} ${plan.badge ? 'ring-2 ' + plan.ring : ''}`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${c.badge} border ${c.border}`}>
                    {plan.badge}
                  </div>
                )}

                {/* Icon + label */}
                <div className="flex items-center gap-2.5 mt-1">
                  <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={c.text} />
                  </div>
                  <div>
                    <p className="font-bold text-white">{plan.label}</p>
                    <p className="text-xs text-gray-500">{plan.duration}</p>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">₹{plan.price}</span>
                    <span className="text-gray-500 text-sm">/ {plan.duration.toLowerCase()}</span>
                  </div>
                  {plan.savings && (
                    <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge} border ${c.border}`}>
                      {plan.savings}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check size={14} className={`${c.text} flex-shrink-0 mt-0.5`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`w-full py-2.5 rounded-xl text-sm font-bold text-white text-center ${c.btn} transition-colors`}>
                  Contact Your Gym
                </div>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <p className="text-center text-xs text-gray-600 mt-8">
          Plans are activated by your gym admin. Visit the front desk or contact your trainer to subscribe.
        </p>

        {/* Admin link */}
        <div className="text-center mt-4">
          <Link to="/admin" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Gym Admin Login →
          </Link>
        </div>
      </main>
    </div>
  )
}
