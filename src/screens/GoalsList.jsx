import { useState } from 'react'
import useGoalStore from '../store/useGoalStore'
import GoalCard from '../components/GoalCard'
import GoalSheet from '../components/GoalSheet'
import DeleteConfirm from '../components/DeleteConfirm'
import ThemeToggle from '../components/ThemeToggle'

export default function GoalsList() {
  const goals = useGoalStore((s) => s.goals)
  const deleteGoal = useGoalStore((s) => s.deleteGoal)

  const [showAdd, setShowAdd] = useState(false)
  const [editGoal, setEditGoal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const activeGoals = goals.filter((g) => g.isActive)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-4 pb-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Goals</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              {activeGoals.length} {activeGoals.length === 1 ? 'habit' : 'habits'} tracked
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setShowAdd(true)}
              className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center press-active shadow-lg shadow-indigo-500/30"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 scroll-area px-5 pb-4">
        {activeGoals.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : (
          <div className="flex flex-col gap-3">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={(g) => setEditGoal(g)}
                onDelete={(g) => setDeleteTarget(g)}
              />
            ))}
          </div>
        )}
      </div>

      {showAdd && <GoalSheet onClose={() => setShowAdd(false)} />}
      {editGoal && <GoalSheet goal={editGoal} onClose={() => setEditGoal(null)} />}
      {deleteTarget && (
        <DeleteConfirm
          goal={deleteTarget}
          onConfirm={() => { deleteGoal(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth={1.5} className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-1">No goals yet</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-[220px]">
        Start tracking your daily habits to build streaks
      </p>
      <button
        onClick={onAdd}
        className="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-2xl press-active shadow-lg shadow-indigo-500/30"
      >
        Add First Goal
      </button>
    </div>
  )
}
