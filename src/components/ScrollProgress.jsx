import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/motion'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          gsap.set(barRef.current, { scaleX: self.progress })
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-blood"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
