import Logo from './Logo'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <Logo />
            <span className="footer-wordmark">
              ATLAS <b className="accent-amber">CRAFT</b>
            </span>
          </div>
          <p className="footer-tagline">Websites / AI Video / A Brighter Tomorrow</p>
          <p className="footer-small">A solo studio, run with AI. Built for brands and founders anywhere.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <a href="#services">Services</a>
          <a href="#work">Portfolio</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      <div className="wrap footer-bottom">
        <p>&copy; {year} Atlas Craft. All rights reserved.</p>
        <p>Designed and built by one person.</p>
      </div>
    </footer>
  )
}
