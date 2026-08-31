import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

export default function StatusStrip() {
  const dotRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to(dotRef.current, {
        scale: 1.8,
        opacity: 0,
        duration: 1.6,
        repeat: -1,
        ease: 'power1.out',
      })
    }, dotRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="relative glass-section border-y border-white/10 px-6 md:px-10 py-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 text-center">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-block h-2 w-2 rounded-full bg-blood" />
          <span
            ref={dotRef}
            className="absolute inline-block h-2 w-2 rounded-full bg-blood"
            style={{ transformOrigin: 'center' }}
          />
        </span>
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-char/60">
          Currently building a multimodal search engine — CLIP · Whisper · sentence-transformers · vector DB
        </p>
      </div>
    </div>
  )
}
