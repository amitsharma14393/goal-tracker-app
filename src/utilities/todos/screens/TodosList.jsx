import { useState } from 'react'
import useTodosStore from '../store'
import TodoSheet from '../components/TodoSheet'
import DeleteConfirm from '../../../components/shared/DeleteConfirm'
import PageHeader from '../../../components/shared/PageHeader'
import { useUtilityColor } from '../../../hooks/useUtilityColor'
import { PRIORITY_CONFIG } from '../../../config/utilities'
import { today } from '../../../utils/dateHelpers'

export default function TodosList() {
  const todos      = useTodosStore((s) => s.todos)
  const toggleDone = useTodosStore((s) => s.toggleComplete)
  const archiveTodo = useTodosStore((s) => s.archiveTodo)
  const deleteTodo = useTodosStore((s) => s.deleteTodo)
  const color      = useUtilityColor('todos')

  const [showAdd,      setShowAdd]      = useState(false)
  const [editTodo,     setEditTodo]     = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const active    = todos.filter((t) => !t.completed && !t.archived)
  const completed = todos.filter((t) => t.completed && !t.archived)
  const archived  = todos.filter((t) => t.archived)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Todos"
        subtitle={`${active.length} active`}
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
        {active.length === 0 && completed.length === 0 && archived.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} color={color} />
        ) : (
          <div className="flex flex-col gap-6">
            {active.length > 0 && (
              <Section title="Active">
                {active.map((t) => (
                  <TodoItem key={t.id} todo={t} onToggle={() => toggleDone(t.id)} onEdit={() => setEditTodo(t)} onDelete={() => setDeleteTarget(t)} color={color} />
                ))}
              </Section>
            )}

            {completed.length > 0 && (
              <Section title="Completed">
                {completed.map((t) => (
                  <TodoItem key={t.id} todo={t} onToggle={() => toggleDone(t.id)} onEdit={() => setEditTodo(t)} onDelete={() => setDeleteTarget(t)} onArchive={() => archiveTodo(t.id)} color={color} />
                ))}
              </Section>
            )}

            {archived.length > 0 && (
              <Section title="Archived">
                {archived.map((t) => (
                  <TodoItem key={t.id} todo={t} onToggle={() => toggleDone(t.id)} onEdit={() => setEditTodo(t)} onDelete={() => setDeleteTarget(t)} color={color} isArchived />
                ))}
              </Section>
            )}
          </div>
        )}
      </div>

      {showAdd      && <TodoSheet onClose={() => setShowAdd(false)} />}
      {editTodo     && <TodoSheet todo={editTodo} onClose={() => setEditTodo(null)} />}
      {deleteTarget && (
        <DeleteConfirm
          label={deleteTarget.title}
          onConfirm={() => { deleteTodo(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function TodoItem({ todo, onToggle, onEdit, onDelete, onArchive, color, isArchived }) {
  const cfg      = PRIORITY_CONFIG[todo.priority]
  const todayStr = today()
  const overdue  = todo.dueDate && todo.dueDate < todayStr && !todo.completed

  return (
    <div className="bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none flex items-start gap-3">
      <button
        onClick={onToggle}
        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center press-active transition-colors"
        style={{ borderColor: todo.completed ? color : cfg.color, backgroundColor: todo.completed ? color : 'transparent' }}
      >
        {todo.completed && (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-[15px] font-medium leading-snug ${todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>{todo.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: cfg.color + '20', color: cfg.color }}>{cfg.label}</span>
          {todo.dueDate && (
            <span className={`text-[11px] font-medium ${overdue ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
              {overdue ? 'Overdue · ' : ''}{formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 ml-1">
        {onArchive && (
          <button onClick={onArchive} className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 press-active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
          </button>
        )}
        {!isArchived && (
          <button onClick={onEdit} className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 press-active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
          </button>
        )}
        <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 press-active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
        </button>
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('default', { month: 'short', day: 'numeric' })
}

function EmptyState({ onAdd, color }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-1">No todos yet</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-[220px]">Add tasks to keep track of what needs to be done</p>
      <button onClick={onAdd} className="text-white font-semibold px-6 py-3 rounded-2xl press-active shadow-lg" style={{ backgroundColor: color }}>
        Add First Todo
      </button>
    </div>
  )
}
