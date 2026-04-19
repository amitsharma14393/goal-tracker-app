import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, subtitle, onBack, right }) {
  const navigate = useNavigate()
  const handleBack = onBack || (() => navigate(-1))

  return (
    <div
      className="flex-shrink-0 px-5 pb-3"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onBack !== false && (
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center press-active flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-slate-600 dark:text-slate-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate">{title}</h1>
            {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {right && <div className="ml-3 flex-shrink-0">{right}</div>}
      </div>
    </div>
  )
}
