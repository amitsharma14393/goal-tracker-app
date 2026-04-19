import { useState } from 'react'
import useHabitsStore from '../store'
import HabitCard from '../components/HabitCard'
import HabitSheet from '../components/HabitSheet'
import DeleteConfirm from '../../../components/shared/DeleteConfirm'
import PageHeader from '../../../components/shared/PageHeader'
import { useUtilityColor } from '../../../hooks/useUtilityColor'

export default function HabitsList() {
  const goals      = useHabitsStore((s) => s.goals)
  const deleteGoal = useHabitsStore((s) => s.deleteGoal)
  const color      = useUtilityColor('habits')

  const [showAdd,      setShowAdd]      = useState(false)
  const [editHabit,    setEditHabit]    = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const active = goals.filter((g) => g.isActive)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Habits"
        subtitle={`${active.length} ${active.length === 1 ? 'habit' : 'habits'} tracked`}
        right={
          <button
            onClick={() => setShowAdd(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center press-active shadow-lg"
            style={{ backgroundColor: color, boxShadow: `0 4px 14px ${color}40` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        }
      />

      <div className="flex-1 scroll-area px-5 pb-4">
        {active.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} color={color} />
        ) : (
          <div className="flex flex-col gap-3">
            {active.map((goal) => (
              <HabitCard key={goal.id} goal={goal} onEdit={setEditHabit} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>

      {showAdd       && <HabitSheet onClose={() => setShowAdd(false)} />}
      {editHabit     && <HabitSheet habit={editHabit} onClose={() => setEditHabit(null)} />}
      {deleteTarget  && (
        <DeleteConfirm
          label={deleteTarget.name}
          onConfirm={() => { deleteGoal(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function EmptyState({ onAdd, color }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-1">No habits yet</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-[220px]">Start tracking your daily habits to build streaks</p>
      <button onClick={onAdd} className="text-white font-semibold px-6 py-3 rounded-2xl press-active shadow-lg" style={{ backgroundColor: color }}>
        Add First Habit
      </button>
    </div>
  )
}
