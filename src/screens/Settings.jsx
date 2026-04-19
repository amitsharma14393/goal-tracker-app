import useAppStore from '../store/appStore'
import { COLOR_PALETTE } from '../config/utilities'

export default function Settings() {
  const theme      = useAppStore((s) => s.theme)
  const colorMode  = useAppStore((s) => s.colorMode)
  const appColor   = useAppStore((s) => s.appColor)
  const toggleTheme  = useAppStore((s) => s.toggleTheme)
  const setColorMode = useAppStore((s) => s.setColorMode)
  const setAppColor  = useAppStore((s) => s.setAppColor)

  document.documentElement.classList.toggle('dark', theme === 'dark')

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-shrink-0 px-5 pb-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
      </div>

      <div className="flex-1 scroll-area px-5 pb-4 flex flex-col gap-4">

        {/* Appearance */}
        <Section title="Appearance">
          <Row
            label="Theme"
            right={
              <Toggle
                value={theme === 'dark'}
                onChange={toggleTheme}
                labelOn="Dark"
                labelOff="Light"
              />
            }
          />
        </Section>

        {/* Color */}
        <Section title="Accent Color">
          <div className="flex gap-3 mb-4">
            <ModeButton
              active={colorMode === 'utility'}
              onClick={() => setColorMode('utility')}
              label="Per utility"
            />
            <ModeButton
              active={colorMode === 'app'}
              onClick={() => setColorMode('app')}
              label="App-wide"
            />
          </div>

          {colorMode === 'app' && (
            <div className="flex gap-3 flex-wrap">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setAppColor(c.value)}
                  className="w-9 h-9 rounded-full press-active flex items-center justify-center"
                  style={{ backgroundColor: c.value }}
                >
                  {appColor === c.value && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {colorMode === 'utility' && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Each utility uses its own accent color
            </p>
          )}
        </Section>

        {/* About */}
        <Section title="About">
          <Row label="App" right={<span className="text-slate-500 dark:text-slate-400 text-sm">Pocket</span>} />
          <Row label="Version" right={<span className="text-slate-500 dark:text-slate-400 text-sm">1.0.0</span>} />
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">{title}</p>
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none px-4 py-3 flex flex-col gap-3">
        {children}
      </div>
    </div>
  )
}

function Row({ label, right }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[15px] font-medium text-slate-900 dark:text-slate-100">{label}</span>
      {right}
    </div>
  )
}

function Toggle({ value, onChange, labelOn, labelOff }) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2 press-active"
    >
      <span className="text-sm text-slate-500 dark:text-slate-400">{value ? labelOn : labelOff}</span>
      <div className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </div>
    </button>
  )
}

function ModeButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-xl text-sm font-semibold press-active transition-colors ${
        active
          ? 'bg-indigo-500 text-white'
          : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
      }`}
    >
      {label}
    </button>
  )
}
