import { useEffect, useRef } from 'react'
import './CustomCursor.css'

const HOVER_SELECTOR = 'a, button, .pill, .work, .card'
const RING_LERP = 0.16

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return

    document.documentElement.classList.add('has-custom-cursor')

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let rx = tx
    let ry = ty
    let raf = 0

    function onMove(e: PointerEvent) {
      tx = e.clientX
      ty = e.clientY
      dot!.style.transform = `translate(${tx}px, ${ty}px)`
    }

    function onOver(e: PointerEvent) {
      const target = e.target as Element | null
      ring!.classList.toggle('is-active', !!target?.closest(HOVER_SELECTOR))
    }

    function tick() {
      rx += (tx - rx) * RING_LERP
      ry += (ty - ry) * RING_LERP
      ring!.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
