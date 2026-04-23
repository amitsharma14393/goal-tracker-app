import { useState, useRef } from 'react'
import useMoodStore from '../store'
import PageHeader from '../../../components/shared/PageHeader'
import { MOOD_COLORS, MOOD_LABELS } from '../../../config/utilities'
import { today } from '../../../utils/dateHelpers'

const RATINGS = [5, 4, 3, 2, 1]

export default function MoodScreen() {
  const entries    = useMoodStore((s) => s.entries)
  const logMood    = useMoodStore((s) => s.logMood)
  const deleteEntry = useMoodStore((s) => s.deleteEntry)

  const todayStr   = today()
  const todayEntry = entries[todayStr]

  const [selected,  setSelected]  = useState(todayEntry?.rating || null)
  const [note,      setNote]      = useState(todayEntry?.note || '')
  const saveTimer = useRef(null)

  const handleRate = (rating) => {
    setSelected(rating)
    logMood(todayStr, rating, note)
  }

  const handleNote = (text) => {
    setNote(text)
    if (selected) {
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => logMood(todayStr, selected, text), 600)
    }
  }

  const pastEntries = Object.entries(entries)
    .filter(([date]) => date !== todayStr)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 30)

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Mood" subtitle="How are you feeling today?" />

      <div className="flex-1 scroll-area px-5 pb-6">
      <div className="flex flex-col gap-5">

        {/* Today's log */}
        <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Today</p>
          </div>

          <div className="px-3 py-2 flex flex-col gap-1.5">
            {RATINGS.map((r) => {
              const active = selected === r
              return (
                <button
                  key={r}
                  onClick={() => handleRate(r)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl press-active transition-all text-left"
                  style={{ backgroundColor: active ? MOOD_COLORS[r] + '18' : 'transparent' }}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 transition-all"
                    style={{ backgroundColor: active ? MOOD_COLORS[r] : '#cbd5e1' }}
                  />
                  <span
                    className="text-[15px] font-semibold transition-colors"
                    style={{ color: active ? MOOD_COLORS[r] : undefined }}
                  >
                    <span className={!active ? 'text-slate-500 dark:text-slate-400' : ''}>{MOOD_LABELS[r]}</span>
                  </span>
                  {active && (
                    <svg viewBox="0 0 24 24" fill="none" stroke={MOOD_COLORS[r]} strokeWidth={2.5} className="w-4 h-4 ml-auto flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>

          {selected && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-700/50 mt-1">
              <textarea
                value={note}
                onChange={(e) => handleNote(e.target.value)}
                placeholder="What's on your mind? (optional)"
                className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none resize-none text-sm leading-relaxed border border-slate-100 dark:border-slate-700 focus:border-purple-400"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Past entries */}
        {pastEntries.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">History</p>
            <div className="flex flex-col gap-2">
              {pastEntries.map(([date, entry]) => (
                <MoodEntry key={date} date={date} entry={entry} onDelete={() => deleteEntry(date)} />
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

function MoodEntry({ date, entry, onDelete }) {
  const color = MOOD_COLORS[entry.rating]
  const [expanded, setExpanded] = useState(false)
  const isLong = entry.note && entry.note.length > 80

  return (
    <div
      className="bg-white dark:bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none"
      onClick={() => isLong && setExpanded((e) => !e)}
    >
      <div className="flex items-start gap-3">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold" style={{ color }}>{MOOD_LABELS[entry.rating]}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(date)}</span>
          </div>
          {entry.note && (
            <p className={`text-slate-500 dark:text-slate-400 text-sm mt-0.5 leading-relaxed ${!expanded && isLong ? 'line-clamp-2' : ''}`}>
              {entry.note}
            </p>
          )}
          {isLong && (
            <p className="text-xs mt-1" style={{ color }}>{expanded ? 'Show less' : 'Show more'}</p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-300 dark:text-slate-600 hover:text-red-400 press-active flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
        </button>
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  const diff = Math.floor((now - d) / 86400000)
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return d.toLocaleDateString('default', { weekday: 'long' })
  return d.toLocaleDateString('default', { month: 'short', day: 'numeric' })
}
