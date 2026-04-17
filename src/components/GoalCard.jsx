import { useNavigate } from 'react-router-dom'
import useGoalStore from '../store/useGoalStore'

export default function GoalCard({ goal, onEdit, onDelete }) {
  const navigate = useNavigate()
  const getStreak = useGoalStore((s) => s.getStreak)
  const streak = getStreak(goal.id)

  return (
    <div
      className="bg-white dark:bg-slate-800/60 rounded-2xl p-4 press-active cursor-pointer border border-slate-200 dark:border-slate-700/50 active:bg-slate-50 dark:active:bg-slate-800/90 transition-colors shadow-sm dark:shadow-none"
      onClick={() => navigate(`/goal/${goal.id}`)}
    >
      <div className="flex items-center justify-between">
        {/* Color dot + name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: goal.color }}
          />
          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate text-[15px]">{goal.name}</span>
        </div>

        {/* Streak + actions */}
        <div className="flex items-center gap-3 ml-3">
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 rounded-full px-2.5 py-1">
              <span className="text-orange-400 text-sm">🔥</span>
              <span className="text-slate-700 dark:text-slate-200 text-xs font-semibold">{streak}</span>
            </div>
          )}

          <button
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 press-active transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(goal)
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>

          <button
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 press-active transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(goal)
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar — last 7 days */}
      <WeekPreview goalId={goal.id} color={goal.color} />
    </div>
  )
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function WeekPreview({ goalId, color }) {
  const logs = useGoalStore((s) => s.logs)
  const days = []
  const todayDate = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayDate)
    d.setDate(todayDate.getDate() - i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    days.push({
      dateStr,
      dayLabel: DAY_LABELS[d.getDay()],
      dayNum: d.getDate(),
      isToday: i === 0,
      log: logs[`${goalId}_${dateStr}`],
    })
  }

  const firstDay = new Date(days[0].dateStr + 'T00:00:00')
  const lastDay = new Date(days[6].dateStr + 'T00:00:00')
  const monthLabel = firstDay.getMonth() === lastDay.getMonth()
    ? firstDay.toLocaleString('default', { month: 'long', year: 'numeric' })
    : `${firstDay.toLocaleString('default', { month: 'short' })} – ${lastDay.toLocaleString('default', { month: 'short', year: 'numeric' })}`

  return (
    <div className="mt-3">
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide">
        {monthLabel}
      </span>
      <div className="mt-2 flex justify-between">
      {days.map(({ dateStr, dayLabel, dayNum, isToday, log }) => (
        <div key={dateStr} className="flex flex-col items-center gap-1">
          <span className={`text-xs font-bold ${
            isToday ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
          }`}>
            {dayLabel}
          </span>
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              log === undefined ? 'bg-slate-100 dark:bg-slate-700/60' : ''
            } ${isToday && log === undefined ? 'ring-2 ring-indigo-400/60' : ''}`}
            style={log !== undefined ? {
              backgroundColor: log === true
                ? 'color-mix(in srgb, #10b981 15%, transparent)'
                : 'color-mix(in srgb, #ef4444 15%, transparent)',
            } : {}}
          >
            {log === true && (
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-500">
                <path stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
            {log === false && (
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-red-400">
                <path stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {log === undefined && (
              <span className={`text-sm font-bold ${
                isToday ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {dayNum}
              </span>
            )}
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}
