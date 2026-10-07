import { useRef } from 'react'
import HeroCanvas from './HeroCanvas'
import { RESUME_URL } from '../../config'
import './Hero.css'

interface Props {
  heroRef: React.RefObject<HTMLElement | null>
  onReady: () => void
}

export default function Hero({ heroRef, onReady }: Props) {
  const internalRef = useRef<HTMLElement | null>(null)

  return (
    <section
      id="top"
      className="hero"
      ref={(el) => {
        internalRef.current = el
        ;(heroRef as React.MutableRefObject<HTMLElement | null>).current = el
      }}
    >
      <HeroCanvas onReady={onReady} />
      <div className="hero-overlay" />
      <div className="hero-text">
        <p className="hero-greet">Hi, I&rsquo;m</p>
        <h1 className="hero-name">Mohammad</h1>
        <p className="hero-bio">
          Creative designer working across 3D, video and AI — from graphic design to
          cinematic renders and motion, crafting visuals that feel alive.
        </p>
        <div className="hero-actions">
          <a className="hero-btn hero-btn-solid" href={RESUME_URL || '#'}>
            Resume <span aria-hidden="true">↗</span>
          </a>
          <a className="hero-btn hero-btn-glass" href="#contact">
            Let&rsquo;s Talk
          </a>
        </div>
      </div>
    </section>
  )
}
