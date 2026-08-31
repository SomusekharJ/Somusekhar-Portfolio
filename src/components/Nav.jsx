import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion, isFinePointer } from '../utils/motion'
import ThemeToggle from './ThemeToggle'
import { useMailConfirm } from '../context/MailConfirm'
import { useResumeConfirm } from '../context/ResumeConfirm'
import { triggerDownload } from '../utils/download'

const EMAIL = 'somusekharjulapalli@gmail.com'
const RESUME_FILE = 'Somusekhar_J_Resume.pdf'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const navRef = useRef(null)
  const glassRef = useRef(null)
  const shimmerRef = useRef(null)
  const linksRowRef = useRef(null)
  const highlightRef = useRef(null)
  const linkRefs = useRef([])
  const talkRef = useRef(null)
  const overlayRef = useRef(null)
  const [open, setOpen] = useState(false)
  const askMail = useMailConfirm()
  const askResume = useResumeConfirm()

  const handleMailClick = async (e) => {
    e.preventDefault()
    setOpen(false)
    const confirmed = await askMail(EMAIL)
    if (confirmed) window.location.href = `mailto:${EMAIL}`
  }

  const handleResumeClick = async (e) => {
    e.preventDefault()
    setOpen(false)
    const confirmed = await askResume(RESUME_FILE)
    if (confirmed) triggerDownload(`/${RESUME_FILE}`, RESUME_FILE)
  }

  linkRefs.current = []
  const addLinkRef = (el) =>
    el && !linkRefs.current.includes(el) && linkRefs.current.push(el)

  // Entrance: a real "pop" rather than a plain fade — scale up from slightly
  // small with an elastic overshoot, like the capsule condenses into place.
  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -24, opacity: 0, scale: 0.86 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.65)',
          delay: 0.2,
        }
      )
    }, navRef)

    return () => ctx.revert()
  }, [])

  // Slow ambient light sweep across the glass.
  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        shimmerRef.current,
        { xPercent: -150 },
        {
          xPercent: 250,
          duration: 3.2,
          ease: 'power1.inOut',
          repeat: -1,
          repeatDelay: 4.5,
        }
      )
    }, glassRef)

    return () => ctx.revert()
  }, [])

  // Liquid highlight between desktop nav links.
  useEffect(() => {
    if (!isFinePointer()) return

    const ease = prefersReducedMotion()
      ? 'power2.out'
      : 'elastic.out(1, 0.7)'

    const duration = prefersReducedMotion() ? 0.2 : 0.55

    const moveTo = (el) => {
      if (!el || !linksRowRef.current) return

      const parentRect = linksRowRef.current.getBoundingClientRect()
      const rect = el.getBoundingClientRect()

      gsap.to(highlightRef.current, {
        x: rect.left - parentRect.left - 10,
        width: rect.width + 20,
        opacity: 1,
        duration,
        ease,
      })
    }

    const hide = () =>
      gsap.to(highlightRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
      })

    const bound = linkRefs.current.map((el) => {
      const handler = () => moveTo(el)

      el.addEventListener('mouseenter', handler)

      return { el, handler }
    })

    linksRowRef.current?.addEventListener('mouseleave', hide)

    return () => {
      bound.forEach(({ el, handler }) =>
        el.removeEventListener('mouseenter', handler)
      )

      linksRowRef.current?.removeEventListener('mouseleave', hide)
    }
  }, [])

  // Elastic pop on the "Let's talk" pill.
  useEffect(() => {
    const el = talkRef.current

    if (!el || !isFinePointer() || prefersReducedMotion()) return

    const grow = () =>
      gsap.to(el, {
        scale: 1.08,
        duration: 0.45,
        ease: 'elastic.out(1, 0.5)',
      })

    const shrink = () =>
      gsap.to(el, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      })

    el.addEventListener('mouseenter', grow)
    el.addEventListener('mouseleave', shrink)

    return () => {
      el.removeEventListener('mouseenter', grow)
      el.removeEventListener('mouseleave', shrink)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    if (!overlayRef.current) return

    if (prefersReducedMotion()) {
      gsap.set(overlayRef.current, {
        display: open ? 'flex' : 'none',
        opacity: 1,
      })

      return
    }

    if (open) {
      gsap.set(overlayRef.current, {
        display: 'flex',
      })

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        }
      )

      gsap.fromTo(
        overlayRef.current.querySelectorAll('[data-menu-item]'),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          delay: 0.1,
          ease: 'power3.out',
        }
      )
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () =>
          gsap.set(overlayRef.current, {
            display: 'none',
          }),
      })
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] md:w-fit md:max-w-[calc(100vw-5rem)]"
      >
        <div
          ref={glassRef}
          className="relative flex items-center justify-between md:justify-start gap-2 md:gap-6 lg:gap-7 2xl:gap-8 overflow-hidden rounded-full border border-white/15 bg-[#0b0c14]/55 px-5 md:px-6 lg:px-7 py-1.5 md:py-[clamp(0.3rem,0.9vh,0.5rem)] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl backdrop-saturate-150"
        >
          {/* specular highlight along the top edge */}
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* soft inner sheen */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-black/10" />

          {/* slow light sweep */}
          <div
            ref={shimmerRef}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
          />

          {/* Logo + mobile title */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <a
              href="#top"
              className="relative shrink-0 font-display text-sm tracking-tight text-white"
            >
              S.J<span className="text-blood-light">.</span>
            </a>

            <span className="relative flex min-w-0 flex-1 items-center gap-2 font-mono text-[clamp(9px,2.6vw,11px)] uppercase tracking-[0.12em] text-white md:hidden">
              <span className="shrink-0 text-white/25">•</span>

              <span className="whitespace-nowrap">
                AI/ML Engineer
              </span>
            </span>
          </div>

          {/* Desktop navigation */}
          <nav
            ref={linksRowRef}
            className="relative hidden md:flex items-center gap-[clamp(1rem,2vw,1.75rem)] font-mono text-[clamp(0.6875rem,0.9vw,0.8125rem)] uppercase tracking-widest2 text-white"
          >
            <span
              ref={highlightRef}
              className="pointer-events-none absolute inset-y-[-8px] left-0 rounded-full bg-white/10 border border-white/10 opacity-0"
              style={{ width: 0 }}
            />

            {LINKS.map((l) => (
              <a
                key={l.label}
                ref={addLinkRef}
                href={l.href}
                className="relative z-10"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop Let's Talk */}
          <a
            ref={talkRef}
            href={`mailto:${EMAIL}`}
            onClick={handleMailClick}
            className="relative hidden md:inline-block shrink-0 whitespace-nowrap font-mono text-[clamp(0.6875rem,0.9vw,0.8125rem)] uppercase tracking-widest2 text-white border border-white/30 rounded-full px-[clamp(0.875rem,1.6vw,1.5rem)] py-[clamp(0.35rem,0.7vw,0.5rem)] will-change-transform transition-transform duration-150 active:scale-95 hover:border-white hover:bg-white/10"
          >
            Let's talk
          </a>

          {/* Desktop theme toggle */}
          <ThemeToggle className="hidden md:flex" />

          {/* Mobile controls */}
          <div className="flex md:hidden shrink-0 items-center gap-3">
            <ThemeToggle />

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="relative flex h-8 w-8 flex-col items-center justify-center gap-[5px] transition-transform duration-150 active:scale-90"
            >
              <span
                className={`block h-px w-5 bg-white transition-transform duration-300 ${
                  open ? 'translate-y-[6px] rotate-45' : ''
                }`}
              />

              <span
                className={`block h-px w-5 bg-white transition-opacity duration-300 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />

              <span
                className={`block h-px w-5 bg-white transition-transform duration-300 ${
                  open ? '-translate-y-[6px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu with a couple of soft blurred glow blobs for atmosphere */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 hidden flex-col items-center justify-center gap-10 overflow-hidden bg-[#0b0c14]/95 backdrop-blur-2xl md:hidden"
        style={{ display: 'none' }}
      >
        <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blood/25 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-blood/15 blur-[90px]" />

        <nav className="relative flex flex-col items-center gap-6">
          {LINKS.map((l) => (
            <a
              key={l.label}
              data-menu-item
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display uppercase text-4xl text-white transition-colors duration-300 hover:text-blood-light"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div
          data-menu-item
          className="relative flex flex-col items-center gap-3 w-full max-w-[260px]"
        >
          <a
            href={`mailto:${EMAIL}`}
            onClick={handleMailClick}
            className="w-full text-center rounded-full bg-blood px-7 py-3 font-mono text-[11px] uppercase tracking-widest2 text-white transition-transform duration-150 active:scale-95"
          >
            Let's Talk
          </a>

          <a
            href={`/${RESUME_FILE}`}
            download={RESUME_FILE}
            onClick={handleResumeClick}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-xl px-7 py-3 font-mono text-[11px] uppercase tracking-widest2 text-white transition-all duration-150 hover:bg-white/20 active:scale-95"
          >
            Download Resume
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </>
  )
}