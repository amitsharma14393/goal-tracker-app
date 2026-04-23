import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useHabitsStore from '../store'
import CalendarView from '../components/CalendarView'
import DayLogSheet from '../components/DayLogSheet'
import PageHeader from '../../../components/shared/PageHeader'
import { today } from '../../../utils/dateHelpers'

export default function HabitDetail() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const goals       = useHabitsStore((s) => s.goals)
  const logs        = useHabitsStore((s) => s.logs)
  const getStreak   = useHabitsStore((s) => s.getStreak)
  const toggleLog   = useHabitsStore((s) => s.toggleLog)

  const goal     = goals.find((g) => g.id === id)
  if (!goal) return <div className="flex items-center justify-center h-full text-slate-400"><p>Not found</p></div>

  const streak   = getStreak(goal.id)
  const todayStr = today()
  const todayLog = logs[`${goal.id}_${todayStr}`]

  const [showTodaySheet, setShowTodaySheet] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={goal.name}
        left={<div className="w-3 h-3 rounded-full" style={{ backgroundColor: goal.color }} />}
      />

      <div className="flex-1 scroll-area px-5 pb-4">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">🔥 Streak</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{streak}</span>
              <span className="text-slate-400 text-xs">{streak === 1 ? 'day' : 'days'}</span>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Today</p>
            <button onClick={() => setShowTodaySheet(true)} className="flex items-center gap-2 press-active">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${todayLog === undefined ? 'bg-slate-200 dark:bg-[#1e293b]' : ''}`}
                style={todayLog !== undefined ? { backgroundColor: todayLog === true ? goal.color : '#ef4444' } : {}}
              >
                {todayLog === true  && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                {todayLog === false && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
                {todayLog === undefined && <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />}
              </div>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {todayLog === true ? 'Done!' : todayLog === false ? 'Missed' : 'Log it'}
              </span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
          <CalendarView goal={goal} />
        </div>
        <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-3">Tap any day to log status and add a note</p>
      </div>

      {showTodaySheet && (
        <DayLogSheet goal={goal} date={todayStr} onClose={() => setShowTodaySheet(false)} />
      )}
    </div>
  )
}
