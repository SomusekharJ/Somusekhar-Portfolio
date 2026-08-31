import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

/**
 * CornerWeb
 * ----------
 * A low-opacity decorative web hanging from the top of a section, tethered
 * by a thin thread. Two nested rotation contexts, same reasoning as
 * HangingProfile: `dropRef` handles the one-shot entrance, `spinRef` (a
 * child of dropRef) owns the infinite rotation, so they never collide.
 *
 * `corner="tl"` spins clockwise, `corner="tr"` spins counter-clockwise —
 * mirrored motion reads as a matched pair rather than two random elements.
 *
 * Pass `asset="/your-web.svg"` to swap in a real transparent PNG/SVG file;
 * without it, an inline vector web is used so the component works with
 * zero external assets.
 */
export const CornerWeb = forwardRef(function CornerWeb(
  {
    corner = 'tl',
    size = 200,
    opacity = 0.16,
    blend = 'multiply', // pass "normal" on dark sections — multiply disappears on black
    asset = null,
    className = '',
  },
  ref
) {
  const rootRef = useRef(null)
  const threadRef = useRef(null)
  const dropRef = useRef(null)
  const spinRef = useRef(null)
  const claimedByParent = useRef(false)

  const isRight = corner === 'tr' || corner === 'br'
  const isBottom = corner === 'bl' || corner === 'br'
  const spinDirection = isRight ? -1 : 1 // left webs clockwise, right webs counter-clockwise

  useImperativeHandle(ref, () => ({
    addEntranceTo(tl, position = '>') {
      claimedByParent.current = true
      if (prefersReducedMotion()) {
        tl.set([threadRef.current, dropRef.current], { opacity: opacity, scaleY: 1, y: 0 }, position)
        return tl
      }
      tl.fromTo(
        threadRef.current,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.7, ease: 'power2.out', transformOrigin: 'top center' },
        position
      ).fromTo(
        dropRef.current,
        { y: -50, opacity: 0, rotate: spinDirection * -8 },
        { y: 0, opacity: 1, rotate: 0, duration: 1.3, ease: 'elastic.out(1, 0.6)' },
        '<0.1'
      )
      return tl
    },
  }))

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion()

      const raf = requestAnimationFrame(() => {
        if (claimedByParent.current) return
        if (reduced) {
          gsap.set([threadRef.current, dropRef.current], { scaleY: 1, y: 0, opacity: 1 })
          return
        }
        gsap.fromTo(threadRef.current, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'power2.out' })
        gsap.fromTo(
          dropRef.current,
          { y: -50, opacity: 0, rotate: spinDirection * -8 },
          { y: 0, opacity: 1, rotate: 0, duration: 1.3, ease: 'elastic.out(1, 0.6)', delay: 0.15 }
        )
      })

      // Extremely slow continuous rotation — constant speed reads as
      // ambient/mechanical (a real web catching air), not "breathing", so
      // linear easing is correct here rather than sine.inOut.
      if (!reduced) {
        gsap.to(spinRef.current, {
          rotate: spinDirection * 360,
          duration: 220,
          repeat: -1,
          ease: 'none',
        })
      }

      return () => cancelAnimationFrame(raf)
    }, rootRef)

    return () => ctx.revert()
  }, [spinDirection])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 flex flex-col items-center ${className}`}
      style={{
        top: isBottom ? 'auto' : 0,
        bottom: isBottom ? 0 : 'auto',
        left: isRight ? 'auto' : '6%',
        right: isRight ? '6%' : 'auto',
        width: `clamp(130px, 30vw, ${size}px)`,
      }}
    >
      {/* thread connecting the web down to the section edge */}
      <span
        ref={threadRef}
        className="block w-px h-10 md:h-14 bg-gradient-to-b from-ink/25 to-thread/40"
        style={{ transformOrigin: 'top center' }}
      />

      <div ref={dropRef} className="aspect-square" style={{ opacity }}>
        <div ref={spinRef} style={{ mixBlendMode: blend }}>
          {asset ? (
            <img src={asset} alt="" width="100%" height="100%" draggable={false} />
          ) : (
            <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none">
              {[0, 30, 60, 90, 120, 150].map((deg) => {
                const rad = (deg * Math.PI) / 180
                const x1 = 100 - 95 * Math.cos(rad)
                const y1 = 100 - 95 * Math.sin(rad)
                const x2 = 100 + 95 * Math.cos(rad)
                const y2 = 100 + 95 * Math.sin(rad)
                return (
                  <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(var(--c-char))" strokeWidth="1" />
                )
              })}
              {[28, 52, 76].map((r) => (
                <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgb(var(--c-char))" strokeWidth="1" />
              ))}
            </svg>
          )}
        </div>
      </div>
    </div>
  )
})

/** SpiderMark — a small glyph-scale spider, used beside eyebrow labels. */
export function SpiderMark({ className = 'w-3.5 h-3.5', color = 'rgb(var(--c-blood-light))' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="10.5" r="2.6" fill={color} />
      <ellipse cx="12" cy="15" rx="2.1" ry="2.8" fill={color} />
      <g stroke={color} strokeWidth="1" strokeLinecap="round">
        <path d="M10 9 L4 6" />
        <path d="M10 10.5 L3 10" />
        <path d="M10 12 L4 14.5" />
        <path d="M10 13.5 L5 18" />
        <path d="M14 9 L20 6" />
        <path d="M14 10.5 L21 10" />
        <path d="M14 12 L20 14.5" />
        <path d="M14 13.5 L19 18" />
      </g>
    </svg>
  )
}
