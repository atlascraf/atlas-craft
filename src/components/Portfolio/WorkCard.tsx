import type { PortfolioCategory, PortfolioItem } from '../../data/portfolio'
import { Icon3D, IconVideo, IconWeb } from '../Services/icons'
import { CONTACT_URL } from '../../config'

interface Props {
  item: PortfolioItem
  category: PortfolioCategory
}

const CATEGORY_ICON: Record<PortfolioCategory, React.ReactNode> = {
  '3d': <Icon3D />,
  video: <IconVideo />,
  web: <IconWeb />,
}

export default function WorkCard({ item, category }: Props) {
  const href = CONTACT_URL || '#contact'
  const base = import.meta.env.BASE_URL

  return (
    <a className={`card work accent-${category}`} href={href}>
      <div className="work-media">
        {item.img ? (
          <img src={`${base}${item.img}`} alt="" loading="lazy" />
        ) : (
          <div className="work-placeholder">
            <span className="work-placeholder-icon">{CATEGORY_ICON[category]}</span>
            <span className="work-placeholder-tag">Placeholder</span>
          </div>
        )}
        <span className="work-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
      <h3 className="work-title">{item.title}</h3>
      <p className="work-meta label">{item.meta}</p>
    </a>
  )
}
