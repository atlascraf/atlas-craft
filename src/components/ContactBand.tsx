import { useReveal } from '../hooks/useReveal'
import { CONTACT_URL } from '../config'
import './ContactBand.css'

export default function ContactBand() {
  const ref = useReveal<HTMLDivElement>()
  const href = CONTACT_URL || '#contact'

  return (
    <section className="section contact-band" id="contact">
      <div className="contact-glow contact-glow-amber" aria-hidden="true" />
      <div className="contact-glow contact-glow-cyan" aria-hidden="true" />
      <div className="wrap">
        <div className="contact-inner reveal" ref={ref}>
          <span className="label accent-amber">Contact</span>
          <h2>
            Have a project in <span className="accent-amber">mind</span>?
          </h2>
          <p className="section-sub">
            Send a short brief: what you&rsquo;re making, who it&rsquo;s for and when you
            need it. You&rsquo;ll get a clear scope and a straight quote.
          </p>
          <div className="contact-actions">
            <a className="btn btn-amber" href={href}>
              Start a project →
            </a>
            <a className="btn btn-outline" href="#services">
              View services
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
