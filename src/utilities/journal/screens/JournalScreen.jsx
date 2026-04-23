import { useState, useRef } from 'react'
import useJournalStore from '../store'
import PageHeader from '../../../components/shared/PageHeader'
import { useUtilityColor } from '../../../hooks/useUtilityColor'
import { JOURNAL_PROMPTS } from '../../../config/utilities'
import { today } from '../../../utils/dateHelpers'

function getDayPrompts(dateStr) {
  const start = new Date('2024-01-01')
  const d     = new Date(dateStr + 'T00:00:00')
  const diff  = Math.floor((d - start) / 86400000)
  const base  = Math.abs((diff * 7) % JOURNAL_PROMPTS.length)
  return [0, 1, 2].map((i) => {
    const index = (base + i * 11) % JOURNAL_PROMPTS.length
    return { index, prompt: JOURNAL_PROMPTS[index] }
  })
}

export default function JournalScreen() {
  const entries     = useJournalStore((s) => s.entries)
  const saveEntry   = useJournalStore((s) => s.saveEntry)
  const deleteEntry = useJournalStore((s) => s.deleteEntry)
  const color       = useUtilityColor('journal')

  const todayStr   = today()
  const todayEntry = entries[todayStr]
  const prompts    = getDayPrompts(todayStr)

  const [selected, setSelected] = useState(todayEntry?.promptIndex ?? null)
  const [response, setResponse] = useState(todayEntry?.response || '')
  const [saved,    setSaved]    = useState(!!todayEntry?.response)
  const saveTimer = useRef(null)

  const handleSelect = (index) => {
    if (todayEntry) return // already answered today, lock selection
    setSelected(index)
    setResponse('')
    setSaved(false)
  }

  const handleChange = (text) => {
    setResponse(text)
    setSaved(false)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (text.trim() && selected !== null) {
        saveEntry(todayStr, selected, text.trim())
        setSaved(true)
      }
    }, 800)
  }

  const pastEntries = Object.entries(entries)
    .filter(([date]) => date !== todayStr)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 20)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Journal"
        subtitle="Pick a prompt that resonates"
        right={
          saved && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: color + '20' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              <span className="text-xs font-semibold" style={{ color }}>Saved</span>
            </div>
          )
        }
      />

      <div className="flex-1 scroll-area px-5 pb-6">
      <div className="flex flex-col gap-5">

        {/* Today's prompts */}
        <div className="flex flex-col gap-2">
          {prompts.map(({ index, prompt }) => {
            const isSelected = selected === index
            const isAnswered = todayEntry?.promptIndex === index
            const isDimmed   = todayEntry && !isAnswered

            return (
              <div key={index}>
                <button
                  onClick={() => handleSelect(index)}
                  disabled={!!todayEntry}
                  className="w-full text-left press-active rounded-2xl border transition-all overflow-hidden"
                  style={{
                    borderColor: isSelected || isAnswered ? color : 'transparent',
                    backgroundColor: isSelected || isAnswered ? color + '12' : undefined,
                    opacity: isDimmed ? 0.35 : 1,
                  }}
                >
                  <div className={`px-4 py-3 rounded-2xl ${!isSelected && !isAnswered ? 'bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                        style={{ borderColor: isSelected || isAnswered ? color : '#cbd5e1' }}
                      >
                        {(isSelected || isAnswered) && (
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        )}
                      </div>
                      <p className="text-[15px] font-medium leading-snug text-slate-800 dark:text-slate-100 flex-1">{prompt}</p>
                    </div>
                  </div>
                </button>

                {/* Write area — appears inline below selected prompt */}
                {(isSelected || isAnswered) && (
                  <div className="mt-2 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none px-4 py-3">
                    <textarea
                      value={response}
                      onChange={(e) => handleChange(e.target.value)}
                      placeholder="Write your thoughts..."
                      readOnly={!!todayEntry && !isSelected}
                      className="w-full bg-transparent text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none resize-none text-[15px] leading-relaxed"
                      rows={5}
                      autoFocus={!todayEntry}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Past entries */}
        {pastEntries.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Past Entries</p>
            <div className="flex flex-col gap-3">
              {pastEntries.map(([date, entry]) => (
                <PastEntry key={date} date={date} entry={entry} color={color} onDelete={() => deleteEntry(date)} />
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

function PastEntry({ date, entry, color, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const prompt = JOURNAL_PROMPTS[entry.promptIndex] || ''

  return (
    <div
      className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none overflow-hidden cursor-pointer press-active"
      onClick={() => setExpanded((e) => !e)}
    >
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="w-1.5 flex-shrink-0 self-stretch rounded-full mt-0.5" style={{ backgroundColor: color + '60', minHeight: '1rem' }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{formatDate(date)}</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 italic mb-1.5 line-clamp-1">{prompt}</p>
          <p className={`text-slate-700 dark:text-slate-300 text-sm leading-relaxed ${expanded ? 'whitespace-pre-wrap' : 'line-clamp-2'}`}>
            {entry.response}
          </p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-300 dark:text-slate-600 hover:text-red-400 press-active flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
        </button>
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  const d    = new Date(dateStr + 'T00:00:00')
  const now  = new Date()
  const diff = Math.floor((now - d) / 86400000)
  if (diff === 1) return 'Yesterday'
  if (diff < 7)  return d.toLocaleDateString('default', { weekday: 'long' })
  return d.toLocaleDateString('default', { month: 'short', day: 'numeric' })
}
