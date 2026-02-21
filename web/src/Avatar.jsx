import React, { useEffect, useState } from 'react'

// Avatar component with gender support and animations
export default function Avatar({ customization, gesture, mood, size = 'medium' }) {
  const {
    skinTone = '#e0ac69',
    hairColor = '#2c1810',
    hairStyle = 'short',
    eyeColor = '#3d2314',
    shirtColor = '#4a90d9',
    gender = 'neutral'
  } = customization || {}

  const [currentGesture, setCurrentGesture] = useState('idle')
  const [armRotation, setArmRotation] = useState(0)
  const [blinkState, setBlinkState] = useState(false)

  // Random blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBlinkState(true)
        setTimeout(() => setBlinkState(false), 150)
      }
    }, 2000)
    return () => clearInterval(blinkInterval)
  }, [])

  // Animate based on gesture
  useEffect(() => {
    if (gesture === 'hello') {
      let frame = 0
      const interval = setInterval(() => {
        setArmRotation(Math.sin(frame * 0.3) * 30 - 45)
        frame++
        if (frame > 20) {
          clearInterval(interval)
          setArmRotation(0)
          setCurrentGesture('idle')
        }
      }, 50)
      setCurrentGesture('hello')
      return () => clearInterval(interval)
    } else if (gesture === 'goodbye') {
      let frame = 0
      const interval = setInterval(() => {
        setArmRotation(Math.sin(frame * 0.2) * 40 - 30)
        frame++
        if (frame > 30) {
          clearInterval(interval)
          setArmRotation(0)
          setCurrentGesture('idle')
        }
      }, 60)
      setCurrentGesture('goodbye')
      return () => clearInterval(interval)
    } else if (gesture === 'thumbsup') {
      setArmRotation(-60)
      setCurrentGesture('thumbsup')
      const timeout = setTimeout(() => {
        setArmRotation(0)
        setCurrentGesture('idle')
      }, 1500)
      return () => clearTimeout(timeout)
    } else if (gesture === 'thinking') {
      setArmRotation(-20)
      setCurrentGesture('thinking')
    } else {
      setArmRotation(0)
      setCurrentGesture('idle')
    }
  }, [gesture])

  const getMouthPath = () => {
    switch (mood) {
      case 'happy':
        return 'M 85 145 Q 100 162 115 145'
      case 'sad':
        return 'M 85 155 Q 100 143 115 155'
      case 'surprised':
        return 'M 92 148 Q 100 160 108 148 Q 100 148 92 148'
      case 'thinking':
        return 'M 88 150 L 112 150'
      default:
        return 'M 88 150 Q 100 157 112 150'
    }
  }

  const getEyebrows = () => {
    switch (mood) {
      case 'happy':
        return { left: 'M 78 105 Q 85 100 92 105', right: 'M 108 105 Q 115 100 122 105' }
      case 'sad':
        return { left: 'M 78 100 Q 85 105 92 100', right: 'M 108 100 Q 115 105 122 100' }
      case 'surprised':
        return { left: 'M 78 96 Q 85 91 92 96', right: 'M 108 96 Q 115 91 122 96' }
      case 'thinking':
        return { left: 'M 78 102 Q 85 100 92 105', right: 'M 108 100 Q 115 96 122 100' }
      default:
        return { left: 'M 78 103 Q 85 100 92 103', right: 'M 108 103 Q 115 100 122 103' }
    }
  }

  const eyebrows = getEyebrows()
  const isFemale = gender === 'female'
  const eyeHeight = blinkState ? 1 : (mood === 'surprised' ? 10 : 6)

  const getHairPath = () => {
    if (isFemale) {
      switch (hairStyle) {
        case 'short':
          return (
            <>
              <path
                d="M 52 80 Q 50 35 100 28 Q 150 35 148 80 Q 143 65 100 58 Q 57 65 52 80"
                fill={hairColor}
              />
              <path d="M 52 75 Q 48 95 52 110" fill="none" stroke={hairColor} strokeWidth="8" strokeLinecap="round" />
              <path d="M 148 75 Q 152 95 148 110" fill="none" stroke={hairColor} strokeWidth="8" strokeLinecap="round" />
            </>
          )
        case 'long':
          return (
            <>
              <path
                d="M 50 80 Q 48 32 100 25 Q 152 32 150 80 Q 145 60 100 52 Q 55 60 50 80"
                fill={hairColor}
              />
              <path d="M 45 80 Q 38 140 42 200 Q 48 220 55 200 Q 52 140 58 80" fill={hairColor} />
              <path d="M 155 80 Q 162 140 158 200 Q 152 220 145 200 Q 148 140 142 80" fill={hairColor} />
              <path d="M 55 85 Q 50 120 53 160" fill="none" stroke={hairColor} strokeWidth="12" strokeLinecap="round" />
              <path d="M 145 85 Q 150 120 147 160" fill="none" stroke={hairColor} strokeWidth="12" strokeLinecap="round" />
            </>
          )
        case 'curly':
          return (
            <>
              <ellipse cx="60" cy="55" rx="20" ry="22" fill={hairColor} />
              <ellipse cx="82" cy="40" rx="18" ry="20" fill={hairColor} />
              <ellipse cx="100" cy="35" rx="16" ry="18" fill={hairColor} />
              <ellipse cx="118" cy="40" rx="18" ry="20" fill={hairColor} />
              <ellipse cx="140" cy="55" rx="20" ry="22" fill={hairColor} />
              <ellipse cx="48" cy="90" rx="15" ry="20" fill={hairColor} />
              <ellipse cx="152" cy="90" rx="15" ry="20" fill={hairColor} />
            </>
          )
        case 'ponytail':
          return (
            <>
              <path
                d="M 50 80 Q 48 35 100 28 Q 152 35 150 80 Q 145 62 100 55 Q 55 62 50 80"
                fill={hairColor}
              />
              <ellipse cx="100" cy="20" rx="15" ry="18" fill={hairColor} />
              <path d="M 92 5 Q 100 -25 108 5" fill={hairColor} stroke={hairColor} strokeWidth="12" />
              <ellipse cx="100" cy="-15" rx="10" ry="12" fill={hairColor} />
            </>
          )
        case 'bald':
          return null
        default:
          return (
            <path
              d="M 52 80 Q 50 35 100 28 Q 150 35 148 80 Q 143 65 100 58 Q 57 65 52 80"
              fill={hairColor}
            />
          )
      }
    }
    
    // Male hair styles
    switch (hairStyle) {
      case 'short':
        return (
          <path
            d="M 55 80 Q 55 40 100 35 Q 145 40 145 80 Q 140 70 100 65 Q 60 70 55 80"
            fill={hairColor}
          />
        )
      case 'long':
        return (
          <>
            <path
              d="M 55 80 Q 55 40 100 35 Q 145 40 145 80 Q 140 70 100 65 Q 60 70 55 80"
              fill={hairColor}
            />
            <path d="M 50 80 Q 45 120 50 170 Q 55 180 60 170 Q 55 120 60 80" fill={hairColor} />
            <path d="M 150 80 Q 155 120 150 170 Q 145 180 140 170 Q 145 120 140 80" fill={hairColor} />
          </>
        )
      case 'curly':
        return (
          <>
            <ellipse cx="65" cy="60" rx="18" ry="20" fill={hairColor} />
            <ellipse cx="85" cy="45" rx="18" ry="18" fill={hairColor} />
            <ellipse cx="100" cy="40" rx="15" ry="15" fill={hairColor} />
            <ellipse cx="115" cy="45" rx="18" ry="18" fill={hairColor} />
            <ellipse cx="135" cy="60" rx="18" ry="20" fill={hairColor} />
          </>
        )
      case 'ponytail':
        return (
          <>
            <path
              d="M 55 80 Q 55 40 100 35 Q 145 40 145 80 Q 140 70 100 65 Q 60 70 55 80"
              fill={hairColor}
            />
            <ellipse cx="100" cy="25" rx="12" ry="15" fill={hairColor} />
            <path d="M 95 10 Q 100 -10 105 10" fill={hairColor} stroke={hairColor} strokeWidth="8" />
          </>
        )
      case 'bald':
        return null
      default:
        return (
          <path
            d="M 55 80 Q 55 40 100 35 Q 145 40 145 80 Q 140 70 100 65 Q 60 70 55 80"
            fill={hairColor}
          />
        )
    }
  }

  // Size classes
  const sizeClass = {
    small: 'avatar-small',
    medium: 'avatar-medium', 
    large: 'avatar-large'
  }[size] || 'avatar-medium'

  return (
    <svg
      viewBox="0 0 200 280"
      className={`avatar-svg ${sizeClass}`}
      role="img"
      aria-label={`${gender === 'female' ? 'Female' : 'Male'} avatar doing ${currentGesture} gesture`}
    >
      {/* Glow effect */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Body / Shirt */}
      <path
        d={isFemale 
          ? "M 55 200 Q 50 180 72 173 L 100 168 L 128 173 Q 150 180 145 200 L 145 280 L 55 280 Z"
          : "M 50 200 Q 50 180 70 175 L 100 170 L 130 175 Q 150 180 150 200 L 150 280 L 50 280 Z"
        }
        fill={shirtColor}
      />
      
      {/* Neckline for female */}
      {isFemale && (
        <path
          d="M 82 173 Q 100 185 118 173"
          fill="none"
          stroke={shirtColor}
          strokeWidth="2"
        />
      )}
      
      {/* Neck */}
      <rect x="87" y="158" width="26" height="22" fill={skinTone} />
      
      {/* Left Arm */}
      <g transform={`rotate(${armRotation}, 55, 190)`}>
        <path
          d={isFemale
            ? "M 55 200 Q 32 212 28 242 Q 23 262 32 272"
            : "M 50 200 Q 30 210 25 240 Q 20 260 30 270"
          }
          fill="none"
          stroke={shirtColor}
          strokeWidth={isFemale ? 16 : 20}
          strokeLinecap="round"
        />
        <circle cx={isFemale ? 32 : 30} cy={isFemale ? 272 : 270} r={isFemale ? 10 : 12} fill={skinTone} />
        {currentGesture === 'thumbsup' && (
          <ellipse cx={isFemale ? 32 : 30} cy={isFemale ? 258 : 255} rx="3" ry="9" fill={skinTone} />
        )}
      </g>
      
      {/* Right Arm */}
      <path
        d={isFemale
          ? "M 145 200 Q 168 212 172 242 Q 177 262 168 272"
          : "M 150 200 Q 170 210 175 240 Q 180 260 170 270"
        }
        fill="none"
        stroke={shirtColor}
        strokeWidth={isFemale ? 16 : 20}
        strokeLinecap="round"
      />
      <circle cx={isFemale ? 168 : 170} cy={isFemale ? 272 : 270} r={isFemale ? 10 : 12} fill={skinTone} />
      
      {/* Head */}
      <ellipse 
        cx="100" 
        cy={isFemale ? 108 : 110} 
        rx={isFemale ? 48 : 50} 
        ry={isFemale ? 58 : 60} 
        fill={skinTone} 
      />
      
      {/* Hair */}
      {getHairPath()}
      
      {/* Eyes */}
      <ellipse cx="85" cy={isFemale ? 113 : 115} rx="8" ry={eyeHeight} fill="white" />
      <ellipse cx="115" cy={isFemale ? 113 : 115} rx="8" ry={eyeHeight} fill="white" />
      <circle cx="85" cy={isFemale ? 113 : 115} r="4" fill={eyeColor} />
      <circle cx="115" cy={isFemale ? 113 : 115} r="4" fill={eyeColor} />
      
      {/* Eye shine */}
      <circle cx="87" cy={isFemale ? 111 : 113} r="1.5" fill="white" />
      <circle cx="117" cy={isFemale ? 111 : 113} r="1.5" fill="white" />
      
      {/* Eyelashes for female */}
      {isFemale && (
        <>
          <path d="M 77 108 Q 75 105 73 107" stroke={hairColor} strokeWidth="1.5" fill="none" />
          <path d="M 79 106 Q 78 103 76 104" stroke={hairColor} strokeWidth="1.5" fill="none" />
          <path d="M 93 108 Q 95 105 97 107" stroke={hairColor} strokeWidth="1.5" fill="none" />
          <path d="M 91 106 Q 92 103 94 104" stroke={hairColor} strokeWidth="1.5" fill="none" />
          <path d="M 107 108 Q 105 105 103 107" stroke={hairColor} strokeWidth="1.5" fill="none" />
          <path d="M 109 106 Q 108 103 106 104" stroke={hairColor} strokeWidth="1.5" fill="none" />
          <path d="M 123 108 Q 125 105 127 107" stroke={hairColor} strokeWidth="1.5" fill="none" />
          <path d="M 121 106 Q 122 103 124 104" stroke={hairColor} strokeWidth="1.5" fill="none" />
        </>
      )}
      
      {/* Eyebrows */}
      <path d={eyebrows.left} fill="none" stroke={hairColor} strokeWidth={isFemale ? 2 : 2.5} strokeLinecap="round" />
      <path d={eyebrows.right} fill="none" stroke={hairColor} strokeWidth={isFemale ? 2 : 2.5} strokeLinecap="round" />
      
      {/* Nose */}
      <path 
        d={isFemale 
          ? "M 100 118 Q 96 132 100 137 Q 104 132 100 118"
          : "M 100 120 Q 95 135 100 140 Q 105 135 100 120"
        }
        fill="none" 
        stroke={skinTone} 
        strokeWidth="2" 
        opacity="0.4" 
      />
      
      {/* Mouth */}
      <path 
        d={getMouthPath()} 
        fill="none" 
        stroke={isFemale ? "#d44" : "#c44"} 
        strokeWidth={isFemale ? 2.5 : 3} 
        strokeLinecap="round" 
      />
      
      {/* Blush for female when happy */}
      {isFemale && mood === 'happy' && (
        <>
          <ellipse cx="70" cy="128" rx="8" ry="5" fill="#ffb6c1" opacity="0.4" />
          <ellipse cx="130" cy="128" rx="8" ry="5" fill="#ffb6c1" opacity="0.4" />
        </>
      )}
      
      {/* Ears */}
      <ellipse cx={isFemale ? 52 : 50} cy={isFemale ? 113 : 115} rx={isFemale ? 6 : 8} ry={isFemale ? 10 : 12} fill={skinTone} />
      <ellipse cx={isFemale ? 148 : 150} cy={isFemale ? 113 : 115} rx={isFemale ? 6 : 8} ry={isFemale ? 10 : 12} fill={skinTone} />
      
      {/* Earrings for female */}
      {isFemale && (
        <>
          <circle cx="52" cy="125" r="3" fill="#ffd700" />
          <circle cx="148" cy="125" r="3" fill="#ffd700" />
        </>
      )}
    </svg>
  )
}
