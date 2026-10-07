import { useEffect, useState } from 'react'

/**
 * True once the page has scrolled past (heroHeight - 70px). Used to flip the
 * header into its "over-light" treatment so white labels stay readable when
 * a light-theme section sits under the floating pill.
 */
export function useScrolledPastHero(heroRef: React.RefObject<HTMLElement | null>) {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    let ticking = false

    const check = () => {
      ticking = false
      const heroHeight = hero.offsetHeight
      setPast(window.scrollY > heroHeight - 70)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(check)
    }

    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [heroRef])

  return past
}
