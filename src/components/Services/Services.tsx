import ServiceCard from './ServiceCard'
import { Icon3D, IconVideo, IconWeb } from './icons'
import './Services.css'

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="section-head">
          <span className="label">Services</span>
          <h2>
            Three disciplines. <span className="accent-amber">One</span> studio.
          </h2>
          <p className="section-sub">
            3D, AI video and web, delivered by the same person from first sketch to final
            export. No hand-offs, no mismatched styles.
          </p>
        </div>

        <div className="service-grid">
          <ServiceCard
            icon={<Icon3D />}
            accent="amber"
            number="01/03"
            title="3D Modeling &amp; Rendering"
            description="Product visuals, characters and environments, modeled, lit and rendered to a cinematic standard."
            bullets={['Product and packaging renders', 'Stylized characters and portraits', 'Turntables and short animations']}
            delay={0}
          />
          <ServiceCard
            icon={<IconVideo />}
            accent="cyan"
            number="02/03"
            title="AI-generated Ad Video"
            description="Short-form ads and product spots built with AI video pipelines, then directed and finished by hand."
            bullets={['Social and performance ads', 'Product and brand spots', 'Concept to final cut']}
            delay={0.08}
          />
          <ServiceCard
            icon={<IconWeb />}
            accent="muted"
            number="03/03"
            title="Website Design &amp; Build"
            description="Fast, custom-coded websites with interactive details, designed and shipped by the same person."
            bullets={['Portfolio and brand sites', 'Interactive hero experiences', 'Responsive, performance-minded builds']}
            delay={0.16}
          />
        </div>
      </div>
    </section>
  )
}
