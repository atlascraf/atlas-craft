import './Header.css'

interface Props {
  overLight: boolean
}

export default function Header({ overLight }: Props) {
  return (
    <header className={`site-header${overLight ? ' over-light' : ''}`}>
      <nav className="pill" aria-label="Primary">
        <a href="#work">WORK</a>
        <a href="#about">ABOUT</a>
        <a href="#contact">CONTACT</a>
      </nav>
    </header>
  )
}
