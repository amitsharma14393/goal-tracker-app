import { useState, useEffect } from 'react'
import useTodosStore from '../store'
import BottomSheet from '../../../components/shared/BottomSheet'
import { PRIORITY_CONFIG } from '../../../config/utilities'

const PRIORITIES = ['high', 'medium', 'low']

export default function TodoSheet({ todo, onClose }) {
  const addTodo    = useTodosStore((s) => s.addTodo)
  const updateTodo = useTodosStore((s) => s.updateTodo)

  const [title,    setTitle]    = useState(todo?.title || '')
  const [priority, setPriority] = useState(todo?.priority || 'medium')
  const [dueDate,  setDueDate]  = useState(todo?.dueDate || '')
  const [error,    setError]    = useState('')

  useEffect(() => {
    if (todo) { setTitle(todo.title); setPriority(todo.priority); setDueDate(todo.dueDate || '') }
  }, [todo])

  const submit = () => {
    if (!title.trim()) { setError('Give your todo a title'); return }
    const data = { title: title.trim(), priority, dueDate: dueDate || null }
    todo ? updateTodo(todo.id, data) : addTodo(data)
    onClose()
  }

  return (
    <BottomSheet onClose={onClose} title={todo ? 'Edit Todo' : 'New Todo'}>
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Title</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError('') }}
          placeholder="e.g. Buy groceries"
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 text-[15px]"
        />
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      </div>

      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Priority</label>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => {
            const cfg = PRIORITY_CONFIG[p]
            const active = priority === p
            return (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm press-active transition-colors border"
                style={{
                  backgroundColor: active ? cfg.color + '20' : 'transparent',
                  borderColor: active ? cfg.color : 'transparent',
                  color: active ? cfg.color : undefined,
                }}
              >
                <span className={!active ? 'text-slate-500 dark:text-slate-400' : ''}>{cfg.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Due Date (optional)</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 text-[15px]"
        />
      </div>

      <button
        onClick={submit}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-[15px] press-active bg-amber-500"
      >
        {todo ? 'Save Changes' : 'Add Todo'}
      </button>
    </BottomSheet>
  )
}
