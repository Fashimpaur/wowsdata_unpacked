import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('shows API health from /api/v1/health', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ok' }),
    } as any)

    render(<App />)
    expect(screen.getByTestId('health').textContent).toMatch(/checking/i)

    await waitFor(() => expect(screen.getByTestId('health').textContent).toBe('ok'))
  })
})
