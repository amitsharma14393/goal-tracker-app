import { useNavigate } from 'react-router-dom'
import useHabitsStore    from '../utilities/habits/store'
import useTodosStore     from '../utilities/todos/store'
import useMoodStore      from '../utilities/mood/store'
import useRemindersStore from '../utilities/reminders/store'
import useAppStore       from '../store/appStore'
import { UTILITY_COLORS, MOOD_LABELS, MOOD_COLORS, PRIORITY_CONFIG } from '../config/utilities'
import { today, formatDisplayDate } from '../utils/dateHelpers'

export default function Today() {
  const todayStr  = today()
  const colorMode = useAppStore((s) => s.colorMode)
  const appColor  = useAppStore((s) => s.appColor)
  const color = (id) => colorMode === 'app' ? appColor : UTILITY_COLORS[id]

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-shrink-0 px-5 pb-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Today</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{formatDisplayDate(todayStr)}</p>
      </div>

      <div className="flex-1 scroll-area px-5 pb-4">
        <div className="flex flex-col gap-5">
          <HabitsSection color={color('habits')} todayStr={todayStr} />
          <TodosSection color={color('todos')} todayStr={todayStr} />
          <MoodSection color={color('mood')} todayStr={todayStr} />
          <RemindersSection color={color('reminders')} todayStr={todayStr} />
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ label, color, count }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
      {count != null && (
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-auto">{count}</span>
      )}
    </div>
  )
}

function HabitsSection({ color, todayStr }) {
  const goals    = useHabitsStore((s) => s.goals)
  const logs     = useHabitsStore((s) => s.logs)
  const toggleLog = useHabitsStore((s) => s.toggleLog)
  const active   = goals.filter((g) => g.isActive)
  if (!active.length) return null

  return (
    <div>
      <SectionHeader label="Habits" color={color} count={`${active.filter(g => logs[`${g.id}_${todayStr}`] === true).length}/${active.length}`} />
      <div className="flex flex-col gap-2">
        {active.map((goal) => {
          const log = logs[`${goal.id}_${todayStr}`]
          return (
            <div key={goal.id} className={`flex items-center justify-between bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3 border shadow-sm dark:shadow-none transition-colors ${
              log === true ? 'border-emerald-400/40 dark:border-emerald-500/30' : log === false ? 'border-red-400/30 dark:border-red-500/20' : 'border-slate-200 dark:border-slate-700/50'
            }`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: goal.color }} />
                <span className={`font-medium text-[15px] truncate ${log === true ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>{goal.name}</span>
              </div>
              <button
                onClick={() => toggleLog(goal.id, todayStr)}
                className={`w-10 h-10 rounded-full flex items-center justify-center press-active flex-shrink-0 ml-3 ${log === undefined ? 'bg-slate-100 dark:bg-slate-700/60' : ''}`}
                style={log !== undefined ? { backgroundColor: log === true ? goal.color + '22' : '#ef444422' } : {}}
              >
                {log === true && <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-emerald-500"><path stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                {log === false && <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-400"><path stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
                {log === undefined && <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-slate-400 dark:text-slate-500"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.8} /></svg>}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TodosSection({ color, todayStr }) {
  const navigate       = useNavigate()
  const todos          = useTodosStore((s) => s.todos)
  const toggleComplete = useTodosStore((s) => s.toggleComplete)

  const due = todos.filter((t) => !t.completed && !t.archived && t.dueDate && t.dueDate <= todayStr)
  if (!due.length) return null

  return (
    <div>
      <SectionHeader label="Todos due" color={color} count={due.length} />
      <div className="flex flex-col gap-2">
        {due.map((todo) => (
          <div key={todo.id} className="flex items-center gap-3 bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
            <button onClick={() => toggleComplete(todo.id)} className="flex-shrink-0 press-active">
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: PRIORITY_CONFIG[todo.priority].color }} />
            </button>
            <span className="flex-1 text-[15px] font-medium text-slate-900 dark:text-slate-100 truncate">{todo.title}</span>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PRIORITY_CONFIG[todo.priority].color }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function MoodSection({ color, todayStr }) {
  const navigate = useNavigate()
  const entries  = useMoodStore((s) => s.entries)
  const entry    = entries[todayStr]

  if (!entry) return null

  return (
    <div>
      <SectionHeader label="Mood" color={color} />
      <div
        className="bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none flex items-center justify-between press-active cursor-pointer"
        onClick={() => navigate('/mood')}
      >
        <span className="text-[15px] font-medium text-slate-900 dark:text-slate-100">
          {MOOD_LABELS[entry.rating]}
        </span>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((r) => (
            <div
              key={r}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: r <= entry.rating ? MOOD_COLORS[entry.rating] : '#e2e8f0' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function RemindersSection({ color, todayStr }) {
  const reminders  = useRemindersStore((s) => s.reminders)
  const toggleDone = useRemindersStore((s) => s.toggleDone)

  const due = reminders.filter((r) => {
    if (r.done) return false
    if (!r.datetime) return false
    return r.datetime.slice(0, 10) <= todayStr
  })

  if (!due.length) return null

  return (
    <div>
      <SectionHeader label="Reminders" color={color} count={due.length} />
      <div className="flex flex-col gap-2">
        {due.map((r) => (
          <div key={r.id} className="flex items-center gap-3 bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
            <button onClick={() => toggleDone(r.id)} className="flex-shrink-0 press-active">
              <div className="w-5 h-5 rounded-full border-2 border-sky-400" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-slate-900 dark:text-slate-100 truncate">{r.title}</p>
              {r.datetime && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {new Date(r.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
