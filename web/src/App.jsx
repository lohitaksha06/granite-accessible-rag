import React, { useState } from 'react'

const DISABILITY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'blind', label: 'Blind' },
  { value: 'deaf', label: 'Deaf' },
  { value: 'cognitive', label: 'Cognitive' }
]

const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' }
]

export default function App() {
  const [disability, setDisability] = useState('none')
  const [language, setLanguage] = useState('english')
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = query.trim().length > 0 && !loading

  async function askAssistant() {
    setError('')
    setAnswer('')
    setLoading(true)

    try {
      const payload = {
        query: query.trim(),
        disability,
        language
      }

      const resp = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!resp.ok) {
        throw new Error('Request failed. Please try again.')
      }

      const data = await resp.json()
      setAnswer(String(data?.answer ?? ''))
    } catch {
      setError('Sorry — I could not reach the assistant. Please check the backend and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <header className="header">
        <h1 className="title">Virtual Kiosk</h1>
        <p className="subtitle">Granite Accessible RAG</p>
      </header>

      <section className="card" aria-label="Ask the assistant">
        <div className="grid">
          <div className="field">
            <label htmlFor="disability">Disability</label>
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
            placeholder="Type your question here"
          />
        </div>

        <button className="button" type="button" onClick={askAssistant} disabled={!canSubmit}>
          {loading ? 'Thinking…' : 'Ask Assistant'}
        </button>
      </section>

      <section className="card" aria-live="polite" aria-busy={loading ? 'true' : 'false'}>
        <h2 className="panelTitle">Assistant Response</h2>
        {loading ? <p className="hint">Thinking…</p> : null}
        {error ? <p className="error">{error}</p> : null}
        {!loading && !error && !answer ? <p className="hint">Your answer will appear here.</p> : null}
        {answer ? <pre className="answer">{answer}</pre> : null}
      </section>

      <footer className="footer">
        <p>
          Backend: <code>POST /ask</code> on <code>http://127.0.0.1:8000</code>
        </p>
      </footer>
    </main>
  )
}
