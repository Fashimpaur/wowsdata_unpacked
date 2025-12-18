import React, {useEffect, useState} from 'react'

export function App() {
    const [health, setHealth] = useState<string>('checking...')
    const [gameDir, setGameDir] = useState<string>('')
    const [loadResult, setLoadResult] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        fetch('/api/v1/health')
            .then((r) => r.json())
            .then((j) => setHealth(j.status || 'unknown'))
            .catch(() => setHealth('error'))
    }, [])

    return (
        <main style={{fontFamily: 'system-ui, sans-serif', padding: 24}}>
            <h1>Starter Web</h1>
            <p>
                API health: <strong data-testid="health">{health}</strong>
            </p>

            <section style={{marginTop: 24}}>
                <h2>Load Game Directory</h2>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault()
                        setError('')
                        setLoadResult('')
                        if (!gameDir.trim()) {
                            setError('Please enter a game directory')
                            return
                        }
                        try {
                            setLoading(true)
                            const resp = await fetch(`/api/v1/load/${encodeURIComponent(gameDir)}`)
                            const data = await resp.json()
                            setLoadResult(JSON.stringify(data))
                        } catch (err) {
                            setError('Failed to call load endpoint')
                        } finally {
                            setLoading(false)
                        }
                    }}
                    style={{display: 'flex', gap: 8, alignItems: 'center'}}
                >
                    <input
                        aria-label="game-directory"
                        placeholder="Enter game directory path"
                        value={gameDir}
                        onChange={(e) => setGameDir(e.target.value)}
                        style={{minWidth: 320, padding: 6}}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Load'}
                    </button>
                </form>
                {error && (
                    <p role="alert" style={{color: 'crimson'}}>
                        {error}
                    </p>
                )}
                {loadResult && (
                    <pre data-testid="load-result" style={{marginTop: 12, background: '#f6f8fa', padding: 12}}>
{loadResult}
                    </pre>
                )}
            </section>
        </main>
    )
}
