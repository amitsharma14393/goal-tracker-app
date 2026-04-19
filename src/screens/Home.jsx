import { useNavigate } from 'react-router-dom'
import useHabitsStore    from '../utilities/habits/store'
import useTodosStore     from '../utilities/todos/store'
import useNotesStore     from '../utilities/notes/store'
import useMoodStore      from '../utilities/mood/store'
import useRemindersStore from '../utilities/reminders/store'
import useJournalStore   from '../utilities/journal/store'
import useAppStore       from '../store/appStore'
import { UTILITY_COLORS, MOOD_LABELS, JOURNAL_PROMPTS } from '../config/utilities'
import { today } from '../utils/dateHelpers'

export default function Home() {
  const colorMode   = useAppStore((s) => s.colorMode)
  const appColor    = useAppStore((s) => s.appColor)
  const theme       = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const color = (id) => colorMode === 'app' ? appColor : UTILITY_COLORS[id]

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-shrink-0 px-5 pb-3 flex items-end justify-between"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pocket</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Your personal life, organised</p>
        </div>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center press-active mb-0.5"
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-slate-600 dark:text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-slate-600 dark:text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex-1 scroll-area px-5 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <UtilityCard
            id="habits"
            name="Habits"
            color={color('habits')}
            icon={<HabitsIcon />}
            summary={<HabitsSummary />}
          />
          <UtilityCard
            id="todos"
            name="Todos"
            color={color('todos')}
            icon={<TodosIcon />}
            summary={<TodosSummary />}
          />
          <UtilityCard
            id="notes"
            name="Notes"
            color={color('notes')}
            icon={<NotesIcon />}
            summary={<NotesSummary />}
          />
          <UtilityCard
            id="mood"
            name="Mood"
            color={color('mood')}
            icon={<MoodIcon />}
            summary={<MoodSummary />}
          />
          <UtilityCard
            id="reminders"
            name="Reminders"
            color={color('reminders')}
            icon={<RemindersIcon />}
            summary={<RemindersSummary />}
          />
          <UtilityCard
            id="journal"
            name="Journal"
            color={color('journal')}
            icon={<JournalIcon />}
            summary={<JournalSummary />}
          />
        </div>
      </div>
    </div>
  )
}

function UtilityCard({ id, name, color, icon, summary }) {
  const navigate = useNavigate()
  return (
    <div
      className="bg-white dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none press-active cursor-pointer"
      onClick={() => navigate(`/${id}`)}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ backgroundColor: color + '20' }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <p className="font-bold text-slate-900 dark:text-slate-100 text-[15px]">{name}</p>
      <div className="mt-1">{summary}</div>
    </div>
  )
}

function HabitsSummary() {
  const goals = useHabitsStore((s) => s.goals)
  const logs  = useHabitsStore((s) => s.logs)
  const active = goals.filter((g) => g.isActive)
  const done   = active.filter((g) => logs[`${g.id}_${today()}`] === true).length
  if (!active.length) return <p className="text-slate-400 dark:text-slate-500 text-xs">No habits yet</p>
  return <p className="text-slate-500 dark:text-slate-400 text-xs">{done}/{active.length} done today</p>
}

function TodosSummary() {
  const todos  = useTodosStore((s) => s.todos)
  const active = todos.filter((t) => !t.completed && !t.archived)
  const due    = active.filter((t) => t.dueDate && t.dueDate <= today()).length
  if (!active.length) return <p className="text-slate-400 dark:text-slate-500 text-xs">No todos yet</p>
  return <p className="text-slate-500 dark:text-slate-400 text-xs">{due > 0 ? `${due} due today` : `${active.length} active`}</p>
}

function NotesSummary() {
  const notes = useNotesStore((s) => s.notes)
  if (!notes.length) return <p className="text-slate-400 dark:text-slate-500 text-xs">No notes yet</p>
  return <p className="text-slate-500 dark:text-slate-400 text-xs">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
}

function MoodSummary() {
  const entries = useMoodStore((s) => s.entries)
  const entry = entries[today()]
  if (!entry) return <p className="text-slate-400 dark:text-slate-500 text-xs">Not logged today</p>
  return <p className="text-slate-500 dark:text-slate-400 text-xs">{MOOD_LABELS[entry.rating]} today</p>
}

function RemindersSummary() {
  const reminders = useRemindersStore((s) => s.reminders)
  const upcoming  = reminders.filter((r) => !r.done).length
  if (!upcoming) return <p className="text-slate-400 dark:text-slate-500 text-xs">No reminders</p>
  return <p className="text-slate-500 dark:text-slate-400 text-xs">{upcoming} upcoming</p>
}

function JournalSummary() {
  const entries  = useJournalStore((s) => s.entries)
  const todayStr = today()
  const entry    = entries[todayStr]
  const count    = Object.keys(entries).length
  if (entry?.response) return <p className="text-slate-500 dark:text-slate-400 text-xs">Written today</p>
  if (count > 0) return <p className="text-slate-400 dark:text-slate-500 text-xs">{count} {count === 1 ? 'entry' : 'entries'}</p>
  return <p className="text-slate-400 dark:text-slate-500 text-xs">Prompt ready</p>
}

// Icons
const HabitsIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const TodosIcon     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
const NotesIcon     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
const MoodIcon      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
const RemindersIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
const JournalIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
