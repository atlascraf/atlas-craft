import { useEffect, useRef } from 'react'
import { clamp, createTrackState, trackStep, type HeroFrameMap } from './engine'

interface Props {
  onReady: () => void
}

interface LoadedFrames {
  map: HeroFrameMap
  images: Map<string, HTMLImageElement>
}

async function loadFrames(base: string): Promise<LoadedFrames> {
  const res = await fetch(`${base}frames/map.json`)
  const map = (await res.json()) as HeroFrameMap

  const files = [...map.ring, map.center]
  const images = new Map<string, HTMLImageElement>()

  await Promise.all(
    files.map(async (file) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = `${base}frames/${file}`
      try {
        if (img.decode) await img.decode()
        else await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        images.set(file, img)
      } catch {
        images.set(file, img) // kept even if decode failed; draw will just no-op
      }
    }),
  )

  // Fill any failed/missing slot from its nearest loaded ring neighbour.
  for (let i = 0; i < map.ring.length; i++) {
    const file = map.ring[i]
    const img = images.get(file)
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let d = 1; d < map.ring.length; d++) {
        const prev = images.get(map.ring[clamp(i - d, 0, map.ring.length - 1)])
        const next = images.get(map.ring[clamp(i + d, 0, map.ring.length - 1)])
        const fallback = prev && prev.naturalWidth > 0 ? prev : next
        if (fallback && fallback.naturalWidth > 0) {
          images.set(file, fallback)
          break
        }
      }
    }
  }

  return { map, images }
}

export default function HeroCanvas({ onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const base = import.meta.env.BASE_URL
    const hero = canvas.closest('#top') as HTMLElement | null

    let raf = 0
    let cancelled = false
    let loaded: LoadedFrames | null = null

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0
    let H = 0
    let scale = 1
    let ox = 0
    let oy = 0
    let portrait = false

    let heroVisible = true
    let dirty = true
    let shownFile: string | null = null

    const track = createTrackState()
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let hasPointer = false

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const layout = () => {
      const rect = hero ? hero.getBoundingClientRect() : canvas.getBoundingClientRect()
      W = Math.max(1, Math.round(rect.width))
      H = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = W * dpr
      canvas.height = H * dpr

      const map = loaded?.map
      const srcW = map?.srcW ?? 1280
      const srcH = map?.srcH ?? 720

      portrait = W / H < 0.9
      document.body.classList.toggle('portrait', portrait)

      scale = Math.max(W / srcW, H / srcH)
      ox = (W - srcW * scale) / 2

      const faceY = map?.faceY ?? 0.4
      const minOy = H - srcH * scale
      if (portrait) {
        const desired = 0.32 * H - srcH * scale * faceY
        oy = clamp(desired, minOy, 0)
      } else {
        oy = minOy / 2
      }

      dirty = true
    }

    const draw = () => {
      if (!loaded || !shownFile) return
      const img = loaded.images.get(shownFile)
      const map = loaded.map
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.imageSmoothingEnabled = true
      ;(ctx as unknown as { imageSmoothingQuality: string }).imageSmoothingQuality = 'high'
      ctx!.fillStyle = '#09101c'
      ctx!.fillRect(0, 0, W, H)
      if (img && img.naturalWidth > 0) {
        ctx!.drawImage(img, ox, oy, map.srcW * scale, map.srcH * scale)
      }
    }

    const tick = (now: number) => {
      if (cancelled) return
      raf = requestAnimationFrame(tick)
      if (!loaded) return

      if (!heroVisible) {
        track.lastT = now
        return
      }

      const dt = Math.min(now - track.lastT || 16, 64)
      track.lastT = now

      const rect = hero ? hero.getBoundingClientRect() : canvas.getBoundingClientRect()
      const map = loaded.map
      const faceX = rect.left + ox + map.srcW * scale * map.faceX
      const faceY = rect.top + oy + map.srcH * scale * map.faceY
      const dx = mx - faceX
      const dy = my - faceY
      const unit = Math.min(W, H)

      const result = trackStep(track, dt, dx, dy, unit, hasPointer, reduceMotionQuery.matches, map)

      if (result.file !== shownFile) {
        shownFile = result.file
        dirty = true
      }

      if (dirty) {
        draw()
        dirty = false
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      hasPointer = true
    }

    const onPointerLeave = () => {
      hasPointer = false
    }

    const resizeObserver = new ResizeObserver(() => layout())
    if (hero) resizeObserver.observe(hero)
    window.addEventListener('resize', layout)

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          heroVisible = entry.isIntersecting
          if (heroVisible) {
            track.lastT = performance.now()
            dirty = true
          }
        }
      },
      { threshold: 0 },
    )
    if (hero) intersectionObserver.observe(hero)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    layout()
    loadFrames(base).then((result) => {
      if (cancelled) return
      loaded = result
      layout()
      onReadyRef.current()
    })

    raf = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('resize', layout)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      document.body.classList.remove('portrait')
    }
  }, [])

  return <canvas ref={canvasRef} id="stage" aria-hidden="true" />
}
