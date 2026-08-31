import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

const MailConfirmContext = createContext(null)

// A single shared "you're about to leave the site" dialog. Any component
// calls askMail(email) and awaits true/false instead of navigating straight
// to a mailto: link — keeps the interaction intentional rather than
// yanking the visitor into their mail client with no warning.
export function MailConfirmProvider({ children }) {
  const [email, setEmail] = useState(null)
  const resolverRef = useRef(null)
  const dialogRef = useRef(null)

  const askMail = useCallback((addr) => {
    setEmail(addr)
    return new Promise((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const close = (result) => {
    setEmail(null)
    resolverRef.current?.(result)
    resolverRef.current = null
  }

  useEffect(() => {
    if (!email || !dialogRef.current) return
    if (prefersReducedMotion()) {
      gsap.set(dialogRef.current, { opacity: 1, scale: 1, y: 0 })
      return
    }
    gsap.fromTo(
      dialogRef.current,
      { opacity: 0, scale: 0.94, y: 8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
    )
  }, [email])

  useEffect(() => {
    if (!email) return
    const onKey = (e) => e.key === 'Escape' && close(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  return (
    <MailConfirmContext.Provider value={askMail}>
      {children}

      {email && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-sm px-6"
          onClick={() => close(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b0c14]/95 backdrop-blur-2xl p-6 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest2 text-white/45 mb-3">
              Leaving the site
            </p>
            <p className="text-white text-sm mb-1">This will open your email app to write to</p>
            <p className="font-mono text-[13px] text-blood-light mb-6 break-all">{email}</p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => close(false)}
                className="flex-1 rounded-full border border-white/20 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest2 text-white/70 transition-colors hover:text-white hover:border-white/40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className="flex-1 rounded-full bg-gradient-to-r from-blood to-glass-violet px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest2 text-white transition-transform hover:-translate-y-0.5"
              >
                Open mail
              </button>
            </div>
          </div>
        </div>
      )}
    </MailConfirmContext.Provider>
  )
}

export function useMailConfirm() {
  const ctx = useContext(MailConfirmContext)
  if (!ctx) throw new Error('useMailConfirm must be used within a MailConfirmProvider')
  return ctx
}
