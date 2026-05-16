import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import CustomizePage from './CustomizePage'
import StarBackground from './StarBackground'
import { createHandWaveDetector, createAdvancedGestureDetector } from './vision'
import { DEFAULT_REACTION_SETTINGS, resolveInputReaction } from './reactionSignals'
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
  const [emotionBadge, setEmotionBadge] = useState('Neutral tone')
  const [emotionTone, setEmotionTone] = useState('neutral')
  const [currentAction, setCurrentAction] = useState('Idle')
  const [reactionSettings, setReactionSettings] = useState(() => {
    const saved = localStorage.getItem('reactionSettings')
    return saved ? JSON.parse(saved) : DEFAULT_REACTION_SETTINGS
  })
  const [cameraState, setCameraState] = useState('idle')
  const [cameraMessage, setCameraMessage] = useState('Camera is off. You can continue without it.')

  // Voice and Multimodal States
  const [isListening, setIsListening] = useState(false)
  const [autoTts, setAutoTts] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageBase64, setImageBase64] = useState('')

  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech Recognition is not supported in your browser.");
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setImageBase64('');
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const detectorRef = useRef(null)
  const gestureDetectorRef = useRef(null)
  const gestureResetRef = useRef(null)

  const stopVision = () => {
    if (detectorRef.current) {
      detectorRef.current.stop()
      detectorRef.current = null
    }

    if (gestureDetectorRef.current) {
      gestureDetectorRef.current.stop()
      gestureDetectorRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const reactToWave = () => {
    setGesture('hello')
    setMood('happy')
    setCurrentAction('Camera wave back')
    setCameraMessage('Wave detected. Waving back!')

    if (gestureResetRef.current) {
      clearTimeout(gestureResetRef.current)
    }

    gestureResetRef.current = setTimeout(() => {
      setGesture('idle')
      setCurrentAction('Idle')
      setCameraMessage('Camera is on. Wave anytime to get a wave back.')
    }, 1700)
  }

  const reactToShape = (shape) => {
    setGesture('thumbsup')
    setMood('happy')
    setCurrentAction(`Detected shape: ${shape}`)
    setCameraMessage(`You drew a ${shape}!`)

    if (gestureResetRef.current) {
      clearTimeout(gestureResetRef.current)
    }

    gestureResetRef.current = setTimeout(() => {
      setGesture('idle')
      setCurrentAction('Idle')
      setCameraMessage('Camera is on. Wave or draw a shape (circle/square/triangle).')
    }, 2500)
  }

  const reactToAdvancedGesture = (action) => {
    let message = "";
    if (action === "stop") message = "You signed 'Stop'. Pausing interaction.";
    if (action === "yes") message = "You signed 'Yes'. Confirming.";
    if (action === "no") message = "You signed 'No'. Canceling.";
    if (action === "repeat") message = "You signed 'Repeat'. Could you say that again?";
    if (action === "next") message = "You signed 'Next'. Moving on.";

    setGesture(action === 'stop' ? 'idle' : 'hello');
    setMood('neutral');
    setCurrentAction(`Gesture: ${action}`);
    setCameraMessage(message);

    if (gestureResetRef.current) {
      clearTimeout(gestureResetRef.current)
    }

    // Auto-read camera message for the visually impaired
    if (autoTts) {
       speakText(message);
    }

    gestureResetRef.current = setTimeout(() => {
      setGesture('idle')
      setCurrentAction('Idle')
      setCameraMessage('Camera is on. Show a gesture: open palm (stop), thumb up (yes), etc.')
    }, 3000)
  }

  const disableCamera = () => {
    stopVision()
    setCameraState('skipped')
    setCurrentAction('Camera disabled')
    setCameraMessage('Camera turned off. Chat is still fully available.')
  }

  const enableCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported')
      setCameraMessage('Camera access is not supported in this browser.')
      return
    }

    setCameraState('requesting')
    setCurrentAction('Requesting camera access')
    setCameraMessage('Waiting for your camera permission...')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })

      if (!videoRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        setCameraState('error')
        setCameraMessage('Camera started, but preview was unavailable. Please retry.')
        return
      }

      streamRef.current = stream
      videoRef.current.srcObject = stream
      await videoRef.current.play()

      detectorRef.current = await createHandWaveDetector({
        video: videoRef.current,
        onWave: reactToWave,
        onShape: reactToShape,
        onError: () => {
          setCameraMessage('Vision temporarily lost. Please keep your hand visible.')
        }
      })

      gestureDetectorRef.current = await createAdvancedGestureDetector({
        video: videoRef.current,
        onGesture: reactToAdvancedGesture,
        onError: () => {}
      })

      setCameraState('active')
      setCurrentAction('Camera active')
      setCameraMessage('Camera is on. Wave, draw a shape, or use gestures (open palm, thumb up/down).')
    } catch (err) {
      stopVision()

      if (err?.name === 'NotAllowedError' || err?.name === 'SecurityError') {
        setCameraState('denied')
        setCurrentAction('Camera denied by user')
        setCameraMessage('No problem. Camera stays off unless you choose to enable it later.')
      } else {
        setCameraState('error')
        setCurrentAction('Camera error')
        setCameraMessage('Could not start the camera right now. You can keep chatting without it.')
      }
    }
  }

  useEffect(() => {
    localStorage.setItem('reactionSettings', JSON.stringify(reactionSettings))
  }, [reactionSettings])

  const updateReactionSetting = (key, value) => {
    setReactionSettings((prev) => ({ ...prev, [key]: value }))
  }

  const resetReactionSettings = () => {
    setReactionSettings(DEFAULT_REACTION_SETTINGS)
    setCurrentAction('Reaction settings reset')
  }

  useEffect(() => {
    return () => {
      stopVision()
      if (gestureResetRef.current) {
        clearTimeout(gestureResetRef.current)
      }
    }
  }, [])

  // React to states
  useEffect(() => {
    if (loading) {
      setGesture('thinking')
      setMood('thinking')
      setCurrentAction('Thinking while generating answer')
    } else if (answer) {
      setGesture('thumbsup')
      setMood('happy')
      setCurrentAction('Answer delivered')
      const timer = setTimeout(() => setGesture('idle'), 2000)
      return () => clearTimeout(timer)
    } else if (error) {
      setMood('sad')
      setCurrentAction('Error state')
    }
  }, [loading, answer, error])

  // Detect gesture from query
  useEffect(() => {
    if (!query || loading) {
      setEmotionBadge('Neutral tone')
      setEmotionTone('neutral')
      if (!loading) {
        setCurrentAction('Idle')
      }
      return
    }

    const reaction = resolveInputReaction(query, customization.mood || 'neutral', reactionSettings)
    setMood(reaction.mood)
    setGesture(reaction.gesture)
    setEmotionBadge(reaction.badgeText)
    setEmotionTone(reaction.badgeTone)
    setCurrentAction(reaction.badgeText)

    if (reaction.gesture === 'hello' || reaction.gesture === 'goodbye' || reaction.gesture === 'thumbsup') {
      const timer = setTimeout(() => setGesture('idle'), 2500)
      return () => clearTimeout(timer)
    }
  }, [query, loading, customization.mood, reactionSettings])

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
        body: JSON.stringify({ query: query.trim(), disability, language, image_base64: imageBase64 || null })
      })

      if (!resp.ok) throw new Error('Request failed')

      const data = await resp.json()
      const returnedAnswer = String(data?.answer ?? '');
      setAnswer(returnedAnswer)
      
      if (autoTts) {
        speakText(returnedAnswer);
      }
      
      // Use gesture hint from backend (hello/goodbye/thanks/thumbsup)
      const backendGesture = data?.gesture || 'thumbsup'
      if (backendGesture === 'hello' || backendGesture === 'goodbye') {
        setGesture(backendGesture)
        setMood('happy')
      } else if (backendGesture === 'thanks') {
        setGesture('thumbsup')
        setMood('happy')
      } else {
        setGesture('thumbsup')
        setMood('happy')
      }
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
              <span className={`emotion-badge ${emotionTone}`}>
                {emotionBadge}
              </span>
              <span className="action-readout">Current action: {currentAction}</span>
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

          <div className="camera-section glass-card">
            <h3>Camera Gestures (Optional)</h3>
            <p className="camera-help">
              Enable camera access if you want to wave at the assistant and get a live wave back.
              If you say no, everything still works normally.
            </p>

            <div className="camera-actions">
              {cameraState !== 'active' && (
                <button
                  className="submit-btn"
                  onClick={enableCamera}
                  disabled={cameraState === 'requesting'}
                >
                  {cameraState === 'requesting' ? 'Requesting Access...' : 'Enable Camera'}
                </button>
              )}

              <button className="subtle-btn" onClick={disableCamera}>
                {cameraState === 'active' ? 'Turn Off Camera' : 'Not Now'}
              </button>
            </div>

            <p className={`camera-message ${cameraState}`}>{cameraMessage}</p>

            <video
              ref={videoRef}
              className="camera-preview"
              autoPlay
              muted
              playsInline
              aria-label="Camera preview for gesture detection"
            />
          </div>

          <div className="reaction-dashboard glass-card">
            <h3>Reaction Dashboard</h3>
            <p className="camera-help">Live reaction controls and the full action map for this avatar.</p>

            <div className="dashboard-grid">
              <div className="dashboard-block">
                <h4>Supported Actions</h4>
                <ul className="action-list">
                  <li>Camera wave detected: avatar waves hello</li>
                  <li>Greeting text: hello wave animation</li>
                  <li>Goodbye text: goodbye wave animation</li>
                  <li>Thanks text: thumbs-up animation</li>
                  <li>Question text: thinking mood and pose</li>
                  <li>Sad tone text: sad mood</li>
                  <li>Offensive tone text: sad/protective mood</li>
                  <li>Mixed negative question: sad plus thinking blend</li>
                  <li>During backend response: thinking action</li>
                  <li>Answer delivered: happy thumbs-up</li>
                  <li>Error state: sad fallback</li>
                </ul>
              </div>

              <div className="dashboard-block">
                <h4>Sensitivity Settings</h4>
                <div className="settings-grid">
                  <label className="toggle-item">
                    <input
                      type="checkbox"
                      checked={reactionSettings.enableGreetings}
                      onChange={(e) => updateReactionSetting('enableGreetings', e.target.checked)}
                    />
                    Enable greetings and thanks detection
                  </label>

                  <label className="toggle-item">
                    <input
                      type="checkbox"
                      checked={reactionSettings.enableQuestionDetection}
                      onChange={(e) => updateReactionSetting('enableQuestionDetection', e.target.checked)}
                    />
                    Enable question detection
                  </label>

                  <label className="toggle-item">
                    <input
                      type="checkbox"
                      checked={reactionSettings.enableSadTone}
                      onChange={(e) => updateReactionSetting('enableSadTone', e.target.checked)}
                    />
                    Enable sad tone detection
                  </label>

                  <label className="toggle-item">
                    <input
                      type="checkbox"
                      checked={reactionSettings.enableOffensiveTone}
                      onChange={(e) => updateReactionSetting('enableOffensiveTone', e.target.checked)}
                    />
                    Enable offensive tone detection
                  </label>

                  <label htmlFor="helloWords">Greeting words (comma-separated)</label>
                  <textarea
                    id="helloWords"
                    className="settings-input"
                    value={reactionSettings.helloWordsText}
                    onChange={(e) => updateReactionSetting('helloWordsText', e.target.value)}
                    rows={2}
                  />

                  <label htmlFor="goodbyeWords">Goodbye words (comma-separated)</label>
                  <textarea
                    id="goodbyeWords"
                    className="settings-input"
                    value={reactionSettings.goodbyeWordsText}
                    onChange={(e) => updateReactionSetting('goodbyeWordsText', e.target.value)}
                    rows={2}
                  />

                  <label htmlFor="thanksWords">Thanks words (comma-separated)</label>
                  <textarea
                    id="thanksWords"
                    className="settings-input"
                    value={reactionSettings.thanksWordsText}
                    onChange={(e) => updateReactionSetting('thanksWordsText', e.target.value)}
                    rows={2}
                  />

                  <label htmlFor="questionWords">Question words (comma-separated)</label>
                  <textarea
                    id="questionWords"
                    className="settings-input"
                    value={reactionSettings.questionWordsText}
                    onChange={(e) => updateReactionSetting('questionWordsText', e.target.value)}
                    rows={2}
                  />

                  <label htmlFor="sadWords">Sad tone words (comma-separated)</label>
                  <textarea
                    id="sadWords"
                    className="settings-input"
                    value={reactionSettings.sadnessWordsText}
                    onChange={(e) => updateReactionSetting('sadnessWordsText', e.target.value)}
                    rows={2}
                  />

                  <label htmlFor="offensiveWords">Offensive words (comma-separated)</label>
                  <textarea
                    id="offensiveWords"
                    className="settings-input"
                    value={reactionSettings.offensiveWordsText}
                    onChange={(e) => updateReactionSetting('offensiveWordsText', e.target.value)}
                    rows={2}
                  />

                  <button className="subtle-btn" onClick={resetReactionSettings}>Reset Defaults</button>
                </div>
              </div>
            </div>
          </div>

          <div className="query-section glass-card">
            <div className="voice-toggles" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={autoTts}
                  onChange={(e) => setAutoTts(e.target.checked)}
                />
                🔊 Auto-read answers aloud
              </label>
              <div className="multimodal-upload">
                <label className="subtle-btn" style={{ cursor: 'pointer' }}>
                  📷 Upload Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {selectedImage && <span style={{ marginLeft: '10px', fontSize: '0.9em' }}>{selectedImage.name}</span>}
              </div>
            </div>

            <label htmlFor="query">How can I help you today?</label>
            <div className="query-input-row" style={{ display: 'flex', gap: '10px' }}>
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your question here... (Questions trigger thinking, tone can change mood)"
                rows={3}
                style={{ flex: 1 }}
              />
              <button 
                className={`mic-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
                title="Speak your question"
                style={{ background: isListening ? '#f44336' : 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '15px', cursor: 'pointer', fontSize: '1.5rem', alignSelf: 'center' }}
              >
                🎙️
              </button>
            </div>
            
            <button 
              className="submit-btn" 
              onClick={askAssistant} 
              disabled={!canSubmit}
              style={{ marginTop: '15px' }}
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
