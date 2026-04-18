import { useApp } from '../context/AppContext'
import { Target, Check, Trophy, Undo2 } from 'lucide-react'

const TIER_COLORS = {
  Beginner:      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Intermediate:  'bg-brand-500/20 text-brand-300 border-brand-500/30',
  'Intermediate+': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Advanced:      'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Elite:         'bg-red-500/20 text-red-300 border-red-500/30',
}

const CAT_ICONS = {
  Strength: '💪',
  Core:     '🧘',
  Legs:     '🦵',
  Cardio:   '🏃',
}

export default function Milestones() {
  const { milestones, completeMilestone, undoMilestone } = useApp()

  if (!milestones) {
    return <EmptyState />
  }

  const { active, completed } = milestones
  const total = active.length + completed.length
  const pct = total > 0 ? Math.round((completed.length / total) * 100) : 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Weekly Milestones</h1>
        <p className="text-gray-400 text-sm mt-1">
          Tick off milestones as you complete them — a new one replaces each completed challenge.
        </p>
      </div>

      {/* Progress overview */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-gray-400">Overall Progress</p>
            <p className="text-2xl font-bold text-white mt-0.5">{completed.length} <span className="text-gray-500 text-lg font-normal">/ {total} completed</span></p>
          </div>
          <div className="w-14 h-14 bg-surface-700 rounded-full flex items-center justify-center">
            <p className="text-lg font-bold text-brand-400">{pct}%</p>
          </div>
        </div>
        <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-cyan-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1.5">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Active milestones */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-brand-400" />
          <h2 className="font-semibold text-white">Active Milestones</h2>
          <span className="badge bg-brand-500/20 text-brand-300 text-xs px-2 py-0.5 ml-1">{active.length}</span>
        </div>

        {active.length === 0 ? (
          <div className="card p-8 text-center">
            <Trophy size={32} className="text-yellow-400 mx-auto mb-3" />
            <p className="font-semibold text-white">All milestones completed!</p>
            <p className="text-gray-400 text-sm mt-1">You've crushed all your current challenges. New ones are loading...</p>
          </div>
        ) : (
          active.map((m) => (
            <MilestoneCard key={m.id} milestone={m} onComplete={() => completeMilestone(m.id)} />
          ))
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-emerald-400" />
            <h2 className="font-semibold text-white">Completed</h2>
            <span className="badge bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 ml-1">{completed.length}</span>
          </div>

          <div className="space-y-2">
            {[...completed].reverse().map((m, i) => (
              <div key={m.id || i} className="card p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={18} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-400 text-sm line-through">{m.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Completed {m.completedAt ? new Date(m.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </p>
                </div>
                <button
                  onClick={() => undoMilestone(m.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-2 bg-surface-700 hover:bg-surface-600 border border-surface-600 hover:border-surface-500 text-gray-400 hover:text-white text-xs font-medium rounded-lg transition-all duration-150"
                >
                  <Undo2 size={13} />
                  Undo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-600 text-center pb-4">
        5 active milestones at a time. Each completed one is replaced by a harder challenge.
      </p>
    </div>
  )
}

function MilestoneCard({ milestone, onComplete }) {
  const tierCls = TIER_COLORS[milestone.tier] || TIER_COLORS['Beginner']
  const catIcon = CAT_ICONS[milestone.category] || '🎯'

  return (
    <div className="card p-4 sm:p-5 flex items-start gap-4 hover:border-surface-600 transition-all duration-150 group">
      <div className="w-12 h-12 bg-surface-700 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
        {catIcon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-white">{milestone.title}</p>
              <span className={`badge border text-xs px-2 py-0.5 ${tierCls}`}>{milestone.tier}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{milestone.desc}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge bg-surface-600 text-gray-400 text-xs px-2 py-0.5">{milestone.category}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-brand-600/20 hover:bg-brand-600 border border-brand-500/40 hover:border-brand-500 text-brand-300 hover:text-white text-xs font-semibold rounded-lg transition-all duration-200"
      >
        <Check size={14} />
        Done
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-surface-700 rounded-2xl flex items-center justify-center mb-4">
        <Target size={28} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-white">No milestones yet</h3>
      <p className="text-gray-400 text-sm mt-2">Complete your profile to get your first 5 milestones.</p>
    </div>
  )
}
