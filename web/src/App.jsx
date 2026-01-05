import React, { useMemo, useState } from 'react'

const DISABILITY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'blind', label: 'Blind / Low-vision' },
  { value: 'deaf', label: 'Deaf / Hard-of-hearing' },
  { value: 'cognitive', label: 'Cognitive-friendly' }
]

const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'spanish', label: 'Spanish' }
]

export default function App() {
  const [disability, setDisability] = useState('blind')
  const [language, setLanguage] = useState('english')
  const [query, setQuery] = useState('How can blind users navigate systems?')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => query.trim().length > 0 && !loading, [query, loading])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setAnswer('')
    setLoading(true)

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
        const text = await resp.text()
        throw new Error(`Request failed (${resp.status}): ${text}`)
      }

      const data = await resp.json()
      setAnswer(data.answer ?? '')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
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

      <form className="card" onSubmit={onSubmit}>
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
          <label htmlFor="query">How can I help you?</label>
          <textarea
            id="query"
            rows={4}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your question here..."
          />
        </div>

        <button className="button" type="submit" disabled={!canSubmit}>
          {loading ? 'Asking…' : 'Ask'}
        </button>
      </form>

      <section className="card" aria-live="polite" aria-busy={loading ? 'true' : 'false'}>
        <h2 className="panelTitle">Response</h2>
        {error ? <p className="error">{error}</p> : null}
        {answer ? <pre className="answer">{answer}</pre> : <p className="hint">Your answer will appear here.</p>}
      </section>

      <footer className="footer">
        <p>
          Backend: <code>POST /ask</code> on <code>http://127.0.0.1:8000</code>
        </p>
      </footer>
    </main>
  )
}
