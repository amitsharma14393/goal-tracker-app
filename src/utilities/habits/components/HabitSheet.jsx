import { useState, useEffect } from 'react'
import useHabitsStore from '../store'
import BottomSheet from '../../../components/shared/BottomSheet'

const COLORS = [
  '#6366f1','#0ea5e9','#10b981','#f59e0b','#f43f5e','#8b5cf6','#14b8a6','#f97316',
]

export default function HabitSheet({ habit, onClose }) {
  const addGoal    = useHabitsStore((s) => s.addGoal)
  const updateGoal = useHabitsStore((s) => s.updateGoal)

  const [name, setName]   = useState(habit?.name || '')
  const [color, setColor] = useState(habit?.color || COLORS[0])
  const [error, setError] = useState('')

  useEffect(() => { if (habit) { setName(habit.name); setColor(habit.color) } }, [habit])

  const submit = () => {
    if (!name.trim()) { setError('Give your habit a name'); return }
    habit ? updateGoal(habit.id, { name: name.trim(), color }) : addGoal({ name: name.trim(), color })
    onClose()
  }

  return (
    <BottomSheet onClose={onClose} title={habit ? 'Edit Habit' : 'New Habit'}>
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          placeholder="e.g. Sleep 7-8 hours"
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-[15px]"
        />
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Color</label>
        <div className="flex gap-3 flex-wrap">
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} className="w-9 h-9 rounded-full press-active flex items-center justify-center" style={{ backgroundColor: c }}>
              {color === c && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
            </button>
          ))}
        </div>
      </div>

      <button onClick={submit} className="w-full py-3.5 rounded-2xl font-semibold text-white text-[15px] press-active" style={{ backgroundColor: color }}>
        {habit ? 'Save Changes' : 'Add Habit'}
      </button>
    </BottomSheet>
  )
}
