import { useRef, useState } from 'react'
import Loader from './components/Loader'
import Header from './components/Header'
import Hero from './components/Hero/Hero'
import Services from './components/Services/Services'
import Portfolio from './components/Portfolio/Portfolio'
import About from './components/About'
import ContactBand from './components/ContactBand'
import Footer from './components/Footer'
import ThemeToggle from './components/ThemeToggle'
import CustomCursor from './components/CustomCursor'
import { useTheme } from './hooks/useTheme'
import { useScrolledPastHero } from './hooks/useScrolledPastHero'

export default function App() {
  const { theme, toggle } = useTheme()
  const heroRef = useRef<HTMLElement | null>(null)
  const scrolledPastHero = useScrolledPastHero(heroRef)
  const [ready, setReady] = useState(false)

  const overLight = theme === 'light' && scrolledPastHero

  return (
    <>
      <Loader hidden={ready} />
      <Header overLight={overLight} />
      <Hero heroRef={heroRef} onReady={() => setReady(true)} />
      <main>
        <Services />
        <Portfolio />
        <About />
        <ContactBand />
      </main>
      <Footer />
      <ThemeToggle theme={theme} onToggle={toggle} />
      <CustomCursor />
    </>
  )
}
