import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useGoalStore from './store/useGoalStore'
import BottomNav from './components/BottomNav'
import GoalsList from './screens/GoalsList'
import GoalDetail from './screens/GoalDetail'
import Today from './screens/Today'

export default function App() {
  const theme = useGoalStore((s) => s.theme)

  // Sync to <html> synchronously on every render — no useEffect timing lag
  document.documentElement.classList.toggle('dark', theme === 'dark')

  return (
    <BrowserRouter>
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<GoalsList />} />
            <Route path="/goal/:id" element={<GoalDetail />} />
            <Route path="/today" element={<Today />} />
          </Routes>
        </div>

        <BottomNavConditional />
      </div>
    </BrowserRouter>
  )
}

function BottomNavConditional() {
  return (
    <Routes>
      <Route path="/" element={<BottomNav />} />
      <Route path="/today" element={<BottomNav />} />
      <Route path="/goal/:id" element={null} />
    </Routes>
  )
}
