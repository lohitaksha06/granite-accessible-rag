import React, { useEffect, useState } from 'react'

// Avatar component with sign language animations
export default function Avatar({ customization, gesture, mood }) {
  const {
    skinTone = '#e0ac69',
    hairColor = '#2c1810',
    hairStyle = 'short',
    eyeColor = '#3d2314',
    shirtColor = '#4a90d9'
  } = customization || {}

  const [currentGesture, setCurrentGesture] = useState('idle')
  const [armRotation, setArmRotation] = useState(0)

  // Animate based on gesture
  useEffect(() => {
    if (gesture === 'hello') {
      // Wave animation
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
      // Wave goodbye (slower, side to side)
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

  // Mood affects expression
  const getMouthPath = () => {
    switch (mood) {
      case 'happy':
        return 'M 85 145 Q 100 160 115 145' // smile
      case 'sad':
        return 'M 85 155 Q 100 145 115 155' // frown
      case 'surprised':
        return 'M 92 148 Q 100 158 108 148 Q 100 148 92 148' // O shape
      case 'thinking':
        return 'M 88 150 L 112 150' // straight line, slight offset
      default:
        return 'M 88 150 Q 100 155 112 150' // neutral slight smile
    }
  }

  const getEyebrows = () => {
    switch (mood) {
      case 'happy':
        return { left: 'M 78 105 Q 85 100 92 105', right: 'M 108 105 Q 115 100 122 105' }
      case 'sad':
        return { left: 'M 78 100 Q 85 105 92 100', right: 'M 108 100 Q 115 105 122 100' }
      case 'surprised':
        return { left: 'M 78 98 Q 85 93 92 98', right: 'M 108 98 Q 115 93 122 98' }
      case 'thinking':
        return { left: 'M 78 102 Q 85 100 92 105', right: 'M 108 102 Q 115 98 122 102' }
      default:
        return { left: 'M 78 103 Q 85 100 92 103', right: 'M 108 103 Q 115 100 122 103' }
    }
  }

  const eyebrows = getEyebrows()

  const getHairPath = () => {
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
            <path
              d="M 50 80 Q 45 120 50 170 Q 55 180 60 170 Q 55 120 60 80"
              fill={hairColor}
            />
            <path
              d="M 150 80 Q 155 120 150 170 Q 145 180 140 170 Q 145 120 140 80"
              fill={hairColor}
            />
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
      case 'bald':
        return null
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
      default:
        return (
          <path
            d="M 55 80 Q 55 40 100 35 Q 145 40 145 80 Q 140 70 100 65 Q 60 70 55 80"
            fill={hairColor}
          />
        )
    }
  }

  return (
    <svg
      viewBox="0 0 200 280"
      className="avatar-svg"
      role="img"
      aria-label={`Avatar doing ${currentGesture} gesture`}
    >
      {/* Body / Shirt */}
      <path
        d="M 50 200 Q 50 180 70 175 L 100 170 L 130 175 Q 150 180 150 200 L 150 280 L 50 280 Z"
        fill={shirtColor}
      />
      
      {/* Neck */}
      <rect x="85" y="160" width="30" height="20" fill={skinTone} />
      
      {/* Left Arm */}
      <g transform={`rotate(${armRotation}, 55, 190)`}>
        <path
          d="M 50 200 Q 30 210 25 240 Q 20 260 30 270"
          fill="none"
          stroke={shirtColor}
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Left Hand */}
        <circle cx="30" cy="270" r="12" fill={skinTone} />
        {currentGesture === 'thumbsup' && (
          <ellipse cx="30" cy="255" rx="4" ry="10" fill={skinTone} />
        )}
      </g>
      
      {/* Right Arm (static) */}
      <path
        d="M 150 200 Q 170 210 175 240 Q 180 260 170 270"
        fill="none"
        stroke={shirtColor}
        strokeWidth="20"
        strokeLinecap="round"
      />
      <circle cx="170" cy="270" r="12" fill={skinTone} />
      
      {/* Head */}
      <ellipse cx="100" cy="110" rx="50" ry="60" fill={skinTone} />
      
      {/* Hair */}
      {getHairPath()}
      
      {/* Eyes */}
      <ellipse cx="85" cy="115" rx="8" ry={mood === 'surprised' ? 10 : 6} fill="white" />
      <ellipse cx="115" cy="115" rx="8" ry={mood === 'surprised' ? 10 : 6} fill="white" />
      <circle cx="85" cy="115" r="4" fill={eyeColor} />
      <circle cx="115" cy="115" r="4" fill={eyeColor} />
      
      {/* Eye shine */}
      <circle cx="87" cy="113" r="1.5" fill="white" />
      <circle cx="117" cy="113" r="1.5" fill="white" />
      
      {/* Eyebrows */}
      <path d={eyebrows.left} fill="none" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
      <path d={eyebrows.right} fill="none" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Nose */}
      <path d="M 100 120 Q 95 135 100 140 Q 105 135 100 120" fill="none" stroke={skinTone} strokeWidth="2" opacity="0.5" />
      
      {/* Mouth */}
      <path d={getMouthPath()} fill="none" stroke="#c44" strokeWidth="3" strokeLinecap="round" />
      
      {/* Ears */}
      <ellipse cx="50" cy="115" rx="8" ry="12" fill={skinTone} />
      <ellipse cx="150" cy="115" rx="8" ry="12" fill={skinTone} />
    </svg>
  )
}
