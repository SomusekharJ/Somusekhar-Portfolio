import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SpiderMark } from './SpiderWeb'
import { prefersReducedMotion, bindGlassCard } from '../utils/motion'

const SKILL_GROUPS = [
  {
    title: 'Languages',
    items: ['Python', 'C', 'C++', 'Java', 'SQL'],
  },
  {
    title: 'Machine Learning & Deep Learning',
    items: ['Scikit-learn', 'PyTorch', 'NumPy', 'Pandas', 'CNN', 'RNN / LSTM / GRU', 'Transformers'],
  },
  {
    title: 'NLP & Computer Vision',
    items: ['NLP', 'Computer Vision', 'OpenCV', 'MediaPipe', 'Sentiment Analysis'],
  },
  {
    title: 'Generative AI & LLMs',
    items: ['LLMs', 'RAG', 'Vector Databases', 'Prompt Engineering', 'AI Agents'],
  },
  {
    title: 'Backend & APIs',
    items: ['FastAPI', 'Flask', 'REST APIs'],
  },
  {
    title: 'Data, MLOps & Cloud',
    items: ['MySQL', 'PostgreSQL', 'Docker', 'Kubernetes', 'Git', 'CI/CD'],
  },
]

export default function Skills() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const groupRefs = useRef([])

  groupRefs.current = []
  const addGroup = (el) => el && !groupRefs.current.includes(el) && groupRefs.current.push(el)

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set([headingRef.current, ...groupRefs.current], { opacity: 1, y: 0 })
      gsap.set('.skill-pill', { opacity: 1, scale: 1 })
      return
    }

    const ctx = gsap.context((self) => {
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
        groupRefs.current,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      )

      const pills = self.selector('.skill-pill')
      gsap.fromTo(
        pills,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.015,
          ease: 'back.out(2.2)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        }
      )
    }, sectionRef)

    const cleanups = groupRefs.current.map((el) => bindGlassCard(el, { tilt: 3 }))
    return () => {
      ctx.revert()
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="relative px-6 md:px-10 py-20 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div ref={headingRef} className="mb-12 md:mb-16 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <SpiderMark />
              <span className="font-mono text-xs uppercase tracking-widest2 text-blood">
                Capabilities
              </span>
            </div>
            <h2 className="font-display uppercase text-3xl md:text-5xl leading-[0.9] text-paper">
              What I Work With
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-widest2 text-char/50 max-w-[240px]">
            From raw data to a deployed, dependable system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.title}
              ref={addGroup}
              className="glass glass-glow spotlight rounded-3xl p-6 md:p-7 transition-transform duration-300 hover:-translate-y-1 will-change-transform"
            >
              <h3 className="mb-4 pb-3 border-b border-paper/10 font-mono text-[11px] uppercase tracking-widest2 text-char/70">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="skill-pill glass rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wide text-char transition-all duration-300 will-change-transform hover:bg-gradient-to-r hover:from-blood hover:to-glass-violet hover:text-white hover:border-white/30 hover:shadow-glow"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
