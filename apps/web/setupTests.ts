import '@testing-library/jest-dom'
import {afterEach, vi} from 'vitest'
import {cleanup} from '@testing-library/react'

// Reset DOM and mocks between tests
afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
})
