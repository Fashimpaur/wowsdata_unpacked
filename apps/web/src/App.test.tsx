import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {vi} from 'vitest'
import {App} from './App'

describe('App', () => {
    it('shows API health from /api/v1/health', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => ({status: 'ok'}),
        } as any)

        render(<App/>)
        expect(screen.getByTestId('health').textContent).toMatch(/checking/i)

        await waitFor(() => expect(screen.getByTestId('health').textContent).toBe('ok'))
    })

    it('calls load endpoint and renders JSON result', async () => {
        // First call is for health
        vi.spyOn(global, 'fetch')
            .mockResolvedValueOnce({json: async () => ({status: 'ok'})} as any)
            // Second call is for load
            .mockResolvedValueOnce({json: async () => ({message: 'loaded', dir: 'C:/Games/WoWS'})} as any)

        render(<App/>)

        const input = screen.getByLabelText('game-directory') as HTMLInputElement
        fireEvent.change(input, {target: {value: 'C:/Games/WoWS'}})

        const button = screen.getByRole('button', {name: /load/i})
        fireEvent.click(button)

        await waitFor(() => expect(screen.getByTestId('load-result').textContent).toMatch(/loaded/))
    })
})
