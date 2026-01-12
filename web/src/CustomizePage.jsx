import React from 'react'
import Avatar from './Avatar'

const SKIN_TONES = [
  { value: '#ffe5d9', label: 'Light' },
  { value: '#e0ac69', label: 'Medium Light' },
  { value: '#c68642', label: 'Medium' },
  { value: '#8d5524', label: 'Medium Dark' },
  { value: '#5c3a21', label: 'Dark' },
  { value: '#3b2417', label: 'Deep' }
]

const HAIR_COLORS = [
  { value: '#090806', label: 'Black' },
  { value: '#2c1810', label: 'Dark Brown' },
  { value: '#6a4e42', label: 'Brown' },
  { value: '#b55239', label: 'Auburn' },
  { value: '#d6c4c2', label: 'Blonde' },
  { value: '#cabfb1', label: 'Platinum' },
  { value: '#8b8b8b', label: 'Gray' },
  { value: '#e35050', label: 'Red' },
  { value: '#6c5ce7', label: 'Purple' },
  { value: '#00b894', label: 'Teal' },
  { value: '#0984e3', label: 'Blue' }
]

const HAIR_STYLES = [
  { value: 'short', label: 'Short' },
  { value: 'long', label: 'Long' },
  { value: 'curly', label: 'Curly' },
  { value: 'ponytail', label: 'Ponytail' },
  { value: 'bald', label: 'Bald' }
]

const EYE_COLORS = [
  { value: '#3d2314', label: 'Brown' },
  { value: '#1e90ff', label: 'Blue' },
  { value: '#228b22', label: 'Green' },
  { value: '#808080', label: 'Gray' },
  { value: '#daa520', label: 'Amber' },
  { value: '#4b0082', label: 'Violet' }
]

const SHIRT_COLORS = [
  { value: '#4a90d9', label: 'Blue' },
  { value: '#e74c3c', label: 'Red' },
  { value: '#2ecc71', label: 'Green' },
  { value: '#9b59b6', label: 'Purple' },
  { value: '#f39c12', label: 'Orange' },
  { value: '#1abc9c', label: 'Teal' },
  { value: '#34495e', label: 'Dark Gray' },
  { value: '#e91e63', label: 'Pink' },
  { value: '#111111', label: 'Black' },
  { value: '#ffffff', label: 'White' }
]

const MOODS = [
  { value: 'neutral', label: '😐 Neutral' },
  { value: 'happy', label: '😊 Happy' },
  { value: 'sad', label: '😢 Sad' },
  { value: 'surprised', label: '😮 Surprised' },
  { value: 'thinking', label: '🤔 Thinking' }
]

export default function CustomizePage({ customization, setCustomization, onBack }) {
  const updateField = (field, value) => {
    setCustomization(prev => ({ ...prev, [field]: value }))
  }

  return (
    <main className="page customize-page">
      <header className="header">
        <button className="back-button" onClick={onBack}>
          ← Back to Kiosk
        </button>
        <h1 className="title">Customize Your Avatar</h1>
        <p className="subtitle">Create your personal assistant companion</p>
      </header>

      <div className="customize-layout">
        {/* Preview */}
        <section className="card preview-card">
          <h2 className="panelTitle">Preview</h2>
          <div className="avatar-preview">
            <Avatar 
              customization={customization} 
              gesture="idle" 
              mood={customization.mood || 'neutral'} 
            />
          </div>
          <div className="preview-actions">
            <button 
              className="gesture-btn" 
              onClick={() => {
                const avatar = document.querySelector('.avatar-preview')
                avatar.dataset.gesture = 'hello'
                setTimeout(() => avatar.dataset.gesture = '', 2000)
              }}
            >
              👋 Wave Hello
            </button>
            <button 
              className="gesture-btn"
              onClick={() => {
                const avatar = document.querySelector('.avatar-preview')
                avatar.dataset.gesture = 'thumbsup'
                setTimeout(() => avatar.dataset.gesture = '', 1500)
              }}
            >
              👍 Thumbs Up
            </button>
          </div>
        </section>

        {/* Options */}
        <section className="card options-card">
          <h2 className="panelTitle">Appearance</h2>
          
          <div className="option-group">
            <label>Skin Tone</label>
            <div className="color-picker">
              {SKIN_TONES.map(tone => (
                <button
                  key={tone.value}
                  className={`color-swatch ${customization.skinTone === tone.value ? 'selected' : ''}`}
                  style={{ backgroundColor: tone.value }}
                  onClick={() => updateField('skinTone', tone.value)}
                  title={tone.label}
                  aria-label={tone.label}
                />
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>Hair Style</label>
            <div className="style-picker">
              {HAIR_STYLES.map(style => (
                <button
                  key={style.value}
                  className={`style-btn ${customization.hairStyle === style.value ? 'selected' : ''}`}
                  onClick={() => updateField('hairStyle', style.value)}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>Hair Color</label>
            <div className="color-picker">
              {HAIR_COLORS.map(color => (
                <button
                  key={color.value}
                  className={`color-swatch ${customization.hairColor === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => updateField('hairColor', color.value)}
                  title={color.label}
                  aria-label={color.label}
                />
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>Eye Color</label>
            <div className="color-picker">
              {EYE_COLORS.map(color => (
                <button
                  key={color.value}
                  className={`color-swatch ${customization.eyeColor === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => updateField('eyeColor', color.value)}
                  title={color.label}
                  aria-label={color.label}
                />
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>Shirt Color</label>
            <div className="color-picker">
              {SHIRT_COLORS.map(color => (
                <button
                  key={color.value}
                  className={`color-swatch ${customization.shirtColor === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.value, border: color.value === '#ffffff' ? '1px solid #ccc' : 'none' }}
                  onClick={() => updateField('shirtColor', color.value)}
                  title={color.label}
                  aria-label={color.label}
                />
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>Expression</label>
            <div className="style-picker">
              {MOODS.map(m => (
                <button
                  key={m.value}
                  className={`style-btn ${customization.mood === m.value ? 'selected' : ''}`}
                  onClick={() => updateField('mood', m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
