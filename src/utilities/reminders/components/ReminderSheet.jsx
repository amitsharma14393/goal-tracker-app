import { useState, useEffect } from 'react'
import useRemindersStore from '../store'
import BottomSheet from '../../../components/shared/BottomSheet'

const RECURRING_OPTIONS = [
  { value: null,      label: 'Once' },
  { value: 'daily',   label: 'Daily' },
  { value: 'weekly',  label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const TIME_PRESETS = [
  { label: 'Morning',   value: '08:00', icon: '🌅' },
  { label: 'Noon',      value: '12:00', icon: '☀️' },
  { label: 'Evening',   value: '18:00', icon: '🌇' },
  { label: 'Night',     value: '21:00', icon: '🌙' },
]

function splitDatetime(datetime) {
  if (!datetime) return { date: '', time: '' }
  const [date, time] = datetime.split('T')
  return { date: date || '', time: time?.slice(0, 5) || '' }
}

function joinDatetime(date, time) {
  if (!date || !time) return ''
  return `${date}T${time}`
}

export default function ReminderSheet({ reminder, onClose }) {
  const addReminder    = useRemindersStore((s) => s.addReminder)
  const updateReminder = useRemindersStore((s) => s.updateReminder)

  const initial = splitDatetime(reminder?.datetime)
  const [title,     setTitle]     = useState(reminder?.title || '')
  const [date,      setDate]      = useState(initial.date)
  const [time,      setTime]      = useState(initial.time)
  const [recurring, setRecurring] = useState(reminder?.recurring ?? null)
  const [error,     setError]     = useState('')

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title)
      const s = splitDatetime(reminder.datetime)
      setDate(s.date)
      setTime(s.time)
      setRecurring(reminder.recurring ?? null)
    }
  }, [reminder])

  const selectPreset = (presetTime) => {
    setTime(presetTime)
    setError('')
  }

  const submit = () => {
    if (!title.trim()) { setError('Give your reminder a title'); return }
    if (!date)         { setError('Pick a date'); return }
    if (!time)         { setError('Pick a time'); return }
    const data = { title: title.trim(), datetime: joinDatetime(date, time), recurring }
    reminder ? updateReminder(reminder.id, data) : addReminder(data)
    onClose()
  }

  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <BottomSheet onClose={onClose} title={reminder ? 'Edit Reminder' : 'New Reminder'}>
      <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-xl px-3 py-2 mb-5">
        <p className="text-sky-700 dark:text-sky-400 text-xs">iOS does not support web push notifications — reminders are stored but won't trigger alerts on iPhone.</p>
      </div>

      {/* Title */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Title</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError('') }}
          placeholder="e.g. Take vitamins"
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 text-[15px]"
        />
      </div>

      {/* Date */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date</label>
        <input
          type="date"
          value={date}
          min={todayStr}
          onChange={(e) => { setDate(e.target.value); setError('') }}
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 text-[15px]"
        />
      </div>

      {/* Time presets */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Time</label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {TIME_PRESETS.map((p) => {
            const active = time === p.value
            return (
              <button
                key={p.value}
                onClick={() => selectPreset(p.value)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl press-active border transition-colors"
                style={{
                  backgroundColor: active ? '#0ea5e920' : 'transparent',
                  borderColor: active ? '#0ea5e9' : 'transparent',
                }}
              >
                <span className="text-base">{p.icon}</span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{p.label}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{p.value}</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400 dark:text-slate-500">or custom</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>
        <input
          type="time"
          value={time}
          onChange={(e) => { setTime(e.target.value); setError('') }}
          className="mt-3 w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 text-[15px]"
        />
      </div>

      {/* Repeat */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Repeat</label>
        <div className="flex gap-2">
          {RECURRING_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setRecurring(opt.value)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold press-active transition-colors ${
                recurring === opt.value
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

      <button onClick={submit} className="w-full py-3.5 rounded-2xl font-semibold text-white text-[15px] press-active bg-sky-500">
        {reminder ? 'Save Changes' : 'Add Reminder'}
      </button>
    </BottomSheet>
  )
}
