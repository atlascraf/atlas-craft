import { useRef } from 'react'
import type { PortfolioCategory } from '../../data/portfolio'
import { PORTFOLIO_TABS } from '../../data/portfolio'

interface Props {
  active: PortfolioCategory
  onChange: (id: PortfolioCategory) => void
}

export default function Tabs({ active, onChange }: Props) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = (index + dir + PORTFOLIO_TABS.length) % PORTFOLIO_TABS.length
    tabRefs.current[next]?.focus()
    onChange(PORTFOLIO_TABS[next].id)
  }

  return (
    <div className="tabs" role="tablist" aria-label="Portfolio category">
      {PORTFOLIO_TABS.map((tab, i) => {
        const selected = tab.id === active
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            className={`tab${selected ? ' is-active' : ''}`}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
