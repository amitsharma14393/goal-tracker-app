import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useNotesStore from '../store'
import PageHeader from '../../../components/shared/PageHeader'
import { useUtilityColor } from '../../../hooks/useUtilityColor'

let ReactMarkdown, remarkGfm

export default function NoteDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const notes      = useNotesStore((s) => s.notes)
  const updateNote = useNotesStore((s) => s.updateNote)
  const color      = useUtilityColor('notes')

  const note = notes.find((n) => n.id === id)

  const [editing, setEditing]   = useState(!note?.body && !note?.title ? true : false)
  const [title,   setTitle]     = useState(note?.title || '')
  const [body,    setBody]      = useState(note?.body || '')
  const [mdReady, setMdReady]   = useState(false)
  const saveTimer = useRef(null)

  useEffect(() => {
    import('react-markdown').then((m) => {
      ReactMarkdown = m.default
      import('remark-gfm').then((g) => {
        remarkGfm = g.default
        setMdReady(true)
      })
    })
  }, [])

  useEffect(() => {
    if (!note) return
    setTitle(note.title)
    setBody(note.body)
  }, [note?.id])

  const save = (t, b) => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      updateNote(id, { title: t, body: b })
    }, 600)
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
          <div className="flex flex-col gap-3 h-full">
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); save(e.target.value, body) }}
              placeholder="Title"
              className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-2 text-xl font-bold text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <textarea
              value={body}
              onChange={(e) => { setBody(e.target.value); save(title, e.target.value) }}
              placeholder="Write your note here... Markdown is supported"
              className="flex-1 w-full bg-transparent text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none resize-none text-[15px] leading-relaxed"
              style={{ minHeight: '60vh' }}
            />
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">{title || 'Untitled'}</h1>
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
