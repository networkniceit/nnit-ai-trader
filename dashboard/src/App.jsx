import { useEffect, useState } from 'react'
import './App.css'

const API = import.meta.env.VITE_API_URL || 'https://nnit-ai-trader-production.up.railway.app'

function App() {
  const [status, setStatus] = useState(null)
  const [portfolio, setPortfolio] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statusRes, portfolioRes] = await Promise.all([
          fetch(`${API}/status`),
          fetch(`${API}/api/portfolio`)
        ])

        if (!statusRes.ok || !portfolioRes.ok) {
          throw new Error('Backend request failed')
        }

        setStatus(await statusRes.json())
        setPortfolio(await portfolioRes.json())
        setError(null)
      } catch (err) {
        setError(err.message)
      }
    }

    loadDashboard()
    const timer = setInterval(loadDashboard, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="dashboard">
      <header>
        <h1>NNIT AI TRADER</h1>
        <span className={error ? 'offline' : 'online'}>
          {error ? 'OFFLINE' : 'ONLINE'}
        </span>
      </header>

      {error && (
        <div className="error">
          Backend connection error: {error}
        </div>
      )}

      <section className="cards">
        <div className="card">
          <h3>BOT STATUS</h3>
          <strong>{status?.status || '...'}</strong>
        </div>

        <div className="card">
          <h3>UPTIME</h3>
          <strong>
            {status ? `${Math.floor(status.uptime)} sec` : '...'}
          </strong>
        </div>

        <div className="card">
          <h3>CASH</h3>
          <strong>
            {portfolio?.cash !== undefined
              ? `$${Number(portfolio.cash).toFixed(2)}`
              : '...'}
          </strong>
        </div>

        <div className="card">
          <h3>P&amp;L</h3>
          <strong>
            {portfolio?.pnl !== undefined
              ? `$${Number(portfolio.pnl).toFixed(2)}`
              : '...'}
          </strong>
        </div>
      </section>

      <section className="panel">
        <h2>PORTFOLIO</h2>
        {portfolio ? (
          <pre>{JSON.stringify(portfolio, null, 2)}</pre>
        ) : (
          <p>Waiting for portfolio data...</p>
        )}
      </section>
    </div>
  )
}

export default App
