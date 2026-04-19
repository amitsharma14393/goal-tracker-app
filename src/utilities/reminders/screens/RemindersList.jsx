import { useState } from 'react'
import useRemindersStore from '../store'
import ReminderSheet from '../components/ReminderSheet'
import DeleteConfirm from '../../../components/shared/DeleteConfirm'
import PageHeader from '../../../components/shared/PageHeader'
import { useUtilityColor } from '../../../hooks/useUtilityColor'

export default function RemindersList() {
  const reminders      = useRemindersStore((s) => s.reminders)
  const toggleDone     = useRemindersStore((s) => s.toggleDone)
  const deleteReminder = useRemindersStore((s) => s.deleteReminder)
  const color          = useUtilityColor('reminders')

  const [showAdd,      setShowAdd]      = useState(false)
  const [editItem,     setEditItem]     = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const upcoming = reminders.filter((r) => !r.done).sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
  const done     = reminders.filter((r) => r.done)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Reminders"
        subtitle={`${upcoming.length} upcoming`}
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
        <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-2xl px-4 py-3 mb-4">
          <div className="flex items-start gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
            <p className="text-sky-700 dark:text-sky-400 text-xs">iOS does not support web push notifications. Reminders are stored but won't trigger alerts on iPhone.</p>
          </div>
        </div>

        {reminders.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} color={color} />
        ) : (
          <div className="flex flex-col gap-5">
            {upcoming.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Upcoming</p>
                <div className="flex flex-col gap-2">
                  {upcoming.map((r) => (
                    <ReminderItem key={r.id} reminder={r} onToggle={() => toggleDone(r.id)} onEdit={() => setEditItem(r)} onDelete={() => setDeleteTarget(r)} color={color} />
                  ))}
                </div>
              </div>
            )}

            {done.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Done</p>
                <div className="flex flex-col gap-2">
                  {done.map((r) => (
                    <ReminderItem key={r.id} reminder={r} onToggle={() => toggleDone(r.id)} onEdit={() => setEditItem(r)} onDelete={() => setDeleteTarget(r)} color={color} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAdd      && <ReminderSheet onClose={() => setShowAdd(false)} />}
      {editItem     && <ReminderSheet reminder={editItem} onClose={() => setEditItem(null)} />}
      {deleteTarget && (
        <DeleteConfirm
          label={deleteTarget.title}
          onConfirm={() => { deleteReminder(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function ReminderItem({ reminder, onToggle, onEdit, onDelete, color }) {
  const dt      = new Date(reminder.datetime)
  const now     = new Date()
  const overdue = dt < now && !reminder.done

  return (
    <div className="bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none flex items-start gap-3">
      <button
        onClick={onToggle}
        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center press-active transition-colors"
        style={{ borderColor: reminder.done ? color : overdue ? '#ef4444' : color, backgroundColor: reminder.done ? color : 'transparent' }}
      >
        {reminder.done && (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-[15px] font-medium leading-snug ${reminder.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>{reminder.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-medium ${overdue ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
            {overdue ? 'Overdue · ' : ''}{formatDatetime(dt)}
          </span>
          {reminder.recurring && (
            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 capitalize">{reminder.recurring}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={onEdit} className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 press-active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
        </button>
        <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 press-active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
        </button>
      </div>
    </div>
  )
}

function formatDatetime(dt) {
  const now  = new Date()
  const diff = dt - now
  const sameDay = dt.toDateString() === now.toDateString()

  if (sameDay) return `Today ${dt.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}`
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1)
  if (dt.toDateString() === tomorrow.toDateString()) return `Tomorrow ${dt.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}`
  return dt.toLocaleDateString('default', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function EmptyState({ onAdd, color }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </div>
      <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-1">No reminders yet</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-[220px]">Set reminders so you never forget important tasks</p>
      <button onClick={onAdd} className="text-white font-semibold px-6 py-3 rounded-2xl press-active shadow-lg" style={{ backgroundColor: color }}>
        Add First Reminder
      </button>
    </div>
  )
}
