import React, { useEffect, useState } from 'react'

export function App() {
  const [health, setHealth] = useState<string>('checking...')

  useEffect(() => {
    fetch('/api/v1/health')
      .then((r) => r.json())
      .then((j) => setHealth(j.status || 'unknown'))
      .catch(() => setHealth('error'))
  }, [])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Starter Web</h1>
      <p>
        API health: <strong data-testid="health">{health}</strong>
      </p>
    </main>
  )
}
