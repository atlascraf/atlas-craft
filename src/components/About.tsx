import { useReveal } from '../hooks/useReveal'
import './About.css'

const POINTS = [
  {
    n: '01',
    title: 'Speed',
    body: 'Fewer hand-offs means faster rounds. Ideas become drafts without waiting on a team.',
  },
  {
    n: '02',
    title: 'One coherent vision',
    body: 'The same person models, edits and builds, so your 3D, video and web feel like one brand, not three vendors.',
  },
  {
    n: '03',
    title: 'No agency overhead',
    body: 'Direct communication, a clear scope, and no layers of account managers between you and the work.',
  },
]

export default function About() {
  const leadRef = useReveal<HTMLDivElement>()
  const pointsRef = useReveal<HTMLDivElement>()

  return (
    <section className="section about" id="about">
      <div className="wrap about-grid">
        <div className="about-lead reveal" ref={leadRef}>
          <span className="label accent-amber">About the studio</span>
          <h2>
            One person. <span className="accent-amber">Studio-grade</span> output.
          </h2>
          <p className="section-sub">
            Atlas Craft is a solo, agent-run studio. Every project is designed, built and
            delivered by one person, with AI tools in the loop at every stage. You get the
            quality of a larger studio at the speed and price of a freelancer.
          </p>
        </div>

        <div className="about-points reveal" ref={pointsRef} style={{ transitionDelay: '0.1s' }}>
          {POINTS.map((p) => (
            <div className="about-point" key={p.n}>
              <span className="about-point-n accent-cyan">{p.n}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
