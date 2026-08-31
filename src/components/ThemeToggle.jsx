import { useEffect, useState } from 'react'

/**
 * ThemeToggle
 * -----------
 * Small glass pill that flips the whole site between the near-black glass
 * theme and the warm light "glass on cream" theme. The actual color swap
 * happens purely in CSS (data-theme attribute + CSS variables in index.css)
 * — this component only owns the toggle state + persistence.
 */
export default function ThemeToggle({ className = '' }) {
  // Site defaults to light mode. The inline script in index.html already
  // sets data-theme='light' on first paint (or 'dark' if the visitor
  // picked that before), so we just read whatever is on <html> here.
  const [theme, setTheme] = useState(
    () => (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || 'light'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.dispatchEvent(new Event('themechange'))
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* localStorage unavailable — theme just won't persist across reloads */
    }
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    // flex-col so the "light/dark" hint sits directly under the icon in
    // normal document flow — it grows the pill's own height a touch
    // instead of being absolutely positioned, so it never gets clipped
    // by the nav's overflow-hidden glass panel and never overlaps or
    // pushes any other nav item on mobile or desktop.
    <div className={`relative flex flex-col items-center ${className}`}>
      <button
        type="button"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        className="relative flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white transition-transform duration-150 active:scale-90"
      >
        {theme === 'dark' ? (
          // Sun glyph — shown when dark is active, tap to go light
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
          </svg>
        ) : (
          // Moon glyph — shown when light is active, tap to go dark
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none">
            <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
          </svg>
        )}
      </button>

      {/* Hint label — same size/style as the nav links (About, Skills, Work,
          Contact) so it's genuinely visible, not a fine-print afterthought.
          It names the mode a click switches TO (not the current mode), and
          gently blinks to catch a first-time visitor's eye. Respects
          prefers-reduced-motion via the .theme-hint-blink rule in index.css. */}
      <span
        aria-hidden="true"
        className="theme-hint-blink pointer-events-none select-none mt-1 flex items-center gap-1 whitespace-nowrap font-mono text-[10px] md:text-[11px] uppercase tracking-widest2 text-white leading-none"
      >
        <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        {theme === 'dark' ? 'light' : 'dark'}
      </span>
    </div>
  )
}
