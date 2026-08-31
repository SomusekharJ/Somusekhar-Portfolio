import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion, isFinePointer } from '../utils/motion'
import { useResumeConfirm } from '../context/ResumeConfirm'
import { triggerDownload } from '../utils/download'

const RESUME_FILE = 'Somusekhar_J_Resume.pdf'

const BG_IMAGE =
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop'
const FG_IMAGE =
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop'

export default function Hero() {
  const askResume = useResumeConfirm()

  const handleResumeClick = async (e) => {
    e.preventDefault()
    const confirmed = await askResume(RESUME_FILE)
    if (confirmed) triggerDownload(`/${RESUME_FILE}`, RESUME_FILE)
  }

  const sectionRef = useRef(null)
  const bgLayerRef = useRef(null)
  const fgLayerRef = useRef(null)
  const cursorWebRef = useRef(null)
  const webLineRefs = useRef([])
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const line3Ref = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const scrollCueRef = useRef(null)

  webLineRefs.current = []
  const addWebLine = (el) => {
    if (el && !webLineRefs.current.includes(el)) webLineRefs.current.push(el)
  }

  // ---- Entrance timeline (runs once on mount) ----
  useEffect(() => {
    const ctx = gsap.context(() => {
      // seed mask/parallax vars at center
      gsap.set(fgLayerRef.current, { '--mx': '58%', '--my': '46%' })
      gsap.set(cursorWebRef.current, { xPercent: -50, yPercent: -50, opacity: 0 })

      if (prefersReducedMotion()) {
        gsap.set(bgLayerRef.current, { opacity: 1 })
        gsap.set(webLineRefs.current, { strokeDashoffset: 0 })
        gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], { yPercent: 0 })
        gsap.set([subRef.current, scrollCueRef.current], { opacity: 1 })
        gsap.set(ctaRef.current.children, { opacity: 1, y: 0, scale: 1 })
        return
      }

      webLineRefs.current.forEach((el) => {
        const len = el.getTotalLength ? el.getTotalLength() : 300
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
      })

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo(
        bgLayerRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: 'power3.out' }
      )
        .to(
          webLineRefs.current,
          { strokeDashoffset: 0, duration: 1.6, stagger: 0.06, ease: 'power2.out' },
          0.2
        )
        .fromTo(
          [line1Ref.current, line2Ref.current, line3Ref.current],
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, stagger: 0.1 },
          0.5
        )
        .fromTo(subRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .fromTo(
          ctaRef.current.children,
          { opacity: 0, y: 16, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1 },
          '-=0.5'
        )
        .fromTo(scrollCueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.3')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // ---- Ambient continuous motion: scroll cue pulse ----
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to(scrollCueRef.current, {
        y: 8,
        duration: 1.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // ---- Mouse-following mask + parallax (interactive, not entrance) ----
  useEffect(() => {
    const section = sectionRef.current
    if (!section || !isFinePointer()) return

    const maskX = gsap.quickTo(fgLayerRef.current, '--mx', { duration: 0.9, ease: 'power3' })
    const maskY = gsap.quickTo(fgLayerRef.current, '--my', { duration: 0.9, ease: 'power3' })
    const cursorX = gsap.quickTo(cursorWebRef.current, 'x', { duration: 0.55, ease: 'power3' })
    const cursorY = gsap.quickTo(cursorWebRef.current, 'y', { duration: 0.55, ease: 'power3' })
    const bgX = gsap.quickTo(bgLayerRef.current, 'xPercent', { duration: 1.1, ease: 'power3' })
    const bgY = gsap.quickTo(bgLayerRef.current, 'yPercent', { duration: 1.1, ease: 'power3' })

    const handleMove = (e) => {
      const rect = section.getBoundingClientRect()
      const px = ((e.clientX - rect.left) / rect.width) * 100
      const py = ((e.clientY - rect.top) / rect.height) * 100
      maskX(`${px}%`)
      maskY(`${py}%`)
      cursorX(e.clientX - rect.left)
      cursorY(e.clientY - rect.top)
      bgX((px - 50) * -0.03)
      bgY((py - 50) * -0.03)
    }

    const handleEnter = () => gsap.to(cursorWebRef.current, { opacity: 1, duration: 0.4 })
    const handleLeave = () => gsap.to(cursorWebRef.current, { opacity: 0, duration: 0.4 })

    section.addEventListener('mousemove', handleMove)
    section.addEventListener('mouseenter', handleEnter)
    section.addEventListener('mouseleave', handleLeave)
    return () => {
      section.removeEventListener('mousemove', handleMove)
      section.removeEventListener('mouseenter', handleEnter)
      section.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[100dvh] w-full overflow-hidden bg-[#0b0b0c] select-none"
    >
      {/* Background layer — duotone / desaturated */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(11,11,12,0.55), rgba(11,11,12,0.85)), url(${BG_IMAGE})`,
          filter: 'grayscale(1) contrast(1.1)',
        }}
      />

      {/* Foreground layer — full color, revealed through a mouse-following web aperture */}
      <div
        ref={fgLayerRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20,3,5,0.35), rgba(11,11,12,0.7)), url(${FG_IMAGE})`,
          WebkitMaskImage:
            'radial-gradient(circle at var(--mx) var(--my), black 0%, black 12%, transparent 34%)',
          maskImage:
            'radial-gradient(circle at var(--mx) var(--my), black 0%, black 12%, transparent 34%)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      />

      {/* Cursor-anchored web iris — visually frames the reveal as "seen through a web" */}
      <div
        ref={cursorWebRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-[300px] h-[300px]"
      >
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {[60, 100, 140].map((r) => (
            <circle
              key={r}
              cx="150"
              cy="150"
              r={r}
              fill="none"
              stroke="rgb(var(--c-blood-light))"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => {
            const deg = (i * 360) / 10
            const rad = (deg * Math.PI) / 180
            const x = 150 + 145 * Math.cos(rad)
            const y = 150 + 145 * Math.sin(rad)
            return (
              <line
                key={i}
                x1="150"
                y1="150"
                x2={x}
                y2={y}
                stroke="rgb(var(--c-blood-light))"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
            )
          })}
        </svg>
      </div>

      {/* Corner spiderweb decorations — draw in on load, ambient afterward */}
      <svg
        className="pointer-events-none absolute top-0 left-0 w-[160px] h-[160px] md:w-[260px] md:h-[260px] opacity-70"
        viewBox="0 0 260 260"
        aria-hidden="true"
      >
        {[0, 20, 40, 60, 90].map((deg, i) => {
          const rad = (deg * Math.PI) / 180
          return (
            <line
              key={i}
              ref={addWebLine}
              x1="0"
              y1="0"
              x2={260 * Math.cos(rad)}
              y2={260 * Math.sin(rad)}
              stroke="#F4F7FF"
              strokeOpacity="0.25"
              strokeWidth="1"
            />
          )
        })}
        {[50, 100, 160].map((r, i) => (
          <path
            key={i}
            ref={addWebLine}
            d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
            stroke="#F4F7FF"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
        ))}
      </svg>
      <svg
        className="pointer-events-none absolute bottom-0 right-0 w-[140px] h-[140px] md:w-[220px] md:h-[220px] opacity-60"
        viewBox="0 0 220 220"
        style={{ transform: 'rotate(180deg)' }}
        aria-hidden="true"
      >
        {[10, 35, 60, 85].map((deg, i) => {
          const rad = (deg * Math.PI) / 180
          return (
            <line
              key={i}
              ref={addWebLine}
              x1="0"
              y1="0"
              x2={220 * Math.cos(rad)}
              y2={220 * Math.sin(rad)}
              stroke="#F4F7FF"
              strokeOpacity="0.22"
              strokeWidth="1"
            />
          )
        })}
      </svg>

      {/* Content */}
      <div className="desktop-hero-content relative z-10 flex h-full w-full flex-col justify-end px-6 md:justify-start md:px-10 lg:px-[clamp(2.5rem,5vw,7rem)] pb-16 md:pb-20 md:pt-[clamp(9rem,18vh,18rem)]">
        <p className="font-mono text-[11px] md:text-xs tracking-widest2 uppercase text-white/70 mb-4">
          AI/ML Engineer — Chennai
        </p>

        <h1 className="desktop-hero-title font-display uppercase leading-[0.86] text-white">
          <span className="block reveal-mask">
            <span ref={line1Ref} className="block text-[10.5vw] sm:text-[9vw] md:text-[clamp(5.5rem,8.2vw,11.5rem)]">
              I Build
            </span>
          </span>
          <span className="block reveal-mask">
            <span
              ref={line2Ref}
              className="block text-[10.5vw] sm:text-[9vw] md:text-[clamp(5.5rem,8.2vw,11.5rem)] text-blood-light"
            >
              Intelligent
            </span>
          </span>
          <span className="block reveal-mask">
            <span
              ref={line3Ref}
              className="block text-[10.5vw] sm:text-[9vw] md:text-[clamp(5.5rem,8.2vw,11.5rem)] text-blood-light"
            >
              Systems
            </span>
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-6 max-w-md font-body text-sm md:text-base text-white/80 leading-relaxed"
        >
          <span className="text-white font-medium">Somusekhar J</span> — I design and build
          machine learning, deep learning, NLP, computer vision, and generative AI systems, from
          model development through to production deployment.
        </p>

        <div ref={ctaRef} className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="glass-shimmer rounded-full bg-gradient-to-r from-blood to-glass-violet px-7 py-3.5 font-mono text-[11px] uppercase tracking-widest2 text-white shadow-glow border border-white/20 transition-all duration-300 will-change-transform hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-10px_rgba(110,123,255,0.75)] active:scale-95"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/25 bg-white/10 backdrop-blur-xl px-7 py-3.5 font-mono text-[11px] uppercase tracking-widest2 text-white transition-all duration-300 will-change-transform hover:-translate-y-0.5 hover:bg-white/20 active:scale-95"
          >
            Get In Touch
          </a>
          <a
            href={`/${RESUME_FILE}`}
            download={RESUME_FILE}
            onClick={handleResumeClick}
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-xl px-7 py-3.5 font-mono text-[11px] uppercase tracking-widest2 text-white transition-all duration-300 will-change-transform hover:-translate-y-0.5 hover:bg-white/20 active:scale-95"
          >
            Resume
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-8 right-6 md:right-10 flex flex-col items-center gap-3 text-white/60"
      >
        <span className="font-mono text-[10px] tracking-widest2 uppercase [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="h-10 w-px bg-white/40" />
      </div>
    </section>
  )
}
