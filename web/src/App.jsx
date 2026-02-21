import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import CustomizePage from './CustomizePage'
import StarBackground from './StarBackground'
import './styles.css'

const DISABILITY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'blind', label: 'Blind / Low-vision' },
  { value: 'deaf', label: 'Deaf / Hard-of-hearing' },
  { value: 'cognitive', label: 'Cognitive-friendly' }
]

const LANGUAGE_OPTIONS = [
  { value: 'english', label: '🇬🇧 English' },
  { value: 'spanish', label: '🇪🇸 Spanish (Español)' },
  { value: 'mandarin', label: '🇨🇳 Mandarin (中文)' },
  { value: 'hindi', label: '🇮🇳 Hindi (हिन्दी)' },
  { value: 'arabic', label: '🇸🇦 Arabic (العربية)' },
  { value: 'portuguese', label: '🇧🇷 Portuguese (Português)' },
  { value: 'french', label: '🇫🇷 French (Français)' },
  { value: 'german', label: '🇩🇪 German (Deutsch)' },
  { value: 'russian', label: '🇷🇺 Russian (Русский)' },
  { value: 'japanese', label: '🇯🇵 Japanese (日本語)' },
  { value: 'korean', label: '🇰🇷 Korean (한국어)' },
  { value: 'bengali', label: '🇧🇩 Bengali (বাংলা)' },
  { value: 'urdu', label: '🇵🇰 Urdu (اردو)' },
  { value: 'indonesian', label: '🇮🇩 Indonesian' },
  { value: 'turkish', label: '🇹🇷 Turkish (Türkçe)' },
  { value: 'vietnamese', label: '🇻🇳 Vietnamese (Tiếng Việt)' },
  { value: 'italian', label: '🇮🇹 Italian (Italiano)' },
  { value: 'thai', label: '🇹🇭 Thai (ภาษาไทย)' },
  { value: 'dutch', label: '🇳🇱 Dutch (Nederlands)' },
  { value: 'polish', label: '🇵🇱 Polish (Polski)' },
  { value: 'tamil', label: '🇮🇳 Tamil (தமிழ்)' },
  { value: 'telugu', label: '🇮🇳 Telugu (తెలుగు)' },
  { value: 'marathi', label: '🇮🇳 Marathi (मराठी)' },
  { value: 'swahili', label: '🇰🇪 Swahili (Kiswahili)' },
  { value: 'filipino', label: '🇵🇭 Filipino (Tagalog)' },
  { value: 'greek', label: '🇬🇷 Greek (Ελληνικά)' },
  { value: 'hebrew', label: '🇮🇱 Hebrew (עברית)' },
  { value: 'malay', label: '🇲🇾 Malay (Bahasa Melayu)' },
  { value: 'persian', label: '🇮🇷 Persian (فارسی)' },
  { value: 'ukrainian', label: '🇺🇦 Ukrainian (Українська)' }
]

const DEFAULT_CUSTOMIZATION = {
  skinTone: '#e0ac69',
  hairColor: '#2c1810',
  hairStyle: 'short',
  eyeColor: '#3d2314',
  shirtColor: '#4a90d9',
  mood: 'neutral',
  gender: 'neutral'
}

// Detect greetings in multiple languages
function detectGesture(text) {
  const lower = text.toLowerCase()
  
  const helloWords = [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
    'hola', 'bonjour', 'hallo', 'ciao', 'olá', 'привет', 'こんにちは', '你好', '안녕하세요',
    'مرحبا', 'नमस्ते', 'xin chào', 'สวัสดี', 'cześć'
  ]
  
  const goodbyeWords = [
    'goodbye', 'bye', 'see you', 'farewell', 'take care',
    'adiós', 'au revoir', 'auf wiedersehen', 'arrivederci', 'tchau',
    'до свидания', 'さようなら', '再见', '안녕히', 'مع السلامة', 'अलविदा'
  ]
  
  const thankWords = [
    'thank', 'thanks', 'gracias', 'merci', 'danke', 'grazie', 'obrigado',
    'спасибо', 'ありがとう', '谢谢', '감사합니다', 'شكرا', 'धन्यवाद'
  ]
  
  if (helloWords.some(w => lower.includes(w))) return 'hello'
  if (goodbyeWords.some(w => lower.includes(w))) return 'goodbye'
  if (thankWords.some(w => lower.includes(w))) return 'thumbsup'
  
  return null
}

// Navigation Component
function Navigation({ currentPage, setCurrentPage }) {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <span className="nav-logo">✨</span>
        <span className="nav-title">Granite AI</span>
      </div>
      <div className="nav-links">
        <button 
          className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          Home
        </button>
        <button 
          className={`nav-link ${currentPage === 'chat' ? 'active' : ''}`}
          onClick={() => setCurrentPage('chat')}
        >
          Chat
        </button>
        <button 
          className={`nav-link ${currentPage === 'customize' ? 'active' : ''}`}
          onClick={() => setCurrentPage('customize')}
        >
          Avatar
        </button>
      </div>
    </nav>
  )
}

