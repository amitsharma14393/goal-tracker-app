import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import useAppStore from './store/appStore'
import BottomNav from './components/BottomNav'
import Home from './screens/Home'
import Today from './screens/Today'
import Settings from './screens/Settings'
import HabitsList from './utilities/habits/screens/HabitsList'
import HabitDetail from './utilities/habits/screens/HabitDetail'
import TodosList from './utilities/todos/screens/TodosList'
import NotesList from './utilities/notes/screens/NotesList'
import NoteDetail from './utilities/notes/screens/NoteDetail'
import MoodScreen from './utilities/mood/screens/MoodScreen'
import RemindersList from './utilities/reminders/screens/RemindersList'
import JournalScreen from './utilities/journal/screens/JournalScreen'

export default function App() {
  const theme = useAppStore((s) => s.theme)

  document.documentElement.classList.toggle('dark', theme === 'dark')

  return (
    <BrowserRouter>
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/today"         element={<Today />} />
            <Route path="/settings"      element={<Settings />} />
            <Route path="/habits"        element={<HabitsList />} />
            <Route path="/habits/:id"    element={<HabitDetail />} />
            <Route path="/todos"         element={<TodosList />} />
            <Route path="/notes"         element={<NotesList />} />
            <Route path="/notes/:id"     element={<NoteDetail />} />
            <Route path="/mood"          element={<MoodScreen />} />
            <Route path="/reminders"     element={<RemindersList />} />
            <Route path="/journal"       element={<JournalScreen />} />
          </Routes>
        </div>
        <NavWrapper />
      </div>
    </BrowserRouter>
  )
}

const DETAIL_ROUTES = ['/habits/', '/notes/']

function NavWrapper() {
  const location = useLocation()
  const isDetail = DETAIL_ROUTES.some((r) => location.pathname.startsWith(r) && location.pathname.length > r.length)
  if (isDetail) return null
  return <BottomNav />
}
