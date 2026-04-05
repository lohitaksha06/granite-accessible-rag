import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

const WAVE_WINDOW_MS = 1200
const MIN_WAVE_POINTS = 8
const MIN_WAVE_RANGE = 0.12
const DIRECTION_EPSILON = 0.005
const MIN_DIRECTION_FLIPS = 2
const WAVE_COOLDOWN_MS = 2500

function countDirectionFlips(points) {
  let lastDirection = 0
  let flips = 0

  for (let i = 1; i < points.length; i += 1) {
    const delta = points[i].x - points[i - 1].x
    const direction = delta > DIRECTION_EPSILON ? 1 : delta < -DIRECTION_EPSILON ? -1 : 0

    if (direction !== 0) {
      if (lastDirection !== 0 && direction !== lastDirection) {
        flips += 1
      }
      lastDirection = direction
    }
  }

  return flips
}

function isWaveGesture(points) {
  if (points.length < MIN_WAVE_POINTS) return false

  const xs = points.map((p) => p.x)
  const range = Math.max(...xs) - Math.min(...xs)
  if (range < MIN_WAVE_RANGE) return false

  const flips = countDirectionFlips(points)
  return flips >= MIN_DIRECTION_FLIPS
}

export async function createHandWaveDetector({ video, onWave, onError }) {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm'
  )

  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
    },
    runningMode: 'VIDEO',
    numHands: 1,
    minHandDetectionConfidence: 0.6,
    minHandPresenceConfidence: 0.55,
    minTrackingConfidence: 0.55
  })

  let running = true
  let rafId = 0
  let lastWaveAt = 0
  const history = []

  const loop = () => {
    if (!running) return

    try {
      if (video.readyState >= 2) {
        const now = performance.now()
        const result = handLandmarker.detectForVideo(video, now)
        const hand = result?.landmarks?.[0]

        if (hand?.[0]) {
          history.push({ x: hand[0].x, time: now })

          while (history.length > 0 && now - history[0].time > WAVE_WINDOW_MS) {
            history.shift()
          }

          if (now - lastWaveAt > WAVE_COOLDOWN_MS && isWaveGesture(history)) {
            lastWaveAt = now
            history.length = 0
            onWave?.()
          }
        }
      }
    } catch (err) {
      onError?.(err)
    }

    rafId = requestAnimationFrame(loop)
  }

  rafId = requestAnimationFrame(loop)

  return {
    stop() {
      running = false
      cancelAnimationFrame(rafId)
      handLandmarker.close()
    }
  }
}
