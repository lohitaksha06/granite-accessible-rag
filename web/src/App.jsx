import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import CustomizePage from './CustomizePage'

const DISABILITY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'blind', label: 'Blind / Low-vision' },
  { value: 'deaf', label: 'Deaf / Hard-of-hearing' },
  { value: 'cognitive', label: 'Cognitive-friendly' }
]

const LANGUAGE_OPTIONS = [
  // Major world languages
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
  // Additional languages
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
  mood: 'neutral'
}

// Detect greetings and farewells in multiple languages
function detectGesture(text) {
  const lower = text.toLowerCase()
  
  const helloWords = [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
    'hola', 'buenos días', 'buenas tardes',
    'bonjour', 'salut', 'bonsoir',
    'hallo', 'guten tag', 'guten morgen',
    'ciao', 'buongiorno',
    'olá', 'oi', 'bom dia',
    'привет', 'здравствуйте', 'доброе утро',
    'こんにちは', 'おはよう',
    '你好', '早上好',
    '안녕하세요', '안녕',
    'مرحبا', 'السلام عليكم',
    'नमस्ते', 'नमस्कार',
    'xin chào',
    'สวัสดี',
    'hej', 'hei',
    'cześć', 'dzień dobry'
  ]
  
  const goodbyeWords = [
    'goodbye', 'bye', 'see you', 'farewell', 'take care', 'later',
    'adiós', 'hasta luego', 'chao',
    'au revoir', 'à bientôt', 'salut',
    'auf wiedersehen', 'tschüss',
    'arrivederci', 'ciao',
    'tchau', 'adeus',
    'до свидания', 'пока',
    'さようなら', 'じゃね',
    '再见', '拜拜',
    '안녕히 가세요', '잘가',
    'مع السلامة', 'وداعا',
    'अलविदा', 'फिर मिलेंगे',
    'tạm biệt',
    'ลาก่อน',
    'do widzenia', 'pa'
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

function KioskPage({ customization, onCustomize }) {
  const [disability, setDisability] = useState('none')
  const [language, setLanguage] = useState('english')
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [gesture, setGesture] = useState('idle')
  const [mood, setMood] = useState(customization.mood || 'neutral')

  // React to typing
  useEffect(() => {
    if (loading) {
      setGesture('thinking')
      setMood('thinking')
    } else if (answer) {
      setGesture('thumbsup')
      setMood('happy')
      const timer = setTimeout(() => {
        setGesture('idle')
      }, 2000)
      return () => clearTimeout(timer)
    } else if (error) {
      setMood('sad')
    }
  }, [loading, answer, error])

  // Detect gesture from query text
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
      const payload = {
        query: query.trim(),
        disability,
        language
      }

      const resp = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!resp.ok) {
        throw new Error('Request failed')
      }

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
    <main className="page kiosk-page">
      <header className="header">
        <div className="header-content">
          <div>
            <h1 className="title">Virtual Kiosk</h1>
            <p className="subtitle">Granite Accessible RAG Assistant</p>
          </div>
          <button className="customize-btn" onClick={onCustomize}>
            ⚙️ Customize Avatar
          </button>
        </div>
      </header>

      <div className="kiosk-layout">
        {/* Avatar Panel */}
        <section className="card avatar-panel">
          <div className="avatar-container">
            <Avatar 
              customization={customization} 
              gesture={gesture} 
              mood={mood} 
            />
          </div>
          <div className="avatar-status">
            {loading && <span className="status thinking">🤔 Thinking...</span>}
            {!loading && answer && <span className="status ready">✨ Here's your answer!</span>}
            {!loading && !answer && !error && <span className="status idle">👋 Ask me anything!</span>}
            {error && <span className="status error">😔 Something went wrong</span>}
          </div>
        </section>

        {/* Interaction Panel */}
        <div className="interaction-panel">
          <section className="card" aria-label="Ask the assistant">
            <div className="grid">
              <div className="field">
                <label htmlFor="disability">Accessibility Mode</label>
                <select
                  id="disability"
                  value={disability}
                  onChange={(e) => setDisability(e.target.value)}
                >
                  {DISABILITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="language">Language</label>
                <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="query">How can I help you today?</label>
              <textarea
                id="query"
                rows={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your question here... (Try saying 'Hello!' or 'Thank you!')"
              />
            </div>

            <button className="button" type="button" onClick={askAssistant} disabled={!canSubmit}>
              {loading ? '🔄 Processing...' : '💬 Ask Assistant'}
            </button>
          </section>

          <section className="card response-card" aria-live="polite" aria-busy={loading ? 'true' : 'false'}>
            <h2 className="panelTitle">Assistant Response</h2>
            {loading ? <p className="hint">The assistant is thinking...</p> : null}
            {error ? <p className="error">{error}</p> : null}
            {!loading && !error && !answer ? <p className="hint">Your answer will appear here.</p> : null}
            {answer ? <pre className="answer">{answer}</pre> : null}
          </section>
        </div>
      </div>

      <footer className="footer">
        <p>Powered by IBM Granite LLM • Supports {LANGUAGE_OPTIONS.length} languages</p>
      </footer>
    </main>
  )
}

export default function App() {
  const [page, setPage] = useState('kiosk')
  const [customization, setCustomization] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('avatarCustomization')
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMIZATION
  })

  // Save customization to localStorage
  useEffect(() => {
    localStorage.setItem('avatarCustomization', JSON.stringify(customization))
  }, [customization])

  if (page === 'customize') {
    return (
      <CustomizePage 
        customization={customization}
        setCustomization={setCustomization}
        onBack={() => setPage('kiosk')}
      />
    )
  }

  return (
    <KioskPage 
      customization={customization}
      onCustomize={() => setPage('customize')}
    />
  )
}
