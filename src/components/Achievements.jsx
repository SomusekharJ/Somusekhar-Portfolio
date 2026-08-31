import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion, bindGlassCard } from '../utils/motion'

// Drop a real photo for any achievement into public/images/achievements/
// using the filename below, then set that item's `photo` field to the
// matching path, e.g. photo: '/images/achievements/astranova.jpg'.
// Left null for now — cards fall back to a placeholder slot.
const STATS = [
  {
    stat: '8.7+',
    label: 'CGPA / 10',
    detail: "B.E. Computer Science & Engineering — St. Joseph's College of Engineering, Anna University",
    photo: null, // public/images/achievements/education.jpg
  },
  {
    stat: '2nd',
    label: 'Prize · Astranova2k26',
    detail: 'MediRoute AI — AI-assisted emergency triage & ambulance routing',
    photo: null, // public/images/achievements/astranova.jpg
  },
  {
    stat: '92%',
    label: 'Accuracy',
    detail: 'Indian Sign Language Recognition — MediaPipe + Random Forest',
    photo: null, // public/images/achievements/sign-language.jpg
  },
  {
    stat: 'Runner-Up',
    label: 'Expo 2k26',
    detail: 'Cattle Breed Classifier — CNN-based image classification',
    photo: null, // public/images/achievements/cattle-breed.jpg
  },
]

export default function Achievements() {
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  cardRefs.current = []
  const addCard = (el) => el && !cardRefs.current.includes(el) && cardRefs.current.push(el)

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(cardRefs.current, { opacity: 1, y: 0, scale: 1 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 24, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        }
      )
    }, sectionRef)
    const cleanups = cardRefs.current.map((el) => bindGlassCard(el, { tilt: 4 }))
    return () => {
      ctx.revert()
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <section id="achievements" ref={sectionRef} className="relative bg-[#05070f] px-6 md:px-10 py-14 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              ref={addCard}
              className="glass-fixed glass-glow spotlight rounded-3xl p-6 md:p-7 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1 will-change-transform"
            >
              {s.photo ? (
                <img
                  src={s.photo}
                  alt={s.label}
                  className="h-28 w-full rounded-xl object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-28 w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-white/25">
                  <span className="font-mono text-[10px] uppercase tracking-widest2">Add Photo</span>
                </div>
              )}
              <span className="font-display uppercase text-3xl md:text-4xl text-blood-light leading-none">
                {s.stat}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest2 text-white/80">
                {s.label}
              </span>
              <span className="font-body text-[13px] leading-relaxed text-white/60">{s.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
