import { useState, useEffect } from 'react'
import useGoalStore from '../store/useGoalStore'

const COLORS = [
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Sky', value: '#0ea5e9' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Teal', value: '#14b8a6' },
  { label: 'Orange', value: '#f97316' },
]

export default function GoalSheet({ goal, onClose }) {
  const addGoal = useGoalStore((s) => s.addGoal)
  const updateGoal = useGoalStore((s) => s.updateGoal)

  const [name, setName] = useState(goal?.name || '')
  const [color, setColor] = useState(goal?.color || COLORS[0].value)
  const [error, setError] = useState('')

  useEffect(() => {
    if (goal) {
      setName(goal.name)
      setColor(goal.color)
    }
  }, [goal])

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Give your goal a name')
      return
    }
    if (goal) {
      updateGoal(goal.id, { name: name.trim(), color })
    } else {
      addGoal({ name: name.trim(), color })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end animate-fade-in" onClick={onClose}>
      <div className="sheet-backdrop absolute inset-0" />
      <div
        className="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl px-5 pt-5 pb-4 animate-slide-up"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5" />

        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5">
          {goal ? 'Edit Goal' : 'New Goal'}
        </h2>

        {/* Name input */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Goal Name
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            placeholder="e.g. Sleep 7-8 hours"
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-[15px] transition-colors"
          />
          {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
        </div>

        {/* Color picker */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Color
          </label>
          <div className="flex gap-3 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className="w-9 h-9 rounded-full press-active transition-transform flex items-center justify-center"
                style={{ backgroundColor: c.value }}
              >
                {color === c.value && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-2xl font-semibold text-white text-[15px] press-active transition-opacity"
          style={{ backgroundColor: color }}
        >
          {goal ? 'Save Changes' : 'Add Goal'}
        </button>
      </div>
    </div>
  )
}
