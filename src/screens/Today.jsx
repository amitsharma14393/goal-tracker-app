import useGoalStore from '../store/useGoalStore'
import { today, formatDisplayDate } from '../utils/dateHelpers'

export default function Today() {
  const goals = useGoalStore((s) => s.goals)
  const logs = useGoalStore((s) => s.logs)
  const toggleLog = useGoalStore((s) => s.toggleLog)

  const activeGoals = goals.filter((g) => g.isActive)
  const todayStr = today()

  const done = activeGoals.filter((g) => logs[`${g.id}_${todayStr}`] === true).length
  const total = activeGoals.length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-4 pb-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Today</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{formatDisplayDate(todayStr)}</p>

        {total > 0 && (
          <div className="mt-4 bg-white dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {done} of {total} completed
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">{Math.round((done / total) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(done / total) * 100}%`,
                  backgroundColor: done === total ? '#10b981' : '#6366f1',
                }}
              />
            </div>
            {done === total && (
              <p className="text-emerald-500 dark:text-emerald-400 text-xs font-medium mt-2 text-center">
                All done for today!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Goal list */}
      <div className="flex-1 scroll-area px-5 pb-4">
        {activeGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No goals to track yet.</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Add goals from the Goals tab.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-1">
            {activeGoals.map((goal) => {
              const log = logs[`${goal.id}_${todayStr}`]
              return (
                <TodayGoalRow
                  key={goal.id}
                  goal={goal}
                  log={log}
                  onToggle={() => toggleLog(goal.id, todayStr)}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function TodayGoalRow({ goal, log, onToggle }) {
  return (
    <div
      className={`flex items-center justify-between bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3.5 border transition-colors shadow-sm dark:shadow-none ${
        log === true
          ? 'border-emerald-400/40 dark:border-emerald-500/30'
          : log === false
          ? 'border-red-400/30 dark:border-red-500/20'
          : 'border-slate-200 dark:border-slate-700/50'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: goal.color }} />
        <span
          className={`font-medium text-[15px] truncate ${
            log === true
              ? 'line-through text-slate-400 dark:text-slate-400'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {goal.name}
        </span>
      </div>

      <div className="flex items-center gap-2 ml-3">
        {log !== undefined && (
          <span className={`text-xs font-medium ${log === true ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {log === true ? 'Done' : 'Missed'}
          </span>
        )}
        <button
          onClick={onToggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center press-active transition-colors flex-shrink-0 ${
            log === undefined ? 'bg-slate-100 dark:bg-[#1e293b]' : ''
          }`}
          style={log !== undefined ? {
            backgroundColor: log === true ? goal.color + '22' : '#ef444422',
          } : {}}
        >
          {log === true && (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ color: goal.color }}>
              <path stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          {log === false && (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-400">
              <path stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {log === undefined && (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-slate-400 dark:text-slate-500">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.8} />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
