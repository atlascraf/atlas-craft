import type { ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

interface Props {
  icon: ReactNode
  accent: 'amber' | 'cyan' | 'muted'
  number: string
  title: string
  description: string
  bullets: string[]
  delay: number
}

export default function ServiceCard({ icon, accent, number, title, description, bullets, delay }: Props) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <article
      className={`card service-card accent-${accent} reveal`}
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="service-icon">{icon}</div>
      <span className="service-number label">{number}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <hr className="service-divider" />
      <ul className="service-bullets">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </article>
  )
}
