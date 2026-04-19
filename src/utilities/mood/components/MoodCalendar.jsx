import { useState } from 'react'
import useMoodStore from '../store'
import { MOOD_COLORS, MOOD_LABELS } from '../../../config/utilities'
import { getDaysInMonth, getFirstDayOfMonth, formatMonthYear } from '../../../utils/dateHelpers'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function MoodCalendar() {
  const entries = useMoodStore((s) => s.entries)
  const now = new Date()
  const [viewYear,  setViewYear]  = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextDisabled = viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth >= now.getMonth())
  const nextMonth = () => {
    if (nextDisabled) return
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
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
        <button onClick={nextMonth} disabled={nextDisabled} className={`w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center press-active ${nextDisabled ? 'opacity-30' : ''}`}>
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
          const dateStr  = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const entry    = entries[dateStr]
          const today    = dateStr === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
          const future   = new Date(dateStr + 'T00:00:00') > now

          return (
            <div
              key={dateStr}
              title={entry ? MOOD_LABELS[entry.rating] : ''}
              className={`flex flex-col items-center justify-center aspect-square rounded-xl ${today ? 'ring-1 ring-purple-500/60' : ''} ${future ? 'opacity-30' : ''}`}
              style={entry ? { backgroundColor: MOOD_COLORS[entry.rating] + '33' } : {}}
            >
              <span className={`text-xs font-medium leading-none ${today ? 'text-purple-500 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'}`}>{day}</span>
              {entry && (
                <span className="text-[10px] mt-0.5" style={{ color: MOOD_COLORS[entry.rating] }}>
                  {entry.rating === 5 ? '😄' : entry.rating === 4 ? '🙂' : entry.rating === 3 ? '😐' : entry.rating === 2 ? '😔' : '😞'}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-3 mt-4 justify-center flex-wrap">
        {[5, 4, 3, 2, 1].map((r) => (
          <div key={r} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MOOD_COLORS[r] }} />
            <span className="text-slate-500 dark:text-slate-400 text-xs">{MOOD_LABELS[r]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
