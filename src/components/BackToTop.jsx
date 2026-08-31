import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

export default function BackToTop() {
  const btnRef = useRef(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return

    const reduced = prefersReducedMotion()
    let visible = false
    const threshold = () => window.innerHeight * 0.6

    const onScroll = () => {
      const shouldShow = window.scrollY > threshold()
      if (shouldShow === visible) return
      visible = shouldShow
      if (reduced) {
        gsap.set(btn, { opacity: shouldShow ? 1 : 0 })
      } else if (shouldShow) {
        gsap.fromTo(
          btn,
          { opacity: 0, scale: 0.6, y: 12 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.6)' }
        )
      } else {
        gsap.to(btn, { opacity: 0, scale: 0.7, y: 12, duration: 0.3, ease: 'power2.in' })
      }
      btn.style.pointerEvents = shouldShow ? 'auto' : 'none'
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#0b0c14]/80 text-white shadow-[0_12px_32px_-10px_rgba(0,0,0,0.5)] backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-150 hover:border-white/30 hover:bg-white/10 active:scale-90 opacity-0"
      style={{ pointerEvents: 'none' }}
    >
      <span aria-hidden="true" className="text-lg leading-none">↑</span>
    </button>
  )
}
