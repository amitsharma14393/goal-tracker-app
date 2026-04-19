import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useNotesStore from '../store'
import DeleteConfirm from '../../../components/shared/DeleteConfirm'
import PageHeader from '../../../components/shared/PageHeader'
import { useUtilityColor } from '../../../hooks/useUtilityColor'

export default function NotesList() {
  const notes      = useNotesStore((s) => s.notes)
  const addNote    = useNotesStore((s) => s.addNote)
  const deleteNote = useNotesStore((s) => s.deleteNote)
  const pinNote    = useNotesStore((s) => s.togglePin)
  const navigate   = useNavigate()
  const color      = useUtilityColor('notes')

  const [search,       setSearch]       = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.body.toLowerCase().includes(search.toLowerCase())
  )
  const pinned    = filtered.filter((n) => n.pinned)
  const unpinned  = filtered.filter((n) => !n.pinned)

  const createNote = () => {
    const id = addNote({ title: '', body: '' })
    navigate(`/notes/${id}`)
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Notes"
        subtitle={`${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`}
        right={
          <button
            onClick={createNote}
            className="w-10 h-10 rounded-full flex items-center justify-center press-active shadow-lg"
            style={{ backgroundColor: color, boxShadow: `0 4px 14px ${color}40` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        }
      />

      <div className="flex-1 scroll-area px-5 pb-4">
        {notes.length === 0 ? (
          <EmptyState onCreate={createNote} color={color} />
        ) : (
          <>
            <div className="mb-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            {pinned.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Pinned</p>
                <div className="grid grid-cols-2 gap-2">
                  {pinned.map((n) => <NoteCard key={n.id} note={n} onDelete={() => setDeleteTarget(n)} onPin={() => pinNote(n.id)} navigate={navigate} color={color} />)}
                </div>
              </div>
            )}

            {unpinned.length > 0 && (
              <div>
                {pinned.length > 0 && <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">All Notes</p>}
                <div className="grid grid-cols-2 gap-2">
                  {unpinned.map((n) => <NoteCard key={n.id} note={n} onDelete={() => setDeleteTarget(n)} onPin={() => pinNote(n.id)} navigate={navigate} color={color} />)}
                </div>
              </div>
            )}

            {filtered.length === 0 && search && (
              <p className="text-center text-slate-400 dark:text-slate-500 text-sm mt-8">No notes match "{search}"</p>
            )}
          </>
        )}
      </div>

      {deleteTarget && (
        <DeleteConfirm
          label={deleteTarget.title || 'Untitled Note'}
          onConfirm={() => { deleteNote(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function NoteCard({ note, onDelete, onPin, navigate, color }) {
  const preview = note.body.replace(/[#*`>\-_]/g, '').slice(0, 80)

  return (
    <div
      className="bg-white dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none cursor-pointer press-active relative"
      onClick={() => navigate(`/notes/${note.id}`)}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <p className="text-slate-900 dark:text-slate-100 font-semibold text-sm leading-snug truncate">{note.title || 'Untitled'}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onPin() }}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full press-active"
        >
          <svg viewBox="0 0 24 24" fill={note.pinned ? color : 'none'} stroke={note.pinned ? color : 'currentColor'} strokeWidth={1.8} className="w-3.5 h-3.5 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5l-5.25-3-5.25 3V3.75m10.5 0H6" />
          </svg>
        </button>
      </div>
      {preview && <p className="text-slate-400 dark:text-slate-500 text-xs leading-relaxed line-clamp-3">{preview}</p>}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-slate-400 dark:text-slate-600">{formatDate(note.updatedAt)}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="w-6 h-6 flex items-center justify-center rounded-full text-slate-300 dark:text-slate-600 hover:text-red-400 press-active"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
        </button>
      </div>
    </div>
  )
}

function formatDate(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString('default', { month: 'short', day: 'numeric' })
}

function EmptyState({ onCreate, color }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-1">No notes yet</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-[220px]">Capture your thoughts with markdown support</p>
      <button onClick={onCreate} className="text-white font-semibold px-6 py-3 rounded-2xl press-active shadow-lg" style={{ backgroundColor: color }}>
        Create First Note
      </button>
    </div>
  )
}
