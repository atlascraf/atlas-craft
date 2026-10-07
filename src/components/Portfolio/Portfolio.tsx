import { useState } from 'react'
import Tabs from './Tabs'
import WorkCard from './WorkCard'
import { PORTFOLIO, type PortfolioCategory } from '../../data/portfolio'
import { CONTACT_URL } from '../../config'
import './Portfolio.css'

export default function Portfolio() {
  const [active, setActive] = useState<PortfolioCategory>('3d')
  const href = CONTACT_URL || '#contact'

  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="section-head cyan">
          <span className="label accent-cyan">Portfolio</span>
          <h2>
            Selected <span className="accent-cyan">work</span>
          </h2>
        </div>

        <Tabs active={active} onChange={setActive} />

        <div
          key={active}
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          className="portfolio-grid swap"
        >
          {PORTFOLIO[active].map((item) => (
            <WorkCard key={item.title} item={item} category={active} />
          ))}
        </div>

        <p className="portfolio-cta">
          <a href={href} className="accent-cyan">
            Have something similar in mind? Start a project →
          </a>
        </p>
      </div>
    </section>
  )
}
