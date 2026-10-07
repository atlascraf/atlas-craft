export interface HeroFrameMap {
  srcW: number
  srcH: number
  faceX: number
  faceY: number
  ring: string[]
  ringStartAngle: number
  ringEndAngle: number
  center: string
}

/** Normalize an angle in radians to (-PI, PI]. */
export function wrap(angle: number): number {
  let a = angle % (Math.PI * 2)
  if (a <= -Math.PI) a += Math.PI * 2
  if (a > Math.PI) a -= Math.PI * 2
  return a
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Picks the ring (or bridge) frame file for a given angle, in degrees,
 * using the atan2(dy, dx) screen convention: 0 = cursor to the right of the
 * face, +90 = below, -90 = above, +-180 = left.
 *
 * The source footage is one continuous head-turn sweep covering
 * [ringStartAngle, ringEndAngle] (real recorded motion, piecewise-linear
 * indexed). The remaining arc has no footage, so this nearest-snaps to
 * whichever real endpoint (ring start or ring end) is angularly closer,
 * instead of fabricating or reusing a mid-ring frame out of context.
 */
export function pickRingFile(angleDeg: number, map: HeroFrameMap): string {
  const { ring, ringStartAngle, ringEndAngle } = map
  if (angleDeg >= ringStartAngle && angleDeg <= ringEndAngle) {
    const t = (angleDeg - ringStartAngle) / (ringEndAngle - ringStartAngle)
    const idx = clamp(Math.round(t * (ring.length - 1)), 0, ring.length - 1)
    return ring[idx]
  }
  // Uncovered bridge arc: (ringEndAngle - 360, ringStartAngle), e.g. (-180, -90).
  const bridgeMid = (ringStartAngle + (ringEndAngle - 360)) / 2
  return angleDeg <= bridgeMid ? ring[ring.length - 1] : ring[0]
}

export interface TrackState {
  ang: number
  wasDead: boolean
  lastT: number
}

export function createTrackState(): TrackState {
  return { ang: -Math.PI / 2, wasDead: true, lastT: 0 }
}

const GAIN_X = 1.3
const TAU_MS = 60
const DEAD_IN = 0.045
const DEAD_OUT = 0.06

export interface TrackResult {
  file: string
  isCenter: boolean
}

/**
 * Advances the smoothed tracking angle by dt and resolves which frame
 * should be shown. Pure except for mutating the passed-in TrackState.
 */
export function trackStep(
  state: TrackState,
  dt: number,
  dx: number,
  dy: number,
  unit: number,
  hasPointer: boolean,
  reduceMotion: boolean,
  map: HeroFrameMap,
): TrackResult {
  const dist = Math.hypot(dx, dy)

  if (hasPointer && !reduceMotion) {
    const targetAngle = Math.atan2(dy, dx * GAIN_X)
    state.ang = wrap(state.ang + wrap(targetAngle - state.ang) * (1 - Math.exp(-dt / TAU_MS)))
  }

  if (!hasPointer || reduceMotion) {
    state.wasDead = true
  } else if (state.wasDead && dist > unit * DEAD_OUT) {
    state.wasDead = false
  } else if (!state.wasDead && dist < unit * DEAD_IN) {
    state.wasDead = true
  }

  if (state.wasDead) {
    return { file: map.center, isCenter: true }
  }

  const angleDeg = (state.ang * 180) / Math.PI
  return { file: pickRingFile(angleDeg, map), isCenter: false }
}
