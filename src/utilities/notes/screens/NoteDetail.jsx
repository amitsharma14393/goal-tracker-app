import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import useNotesStore from '../store'
import PageHeader from '../../../components/shared/PageHeader'
import { useUtilityColor } from '../../../hooks/useUtilityColor'

let ReactMarkdown, remarkGfm

export default function NoteDetail() {
  const { id }     = useParams()
  const notes      = useNotesStore((s) => s.notes)
  const updateNote = useNotesStore((s) => s.updateNote)
  const color      = useUtilityColor('notes')

  const note = notes.find((n) => n.id === id)

  const [editing,    setEditing]    = useState(!note?.body && !note?.title ? true : false)
  const [title,      setTitle]      = useState(note?.title || '')
  const [body,       setBody]       = useState(note?.body || '')
  const [label,      setLabel]      = useState(note?.label || '')
  const [labelInput, setLabelInput] = useState('')
  const [showLabels, setShowLabels] = useState(false)
  const [mdReady,    setMdReady]    = useState(false)
  const saveTimer = useRef(null)

  const allLabels = [...new Set(notes.map((n) => n.label).filter(Boolean))]

  useEffect(() => {
    import('react-markdown').then((m) => {
      ReactMarkdown = m.default
      import('remark-gfm').then((g) => { remarkGfm = g.default; setMdReady(true) })
    })
  }, [])

  useEffect(() => {
    if (!note) return
    setTitle(note.title)
    setBody(note.body)
    setLabel(note.label || '')
  }, [note?.id])

  const save = (t, b, l) => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => updateNote(id, { title: t, body: b, label: l ?? label }), 600)
  }

  const pickLabel = (l) => {
    const next = label === l ? '' : l
    setLabel(next)
    updateNote(id, { label: next || null })
    setShowLabels(false)
  }

  const addCustomLabel = () => {
    const trimmed = labelInput.trim()
    if (!trimmed) return
    setLabel(trimmed)
    updateNote(id, { label: trimmed })
    setLabelInput('')
    setShowLabels(false)
  }

  if (!note) return <div className="flex items-center justify-center h-full text-slate-400"><p>Not found</p></div>

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={title || 'Untitled'}
        right={
          <button
            onClick={() => setEditing((e) => !e)}
            className="w-9 h-9 rounded-full flex items-center justify-center press-active"
            style={{ backgroundColor: color + '20' }}
          >
            {editing ? (
              <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
            )}
          </button>
        }
      />

      <div className="flex-1 scroll-area px-5 pb-6">
        {editing ? (
          <div className="flex flex-col gap-3">
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); save(e.target.value, body) }}
              placeholder="Title"
              className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-2 text-xl font-bold text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />

            {/* Label row */}
            <div>
              <button
                onClick={() => setShowLabels((v) => !v)}
                className="flex items-center gap-2 press-active"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L9.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
                {label ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: color + '20', color }}>{label}</span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">Add label</span>
                )}
              </button>

              {showLabels && (
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  {allLabels.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {allLabels.map((l) => (
                        <button
                          key={l}
                          onClick={() => pickLabel(l)}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold press-active border transition-colors"
                          style={{
                            backgroundColor: label === l ? color + '20' : 'transparent',
                            borderColor: label === l ? color : '#e2e8f0',
                            color: label === l ? color : '#64748b',
                          }}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      value={labelInput}
                      onChange={(e) => setLabelInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomLabel()}
                      placeholder="New label..."
                      className="flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                    <button onClick={addCustomLabel} className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold press-active" style={{ backgroundColor: color }}>Add</button>
                  </div>
                  {label && (
                    <button onClick={() => pickLabel(label)} className="mt-2 text-xs text-slate-400 hover:text-red-400 press-active">✕ Remove label</button>
                  )}
                </div>
              )}
            </div>

            <textarea
              value={body}
              onChange={(e) => { setBody(e.target.value); save(title, e.target.value) }}
              placeholder="Write your note here... Markdown is supported"
              className="w-full bg-transparent text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none resize-none text-[15px] leading-relaxed"
              style={{ minHeight: '55vh' }}
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex-1">{title || 'Untitled'}</h1>
              {label && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: color + '20', color }}>{label}</span>
              )}
            </div>
            {mdReady && body ? (
              <div className="prose prose-slate dark:prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-semibold">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-sm italic">{body || 'Empty note — tap edit to write something'}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
