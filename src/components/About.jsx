import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { CornerWeb, SpiderMark } from './SpiderWeb'
import HangingProfile from './HangingProfile'
import { prefersReducedMotion } from '../utils/motion'

const PROFILE_IMAGE = '/images/somusekhar-profile.jpg'

const STACK = ['PyTorch', 'NLP', 'Computer Vision', 'RAG', 'FastAPI', 'Docker']

const PARAGRAPHS = [
  `I'm Somusekhar J, an AI/ML Engineer with a foundation in Computer Science,
  Machine Learning, and Deep Learning. My work spans neural networks,
  computer vision, NLP, Transformer-based models, and production-oriented
  AI systems — built to hold up outside a notebook.`,
  `I care about more than model accuracy. My focus is the full path from data
  to a deployed, reliable system: preprocessing, training, evaluation, and
  serving it through an API that other software can actually depend on.`,
]

export default function About() {
  const sectionRef = useRef(null)
  const webRightRef = useRef(null)
  const eyebrowRef = useRef(null)
  const headingRef = useRef(null)
  const profileRef = useRef(null)
  const paraRefs = useRef([])
  const pillRefs = useRef([])

  paraRefs.current = []
  const addPara = (el) => el && !paraRefs.current.includes(el) && paraRefs.current.push(el)

  pillRefs.current = []
  const addPill = (el) => el && !pillRefs.current.includes(el) && pillRefs.current.push(el)

  // ---------------------------------------------------------------------
  // Master entrance choreography — one timeline, one ScrollTrigger, run
  // once. Each step below overlaps the previous by a fraction of a second
  // (position params like "-=0.6") rather than queuing end-to-end; that
  // overlap is what keeps a multi-step sequence from reading as a slideshow.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const section = sectionRef.current
    const reduced = prefersReducedMotion()

    const ctx = gsap.context(() => {
      if (reduced) {
        // Skip straight to end states; no motion, no ScrollTrigger.
        gsap.set([eyebrowRef.current, headingRef.current, ...paraRefs.current, ...pillRefs.current], {
          clearProps: 'all',
          opacity: 1,
        })
        return
      }

      gsap.set(eyebrowRef.current, { clipPath: 'inset(0 0 0 0%)' })
      gsap.set(headingRef.current, { clipPath: 'inset(0% 0 0 0)' })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          once: true,
        },
      })

      // 1. Background web drops from above (elastic, handled inside CornerWeb)
      webRightRef.current?.addEntranceTo(tl, 0)

      // 2. Eyebrow: slide in from the left + opacity + clip-path reveal
      tl.fromTo(
        eyebrowRef.current,
        { x: -32, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power2.out' },
        '-=0.9'
      )

      // 3. Heading: rises from below with a clip-path reveal
      tl.fromTo(
        headingRef.current,
        { y: 70, clipPath: 'inset(100% 0 0 0)' },
        { y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power4.out' },
        '-=0.45'
      )

      // 4. Hanging profile drops from the ceiling (physics owned by the
      //    component itself; we only choose *when* it fires).
      profileRef.current?.addEntranceTo(tl, '-=0.5')

      // 5. Paragraphs reveal individually with rotationX + stagger
      tl.fromTo(
        paraRefs.current,
        { y: 40, opacity: 0, rotationX: -45, transformOrigin: 'center bottom' },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'back.out(1.6)',
        },
        '-=1.1'
      )

      // 6. Technology pills scale from 0.5 -> 1 with stagger
      tl.fromTo(
        pillRefs.current,
        { scale: 0.5, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'back.out(2.2)' },
        '-=0.5'
      )

      // ---- Ambient loops, started independently once entrance is roughly
      // clear, so they're never blocked by (or fighting) the master
      // timeline. CornerWeb spin + HangingProfile swing/glow run inside
      // those components already; only the pill float lives here.
      tl.eventCallback('onComplete', () => {
        pillRefs.current.forEach((pill, i) => {
          gsap.to(pill, {
            y: i % 2 === 0 ? -5 : 5,
            duration: 2 + Math.random() * 1.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 0.8,
          })
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden glass-section px-6 md:px-10 py-20 md:py-40 border-y border-white/5"
    >
      <div className="hidden md:block">
        <CornerWeb ref={webRightRef} corner="tr" size={220} opacity={0.18} blend="normal" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-12">
        {/* Left column — copy */}
        <div>
          <div ref={eyebrowRef} className="mb-5 flex items-center gap-2">
            <SpiderMark />
            <span className="font-mono text-xs uppercase tracking-widest2 text-blood">About Me</span>
          </div>

          <h2
            ref={headingRef}
            className="font-serif italic uppercase text-4xl md:text-5xl lg:text-6xl leading-[1.02] text-paper mb-8"
          >
            Intelligence,
            <br />
            trained layer by layer
          </h2>

          <div style={{ perspective: '1000px' }}>
            {PARAGRAPHS.map((p, i) => (
              <p
                key={i}
                ref={addPara}
                className="mb-5 max-w-lg font-body text-[15px] md:text-base leading-relaxed text-char/80"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {STACK.map((tech) => (
              <span
                key={tech}
                ref={addPill}
                className="glass rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wide text-char transition-all duration-300 will-change-transform hover:bg-gradient-to-r hover:from-blood hover:to-glass-violet hover:text-white hover:border-white/30 hover:shadow-glow"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Right column — hanging portrait */}
        <div className="relative flex justify-center md:justify-end min-h-[320px] md:min-h-[420px]">
          <HangingProfile ref={profileRef} src={PROFILE_IMAGE} alt="Portrait of Somusekhar J" />
        </div>
      </div>
    </section>
  )
}
