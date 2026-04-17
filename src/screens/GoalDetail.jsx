import { useParams, useNavigate } from 'react-router-dom'
import useGoalStore from '../store/useGoalStore'
import CalendarView from '../components/CalendarView'
import { today } from '../utils/dateHelpers'

export default function GoalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const goals = useGoalStore((s) => s.goals)
  const logs = useGoalStore((s) => s.logs)
  const getStreak = useGoalStore((s) => s.getStreak)
  const toggleLog = useGoalStore((s) => s.toggleLog)

  const goal = goals.find((g) => g.id === id)

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
        <p>Goal not found</p>
        <button onClick={() => navigate('/')} className="mt-3 text-indigo-500 dark:text-indigo-400 text-sm">
          Go back
        </button>
      </div>
    )
  }

  const streak = getStreak(goal.id)
  const todayLog = logs[`${goal.id}_${today()}`]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-4 pb-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center press-active flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-slate-600 dark:text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: goal.color }} />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate">{goal.name}</h1>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-4">
          <StatCard
            label="Current Streak"
            value={streak}
            suffix={streak === 1 ? 'day' : 'days'}
            icon="🔥"
          />
          <TodayCard goal={goal} todayLog={todayLog} onToggle={() => toggleLog(goal.id, today())} />
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 scroll-area px-5 pb-4">
        <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
          <CalendarView goal={goal} />
        </div>

        <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-3">
          Tap any past day to log or change its status
        </p>
      </div>
    </div>
  )
}

function StatCard({ label, value, suffix, icon }) {
  return (
    <div className="flex-1 bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</span>
        <span className="text-slate-500 dark:text-slate-400 text-xs">{suffix}</span>
      </div>
    </div>
  )
}

function TodayCard({ goal, todayLog, onToggle }) {
  return (
    <div className="flex-1 bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Today</span>
      </div>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 press-active"
      >
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
            todayLog === undefined ? 'bg-slate-200 dark:bg-[#1e293b]' : ''
          }`}
          style={todayLog !== undefined ? {
            backgroundColor: todayLog === true ? goal.color : '#ef4444',
          } : {}}
        >
          {todayLog === true && (
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          {todayLog === false && (
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {todayLog === undefined && (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
          )}
        </div>
        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
          {todayLog === true ? 'Done!' : todayLog === false ? 'Missed' : 'Log it'}
        </span>
      </button>
    </div>
  )
}
