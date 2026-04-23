import { useState } from 'react'
import useHabitsStore from '../store'
import DayLogSheet from './DayLogSheet'
import { getDaysInMonth, getFirstDayOfMonth, isToday, isFuture, formatMonthYear } from '../../../utils/dateHelpers'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function CalendarView({ goal }) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const logs      = useHabitsStore((s) => s.logs)
  const logNotes  = useHabitsStore((s) => s.logNotes)
  const getLog    = (goalId, date) => logs[`${goalId}_${date}`]

  const [sheetDate, setSheetDate] = useState(null)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    const td = new Date()
    if (viewYear > td.getFullYear() || (viewYear === td.getFullYear() && viewMonth >= td.getMonth())) return
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }
  const nextDisabled = () => {
    const td = new Date()
    return viewYear > td.getFullYear() || (viewYear === td.getFullYear() && viewMonth >= td.getMonth())
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center press-active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-slate-600 dark:text-slate-300"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <span className="text-slate-900 dark:text-slate-100 font-semibold text-[15px]">{formatMonthYear(viewYear, viewMonth)}</span>
        <button onClick={nextMonth} disabled={nextDisabled()} className={`w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center press-active ${nextDisabled() ? 'opacity-30' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-slate-600 dark:text-slate-300"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-slate-400 dark:text-slate-500 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />
          const dateStr   = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const log       = getLog(goal.id, dateStr)
          const future    = isFuture(dateStr)
          const todayCell = isToday(dateStr)

          const hasNote = !!logNotes[`${goal.id}_${dateStr}`]
          return (
            <button
              key={dateStr}
              disabled={future}
              onClick={() => !future && setSheetDate(dateStr)}
              className={`flex flex-col items-center justify-center aspect-square rounded-xl press-active transition-colors relative
                ${future ? 'opacity-30 cursor-default' : 'cursor-pointer'}
                ${todayCell ? 'ring-1 ring-indigo-500/60' : ''}
                ${log === false ? 'bg-red-50 dark:bg-red-500/10' : log === undefined ? 'active:bg-slate-100 dark:active:bg-slate-800/60' : ''}`}
              style={log === true ? { backgroundColor: goal.color + '22' } : {}}
            >
              <span className={`text-xs font-medium leading-none mb-0.5 ${todayCell ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>{day}</span>
              {log === true && <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" style={{ color: goal.color }}><path stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              {log === false && <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-red-400"><path stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
              {log === undefined && !future && <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />}
              {hasNote && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: goal.color }} />}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 justify-center">
        {[{ color: goal.color, label: 'Achieved' }, { color: '#f87171', label: 'Missed' }, { color: undefined, label: 'Unlogged', cls: 'bg-slate-300 dark:bg-slate-700' }].map(({ color, label, cls }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${cls || ''}`} style={color ? { backgroundColor: color } : {}} />
            <span className="text-slate-500 dark:text-slate-400 text-xs">{label}</span>
          </div>
        ))}
      </div>

      {sheetDate && (
        <DayLogSheet goal={goal} date={sheetDate} onClose={() => setSheetDate(null)} />
      )}
    </div>
  )
}
