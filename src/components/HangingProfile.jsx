import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion, isFinePointer } from '../utils/motion'

// Reads the active theme's accent color straight off the CSS variable so
// this glow always matches (red in the dark theme, blue-violet in light)
// without needing a hardcoded hex per theme.
const readAccentHex = () => {
  if (typeof document === 'undefined') return '#9E1B22'
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--c-blood').trim()
  const [r, g, b] = raw.split(/\s+/).map(Number)
  if ([r, g, b].some(Number.isNaN)) return '#9E1B22'
  const toHex = (n) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * HangingProfile
 * ----------------
 * A circular portrait suspended by a thread, dropping in with an elastic
 * "hung from the ceiling" entrance, then swinging gently forever after.
 *
 * Two ways to use it:
 *  1. Standalone — just drop it on a page. It plays its own entrance on
 *     mount (no ScrollTrigger needed).
 *  2. Orchestrated — a parent section builds a master gsap.timeline() and
 *     calls `ref.current.addEntranceTo(timeline, position)` to fold this
 *     component's drop into a larger choreographed sequence. The entrance's
 *     physics (y: -800, elastic.out) still live here, only the *timing* is
 *     handed to the parent — the component stays reusable on its own.
 *
 * Structural refs are deliberately split in three so nothing fights over
 * the same transform property:
 *   outerRef  -> entrance transform only (y, opacity)
 *   swingRef  -> ambient sine-wave rotation (nested inside outerRef)
 *   tiltRef   -> cursor-follow rotation (nested inside swingRef) — as the
 *                pointer moves left/right over the photo, it nudges this
 *                layer's rotation toward the cursor, like the thread is
 *                being pushed. Desktop/fine-pointer only; ambient swing
 *                keeps running underneath it regardless.
 */
const HangingProfile = forwardRef(function HangingProfile(
  { src, alt = 'Profile photo', accent, className = '' },
  ref
) {
  const [themeAccent, setThemeAccent] = useState(() => accent || readAccentHex())
  const resolvedAccent = accent || themeAccent

  useEffect(() => {
    if (accent) return // explicit override — don't fight it with theme updates
    const onThemeChange = () => setThemeAccent(readAccentHex())
    window.addEventListener('themechange', onThemeChange)
    return () => window.removeEventListener('themechange', onThemeChange)
  }, [resolvedAccent])

  const outerRef = useRef(null)
  const swingRef = useRef(null)
  const tiltRef = useRef(null)
  const frameRef = useRef(null)
  const claimedByParent = useRef(false)

  useImperativeHandle(ref, () => ({
    addEntranceTo(tl, position = '>') {
      claimedByParent.current = true
      if (prefersReducedMotion()) {
        tl.set(outerRef.current, { y: 0, opacity: 1 }, position)
        return tl
      }
      tl.fromTo(
        outerRef.current,
        { y: -800, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.9, ease: 'elastic.out(1, 0.55)' },
        position
      )
      return tl
    },
  }))

  // Standalone entrance fallback + all continuous ambient motion.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(outerRef.current, { transformOrigin: 'top center' })
      gsap.set(swingRef.current, { transformOrigin: 'top center' })
      gsap.set(tiltRef.current, { transformOrigin: 'top center' })

      const reduced = prefersReducedMotion()

      // Give a parent orchestrator one paint to claim the entrance before
      // falling back to animating in on its own.
      const raf = requestAnimationFrame(() => {
        if (claimedByParent.current) return
        if (reduced) {
          gsap.set(outerRef.current, { y: 0, opacity: 1 })
        } else {
          gsap.fromTo(
            outerRef.current,
            { y: -800, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.9, ease: 'elastic.out(1, 0.55)' }
          )
        }
      })

      if (!reduced) {
        // Ambient swing — small, natural, never stacked with the entrance.
        gsap.to(swingRef.current, {
          rotate: 2.6,
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.7,
        })

        // Breathing glow — boxShadow only, so nothing reflows; it's one
        // element, one tween, low frequency, cheap enough to be worth it.
        gsap.to(frameRef.current, {
          boxShadow: `0 0 0 1px ${resolvedAccent}26, 0 24px 60px -20px ${resolvedAccent}66, 0 0 42px 4px ${resolvedAccent}30`,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      return () => cancelAnimationFrame(raf)
    }, outerRef)

    return () => ctx.revert()
  }, [resolvedAccent])

  // Cursor-follow tilt: nudges rotation toward the pointer's horizontal
  // position as it moves across the photo, like the thread is being
  // pushed. Fine-pointer devices only — there's no hover on touch, and
  // skipping the listeners entirely there avoids paying for them for
  // nothing.
  useEffect(() => {
    const el = outerRef.current
    if (!el || !isFinePointer() || prefersReducedMotion()) return

    const setTilt = gsap.quickTo(tiltRef.current, 'rotate', { duration: 0.7, ease: 'power3' })

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const relX = (e.clientX - rect.left) / rect.width // 0 -> 1 across the element
      const clamped = Math.min(1, Math.max(0, relX))
      setTilt((clamped - 0.5) * 16) // -8deg .. +8deg
    }
    const handleLeave = () => setTilt(0)

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <div ref={outerRef} className={`flex flex-col items-center will-change-transform ${className}`}>
      <div ref={swingRef} className="flex flex-col items-center will-change-transform">
        <div ref={tiltRef} className="flex flex-col items-center will-change-transform">
          {/* thread — thin, longer on desktop */}
          <span
            aria-hidden="true"
            className="block w-px h-[90px] md:h-[150px] lg:h-[170px] bg-gradient-to-b from-paper/55 via-thread to-thread/25"
          />

          {/* frame: thick accent border + breathing glow, no layout side effects */}
          <div
            ref={frameRef}
            className="group relative h-52 w-52 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full border-[6px] border-blood/85 backdrop-blur-md p-1 transition-transform duration-500 ease-out hover:scale-[1.035]"
            style={{ boxShadow: `0 0 0 1px ${resolvedAccent}26, 0 24px 60px -20px ${resolvedAccent}66, 0 0 42px 4px ${resolvedAccent}30` }}
          >
            <div className="h-full w-full overflow-hidden rounded-full">
              <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.06]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default HangingProfile