// Home Page
function HomePage({ onGetStarted }) {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to<br />
            <span className="highlight">Granite Accessible Assistant</span>
          </h1>
          <p className="hero-subtitle">
            An AI-powered accessibility layer that adapts to your needs.
            Built with IBM Granite LLM and RAG technology for grounded,
            reliable responses in 30+ languages.
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>Accessibility First</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌍</span>
              <span>30+ Languages</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Privacy Focused</span>
            </div>
          </div>
          <button className="get-started-btn" onClick={onGetStarted}>
            Get Started
            <span className="btn-arrow">→</span>
          </button>
        </div>
        <div className="hero-visual">
          <div className="floating-avatar">
            <Avatar 
              customization={DEFAULT_CUSTOMIZATION}
              gesture="hello"
              mood="happy"
              size="large"
            />
          </div>
        </div>
      </div>
      
      <div className="info-cards">
        <div className="info-card glass-card">
          <div className="card-icon">👁️</div>
          <h3>Blind / Low Vision</h3>
          <p>Step-by-step verbal instructions without visual references</p>
        </div>
        <div className="info-card glass-card">
          <div className="card-icon">👂</div>
          <h3>Deaf / Hard of Hearing</h3>
          <p>Clear text-based responses without audio dependencies</p>
        </div>
        <div className="info-card glass-card">
          <div className="card-icon">🧠</div>
          <h3>Cognitive Friendly</h3>
          <p>Simple language with short steps and no jargon</p>
        </div>
      </div>
    </div>
  )
}

// Chat Page
function ChatPage({ customization }) {
  const [disability, setDisability] = useState('none')
  const [language, setLanguage] = useState('english')
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [gesture, setGesture] = useState('idle')
  const [mood, setMood] = useState(customization.mood || 'neutral')

  // React to states
  useEffect(() => {
    if (loading) {
      setGesture('thinking')
      setMood('thinking')
    } else if (answer) {
      setGesture('thumbsup')
      setMood('happy')
      const timer = setTimeout(() => setGesture('idle'), 2000)
      return () => clearTimeout(timer)
    } else if (error) {
      setMood('sad')
    }
  }, [loading, answer, error])

  // Detect gesture from query
  useEffect(() => {
    if (query && !loading) {
      const detected = detectGesture(query)
      if (detected) {
        setGesture(detected)
        if (detected === 'hello' || detected === 'thumbsup') setMood('happy')
        const timer = setTimeout(() => setGesture('idle'), 2500)
        return () => clearTimeout(timer)
      }
    }
  }, [query, loading])

  const canSubmit = query.trim().length > 0 && !loading

  async function askAssistant() {
    setError('')
    setAnswer('')
    setLoading(true)
    setGesture('thinking')
    setMood('thinking')

    try {
      const resp = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), disability, language })
      })

      if (!resp.ok) throw new Error('Request failed')

      const data = await resp.json()
      setAnswer(String(data?.answer ?? ''))
      setGesture('thumbsup')
      setMood('happy')
    } catch {
      setError('Sorry, the assistant is unavailable right now.')
      setMood('sad')
      setGesture('idle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Avatar Section - Big and Central */}
        <div className="avatar-section">
          <div className="avatar-wrapper glass-card">
            <Avatar 
              customization={customization} 
              gesture={gesture} 
              mood={mood}
              size="large"
            />
            <div className="avatar-status">
              {loading && <span className="status thinking">🤔 Thinking...</span>}
              {!loading && answer && <span className="status ready">✨ Here's your answer!</span>}
              {!loading && !answer && !error && <span className="status idle">👋 Ask me anything!</span>}
              {error && <span className="status error">😔 Something went wrong</span>}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="chat-interface">
          <div className="controls-row">
            <div className="control-group">
              <label htmlFor="disability">Accessibility Mode</label>
              <select
                id="disability"
                value={disability}
                onChange={(e) => setDisability(e.target.value)}
              >
                {DISABILITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="language">Language</label>
              <select 
                id="language" 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="query-section glass-card">
            <label htmlFor="query">How can I help you today?</label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your question here... (Try saying 'Hello!' or 'Thank you!')"
              rows={3}
            />
            <button 
              className="submit-btn" 
              onClick={askAssistant} 
              disabled={!canSubmit}
            >
              {loading ? '🔄 Processing...' : '💬 Ask Assistant'}
            </button>
          </div>

          {/* Response Section */}
          <div className="response-section glass-card" aria-live="polite">
            <h3>Assistant Response</h3>
            {loading && <p className="hint">The assistant is thinking...</p>}
            {error && <p className="error-text">{error}</p>}
            {!loading && !error && !answer && <p className="hint">Your answer will appear here.</p>}
            {answer && <pre className="answer-text">{answer}</pre>}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App
export default function App() {
  const [page, setPage] = useState('home')
  const [customization, setCustomization] = useState(() => {
    const saved = localStorage.getItem('avatarCustomization')
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMIZATION
  })

  useEffect(() => {
    localStorage.setItem('avatarCustomization', JSON.stringify(customization))
  }, [customization])

  return (
    <div className="app">
      <StarBackground />
      <Navigation currentPage={page} setCurrentPage={setPage} />
      
      <main className="main-content">
        {page === 'home' && <HomePage onGetStarted={() => setPage('chat')} />}
        {page === 'chat' && <ChatPage customization={customization} />}
        {page === 'customize' && (
          <CustomizePage 
            customization={customization}
            setCustomization={setCustomization}
          />
        )}
      </main>

      <footer className="footer">
        <p>Powered by IBM Granite LLM • {LANGUAGE_OPTIONS.length} Languages • Open Source</p>
      </footer>
    </div>
  )
}
