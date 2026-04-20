import { useState, useEffect } from 'react'
import useRemindersStore from '../store'
import BottomSheet from '../../../components/shared/BottomSheet'

const RECURRING_OPTIONS = [
  { value: null,      label: 'Once' },
  { value: 'daily',   label: 'Daily' },
  { value: 'weekly',  label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

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
  const [title,      setTitle]      = useState(reminder?.title || '')
  const [date,       setDate]       = useState(initial.date)
  const [time,       setTime]       = useState(initial.time)
  const [recurring,  setRecurring]  = useState(reminder?.recurring ?? null)
  const [error,      setError]      = useState('')

  const timeParts  = time.split(':')
  const timeHour   = timeParts[0] || '08'
  const timeMinute = timeParts[1] || '00'

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title)
      const s = splitDatetime(reminder.datetime)
      setDate(s.date)
      setTime(s.time)
      setRecurring(reminder.recurring ?? null)
    }
  }, [reminder])

  const setHour   = (h) => { setTime(`${h}:${timeMinute}`); setError('') }
  const setMinute = (m) => { setTime(`${timeHour}:${m}`);   setError('') }

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
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 text-[15px]"
        />
      </div>

      {/* Time */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Time</label>

        {/* Hour + minute selects */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 text-center">Hour</p>
            <select
              value={timeHour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 text-[15px] font-semibold text-center appearance-none"
            >
              {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <span className="text-2xl font-bold text-slate-400 dark:text-slate-500 mt-4">:</span>
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 text-center">Minute</p>
            <select
              value={timeMinute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 text-[15px] font-semibold text-center appearance-none"
            >
              {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
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
