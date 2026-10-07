export type PortfolioCategory = '3d' | 'video' | 'web'

export interface PortfolioItem {
  title: string
  meta: string
  img?: string
  href?: string
  video?: string
}

export const PORTFOLIO: Record<PortfolioCategory, PortfolioItem[]> = {
  '3d': [
    { title: 'Cursor-tracking character', meta: 'Stylized 3D character', img: 'character.png' },
    { title: 'Product render', meta: '3D · Add your project' },
    { title: 'Environment study', meta: '3D · Add your project' },
  ],
  video: [
    { title: 'Product spot', meta: 'AI video · Add your project' },
    { title: 'Social ad', meta: 'AI video · Add your project' },
    { title: 'Brand film', meta: 'AI video · Add your project' },
  ],
  web: [
    {
      title: 'Interactive cursor-tracking hero',
      meta: 'Web · Interaction design',
      img: 'character.png',
    },
    { title: 'Brand website', meta: 'Web · Add your project' },
    { title: 'Landing page', meta: 'Web · Add your project' },
  ],
}

export const PORTFOLIO_TABS: { id: PortfolioCategory; label: string }[] = [
  { id: '3d', label: '3D' },
  { id: 'video', label: 'Video' },
  { id: 'web', label: 'Web' },
]
