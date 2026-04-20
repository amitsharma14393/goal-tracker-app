import { useState, useEffect } from 'react'
import useTodosStore from '../store'
import BottomSheet from '../../../components/shared/BottomSheet'
import { PRIORITY_CONFIG } from '../../../config/utilities'

const PRIORITIES = ['high', 'medium', 'low']

export default function TodoSheet({ todo, onClose }) {
  const todos      = useTodosStore((s) => s.todos)
  const addTodo    = useTodosStore((s) => s.addTodo)
  const updateTodo = useTodosStore((s) => s.updateTodo)

  const [title,      setTitle]      = useState(todo?.title || '')
  const [priority,   setPriority]   = useState(todo?.priority || 'medium')
  const [dueDate,    setDueDate]    = useState(todo?.dueDate || '')
  const [label,      setLabel]      = useState(todo?.label || '')
  const [labelInput, setLabelInput] = useState('')
  const [error,      setError]      = useState('')

  // All unique labels already in use
  const existingLabels = [...new Set(todos.map((t) => t.label).filter(Boolean))]

  useEffect(() => {
    if (todo) {
      setTitle(todo.title)
      setPriority(todo.priority)
      setDueDate(todo.dueDate || '')
      setLabel(todo.label || '')
    }
  }, [todo])

  const pickLabel = (l) => setLabel(label === l ? '' : l)

  const addCustomLabel = () => {
    const trimmed = labelInput.trim()
    if (!trimmed) return
    setLabel(trimmed)
    setLabelInput('')
  }

  const submit = () => {
    if (!title.trim()) { setError('Give your todo a title'); return }
    const data = { title: title.trim(), priority, dueDate: dueDate || null, label: label || null }
    todo ? updateTodo(todo.id, data) : addTodo(data)
    onClose()
  }

  return (
    <BottomSheet onClose={onClose} title={todo ? 'Edit Todo' : 'New Todo'}>
      {/* Title */}
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

      {/* Label */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Label</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {existingLabels.map((l) => (
            <button
              key={l}
              onClick={() => pickLabel(l)}
              className="px-3 py-1.5 rounded-full text-sm font-medium press-active border transition-colors"
              style={{
                backgroundColor: label === l ? '#f59e0b20' : 'transparent',
                borderColor: label === l ? '#f59e0b' : '#e2e8f0',
                color: label === l ? '#f59e0b' : undefined,
              }}
            >
              <span className={label !== l ? 'text-slate-500 dark:text-slate-400' : ''}>{l}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomLabel()}
            placeholder={existingLabels.length ? 'New label...' : 'e.g. Work, Personal, Shopping'}
            className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
          />
          <button
            onClick={addCustomLabel}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold press-active"
          >
            Add
          </button>
        </div>
        {label && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Selected:</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">{label}</span>
            <button onClick={() => setLabel('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs press-active">✕ clear</button>
          </div>
        )}
      </div>

      {/* Priority */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Priority</label>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => {
            const cfg    = PRIORITY_CONFIG[p]
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

      {/* Due date */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Due Date (optional)</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 text-[15px]"
        />
      </div>

      <button onClick={submit} className="w-full py-3.5 rounded-2xl font-semibold text-white text-[15px] press-active bg-amber-500">
        {todo ? 'Save Changes' : 'Add Todo'}
      </button>
    </BottomSheet>
  )
}
