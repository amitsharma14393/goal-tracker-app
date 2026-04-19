import BottomSheet from './BottomSheet'

export default function DeleteConfirm({ label, onConfirm, onCancel }) {
  return (
    <BottomSheet onClose={onCancel}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/15 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Delete</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">This cannot be undone</p>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-300 text-sm mb-5">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-100">"{label}"</span>?
      </p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3.5 rounded-2xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 press-active text-[15px]"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3.5 rounded-2xl font-semibold text-white bg-red-500 press-active text-[15px]"
        >
          Delete
        </button>
      </div>
    </BottomSheet>
  )
}
