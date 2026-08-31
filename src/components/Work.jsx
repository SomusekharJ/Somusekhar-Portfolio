import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion, bindGlassCard } from '../utils/motion'

const PROJECTS = [
  {
    index: '01',
    name: 'MediRoute AI',
    result: '2nd Prize · Astranova2k26',
    description:
      'An AI-powered emergency healthcare system for triage and ambulance routing — prioritizes patients and optimizes response paths in real time, aimed at cutting the minutes that matter most in an emergency.',
    tags: ['PyTorch', 'FastAPI', 'MySQL'],
  },
  {
    index: '02',
    name: 'Indian Sign Language Recognition',
    result: '92% accuracy',
    description:
      'A computer vision system that classifies hand signs from live video, tracking hand landmarks and feeding them into a classical ML model for real-time gesture recognition.',
    tags: ['MediaPipe', 'OpenCV', 'Random Forest'],
  },
  {
    index: '03',
    name: 'EvalVithwaan',
    result: 'OCR + BERT pipeline',
    description:
      'An automatic paper evaluation system that reads handwritten answer scripts via OCR, then scores them against a reference answer using a BERT-based semantic similarity model, served through a Flask backend.',
    tags: ['OCR', 'BERT', 'Flask'],
  },
  {
    index: '04',
    name: 'Sentiment Engine',
    result: '81% accuracy',
    description:
      'A recurrent-network sentiment classifier trained on IMDB reviews, built and iteratively debugged from a vanilla RNN baseline — fixing data leakage and truncation issues along the way.',
    tags: ['PyTorch', 'RNN / LSTM / GRU'],
  },
  {
    index: '05',
    name: 'CNN vs RNN',
    result: 'Comparative study',
    description:
      'A side-by-side deep learning comparison on handwritten digit classification — training equivalent CNN and RNN architectures on the same data to study how each learns spatial vs. sequential structure.',
    tags: ['PyTorch', 'CNN', 'RNN'],
  },
]

export default function Work() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardRefs = useRef([])
  const ctaRef = useRef(null)

  cardRefs.current = []
  const addCard = (el) => el && !cardRefs.current.includes(el) && cardRefs.current.push(el)

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set([headingRef.current, ...cardRefs.current, ctaRef.current], { opacity: 1, y: 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        }
      )

      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: cardRefs.current[0], start: 'top 88%', once: true },
        }
      )

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 92%', once: true },
        }
      )
    }, sectionRef)

    const cleanups = cardRefs.current.map((el) => bindGlassCard(el))
    return () => {
      ctx.revert()
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <section id="work" ref={sectionRef} className="relative px-6 md:px-10 py-20 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div ref={headingRef} className="mb-10 md:mb-16 flex items-end justify-between gap-6 flex-wrap">
          <h2 className="font-display uppercase text-3xl md:text-5xl leading-[0.9] text-paper">
            Selected
            <br />
            Work
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-widest2 text-char/50 max-w-[220px]">
            Five systems I've trained, evaluated, and shipped end to end.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10">
          {PROJECTS.map((p) => (
            <article
              key={p.name}
              ref={addCard}
              className="group glass glass-glow spotlight rounded-3xl p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 will-change-transform"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className="font-mono text-xs text-char/35">{p.index}</span>
                <span className="rounded-full border border-blood/25 bg-blood/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-blood">
                  {p.result}
                </span>
              </div>

              <h3 className="font-display uppercase text-2xl md:text-3xl text-paper mb-3 transition-colors duration-300 group-hover:text-blood-light">
                {p.name}
              </h3>

              <p className="font-body text-[14px] md:text-[15px] leading-relaxed text-char mb-6">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-paper/10 bg-paper/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-char"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}

          {/* Closing card pointing to GitHub — honest stand-in until individual repo links are wired up */}
          <a
            ref={addCard}
            href="https://github.com/SomusekharJ"
            target="_blank"
            rel="noopener noreferrer"
            className="group glass spotlight rounded-3xl p-7 md:p-8 flex flex-col items-start justify-between gap-6 border-dashed transition-all duration-300 hover:border-blood/50 hover:-translate-y-1 will-change-transform"
          >
            <span className="font-mono text-xs text-char/60">06</span>
            <div>
              <h3 className="font-display uppercase text-2xl md:text-3xl text-paper mb-2 transition-colors duration-300 group-hover:text-blood-light">
                More on GitHub
              </h3>
              <p className="font-body text-[14px] leading-relaxed text-char">
                Full commit history, in-progress work, and everything not featured here.
              </p>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-widest2 text-blood transition-transform duration-300 group-hover:translate-x-1">
              github.com/SomusekharJ →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
