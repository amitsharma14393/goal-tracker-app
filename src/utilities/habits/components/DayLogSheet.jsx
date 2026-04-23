import { useState, useRef } from 'react'
import BottomSheet from '../../../components/shared/BottomSheet'
import useHabitsStore from '../store'

function formatSheetDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function DayLogSheet({ goal, date, onClose }) {
  const logs       = useHabitsStore((s) => s.logs)
  const logNotes   = useHabitsStore((s) => s.logNotes)
  const setLog     = useHabitsStore((s) => s.setLog)
  const setLogNote = useHabitsStore((s) => s.setLogNote)

  const key            = `${goal.id}_${date}`
  const currentStatus  = logs[key]           // true | false | undefined
  const currentNote    = logNotes[key] || ''

  const [note, setNote] = useState(currentNote)
  const noteTimer = useRef(null)

  const handleStatus = (status) => {
    setLog(goal.id, date, status)
  }

  const handleNote = (text) => {
    setNote(text)
    clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(() => setLogNote(goal.id, date, text), 500)
  }

  const STATUS_OPTIONS = [
    { value: true,  label: 'Done',    color: goal.color },
    { value: false, label: 'Missed',  color: '#f87171' },
    { value: null,  label: 'Unlog',   color: '#94a3b8' },
  ]

  return (
    <BottomSheet onClose={onClose} title={formatSheetDate(date)}>
      <div className="flex flex-col gap-4 pb-2">
        <div className="flex gap-2">
          {STATUS_OPTIONS.map(({ value, label, color }) => {
            const isActive = value === null ? currentStatus === undefined : currentStatus === value
            return (
              <button
                key={label}
                onClick={() => handleStatus(value)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold press-active transition-all border"
                style={{
                  backgroundColor: isActive ? color + '20' : 'transparent',
                  borderColor: isActive ? color : '#334155',
                  color: isActive ? color : '#64748b',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Note (optional)</p>
          <textarea
            value={note}
            onChange={(e) => handleNote(e.target.value)}
            placeholder="How did it go? Add context..."
            className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none resize-none text-sm leading-relaxed border border-slate-200 dark:border-slate-700 focus:border-indigo-400"
            rows={3}
          />
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl text-white font-semibold press-active"
          style={{ backgroundColor: goal.color }}
        >
          Done
        </button>
      </div>
    </BottomSheet>
  )
}
