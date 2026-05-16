import { FilesetResolver, HandLandmarker, GestureRecognizer } from '@mediapipe/tasks-vision'

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

export async function createHandWaveDetector({ video, onWave, onShape, onError }) {
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
  let lastActionAt = 0
  const history = []

  function detectShape(points) {
    if (points.length < 15) return null;

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;
    const area = width * height;
    
    if (width < 0.15 || height < 0.15 || area < 0.03) return null; // shape too small

    const first = points[0];
    const last = points[points.length - 1];
    const distance = Math.sqrt((first.x - last.x)**2 + (first.y - last.y)**2);
    const maxDim = Math.max(width, height);
    if (distance > maxDim * 0.4) {
      return null; // Not a closed shape
    }

    let polyArea = 0;
    for (let i = 0; i < points.length - 1; i++) {
      polyArea += points[i].x * points[i+1].y - points[i+1].x * points[i].y;
    }
    polyArea += points[points.length-1].x * points[0].y - points[0].x * points[points.length-1].y;
    polyArea = Math.abs(polyArea) / 2;

    const fillRatio = polyArea / area;

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const radiuses = points.map(p => Math.sqrt((p.x - cx)**2 + (p.y - cy)**2));
    const avgRadius = radiuses.reduce((a, b) => a + b, 0) / radiuses.length;
    const varRadius = radiuses.reduce((a, b) => a + Math.pow(b - avgRadius, 2), 0) / radiuses.length;
    const cv = Math.sqrt(varRadius) / avgRadius;

    if (cv < 0.15 && fillRatio > 0.65) return 'circle';
    if (fillRatio > 0.35 && fillRatio < 0.6) return 'triangle';
    if (fillRatio >= 0.6 && cv >= 0.15) return 'square';
    return null;
  }

  const loop = () => {
    if (!running) return

    try {
      if (video.readyState >= 2) {
        const now = performance.now()
        const result = handLandmarker.detectForVideo(video, now)
        const hand = result?.landmarks?.[0]

        if (hand?.[8]) { // using index finger tip for better shape drawing
          history.push({ x: hand[8].x, y: hand[8].y, time: now })

          while (history.length > 0 && now - history[0].time > 2000) { // 2 seconds window
            history.shift()
          }

          if (now - lastActionAt > WAVE_COOLDOWN_MS) {
            // Check for wave (using wrist point)
            const wrist = hand[0];
            const wavePoints = history.map(p => ({ x: wrist.x, time: p.time })); // approximate wave using history time frames but recent wrist position
            
            if (isWaveGesture(history)) {
              lastActionAt = now
              history.length = 0
              if (onWave) onWave()
            } else {
              const shape = detectShape(history);
              if (shape) {
                lastActionAt = now
                history.length = 0
                if (onShape) onShape(shape)
              }
            }
          }
        }
      }
    } catch (err) {
      if (onError) onError(err)
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

export async function createAdvancedGestureDetector({ video, onGesture, onError }) {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm'
  )

  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task'
    },
    runningMode: 'VIDEO'
  })

  let running = true
  let rafId = 0
  let lastActionAt = 0

  const loop = () => {
    if (!running) return

    try {
      if (video.readyState >= 2) {
        const now = performance.now()
        const result = gestureRecognizer.recognizeForVideo(video, now)

        if (result.gestures.length > 0) {
          const gestureName = result.gestures[0][0].categoryName;
          // Map default MediaPipe gestures to actions
          // "Closed_Fist", "Open_Palm", "Pointing_Up", "Thumb_Down", "Thumb_Up", "Victory", "ILoveYou"
          let action = null;
          
          if (gestureName === "Open_Palm") action = "stop";
          else if (gestureName === "Thumb_Up") action = "yes";
          else if (gestureName === "Thumb_Down") action = "no";
          else if (gestureName === "Pointing_Up") action = "repeat";
          else if (gestureName === "Victory") action = "next";

          if (action && (now - lastActionAt > 2000)) {
             lastActionAt = now;
             if (onGesture) onGesture(action);
          }
        }
      }
    } catch (err) {
      if (onError) onError(err)
    }

    rafId = requestAnimationFrame(loop)
  }

  rafId = requestAnimationFrame(loop)

  return {
    stop() {
      running = false
      cancelAnimationFrame(rafId)
      gestureRecognizer.close()
    }
  }
}
