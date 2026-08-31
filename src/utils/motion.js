/**
 * Shared helpers so every animated component makes the same accessibility
 * and performance decisions instead of re-deriving them ad hoc.
 */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const isDesktopViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches

/**
 * bindGlassCard(el)
 * -----------------
 * Wires cursor-tracked spotlight (--mx/--my CSS vars for the .spotlight
 * glare) plus a subtle 3D tilt-toward-cursor on a glass card. Desktop /
 * fine-pointer only, reduced-motion-aware. Returns a cleanup function.
 */
export const bindGlassCard = (el, { tilt = 6 } = {}) => {
  if (!el || !isFinePointer() || prefersReducedMotion()) return () => {}

  const handleMove = (e) => {
    const rect = el.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${px}%`)
    el.style.setProperty('--my', `${py}%`)
    const rx = ((py - 50) / 50) * -tilt
    const ry = ((px - 50) / 50) * tilt
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }
  const handleLeave = () => {
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
  }

  el.addEventListener('mousemove', handleMove)
  el.addEventListener('mouseleave', handleLeave)
  return () => {
    el.removeEventListener('mousemove', handleMove)
    el.removeEventListener('mouseleave', handleLeave)
  }
}
