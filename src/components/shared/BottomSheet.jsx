export default function BottomSheet({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end animate-fade-in" onClick={onClose}>
      <div className="sheet-backdrop absolute inset-0" />
      <div
        className="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl px-5 pt-5 scroll-area max-h-[92vh] animate-slide-up"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5" />
        {title && (
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5">{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}
