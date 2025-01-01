import {defineConfig} from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
    test: {
        globals: true,
        setupFiles: ['./src/vitest-setup.ts']
    }
})
