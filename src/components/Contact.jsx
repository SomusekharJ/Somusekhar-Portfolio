import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { CornerWeb } from './SpiderWeb'
import { prefersReducedMotion } from '../utils/motion'
import { useMailConfirm } from '../context/MailConfirm'

const EMAIL = 'somusekharjulapalli@gmail.com'

export default function Contact() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const askMail = useMailConfirm()

  const handleMailClick = async (e) => {
    e.preventDefault()
    const confirmed = await askMail(EMAIL)
    if (confirmed) window.location.href = `mailto:${EMAIL}`
  }

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(headingRef.current, { opacity: 1, y: 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#05070f] px-6 md:px-10 py-20 md:py-40 border-t border-white/5"
    >
      {/* multiply disappears against black, so dark sections use normal blend */}
      {/* both corner webs hidden on small phones — at narrow widths their
          clamped min-size overlaps the centered heading text */}
      <div className="hidden sm:block">
        <CornerWeb corner="tl" size={180} opacity={0.14} blend="normal" />
      </div>
      <div className="hidden sm:block">
        <CornerWeb corner="tr" size={200} opacity={0.12} blend="normal" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-white/50 mb-6">
          Currently open to new work
        </p>
        <h2
          ref={headingRef}
          className="font-display uppercase leading-[0.9] text-[10.5vw] sm:text-[9vw] md:text-7xl text-white mb-10"
        >
          Let's build
          <br />
          <span className="text-blood-light">
            intelligent<span className="hidden sm:inline"> </span>
            <br className="sm:hidden" />
            systems.
          </span>
        </h2>
        <a
          href={`mailto:${EMAIL}`}
          onClick={handleMailClick}
          className="glass-shimmer inline-block max-w-[calc(100vw-3rem)] rounded-full bg-gradient-to-r from-blood to-glass-violet border border-white/20 px-5 sm:px-8 py-3.5 sm:py-4 font-mono text-[9px] sm:text-[11px] uppercase tracking-normal sm:tracking-widest2 text-white shadow-glow transition-all duration-300 will-change-transform hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-10px_rgba(110,123,255,0.75)] active:scale-95"
        >
          {EMAIL}
        </a>
      </div>

      <footer className="relative z-10 mt-24 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 font-mono text-[10px] uppercase tracking-widest2 text-white/40">
        <span>© {new Date().getFullYear()} Somusekhar J</span>
        <div className="flex gap-6">
          <a
            href="https://github.com/SomusekharJ"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/somusekhar-j/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a href="/Somusekhar_J_Resume.pdf" download="Somusekhar_J_Resume.pdf" className="hover:text-white transition-colors">
            Resume
          </a>
        </div>
      </footer>
    </section>
  )
}