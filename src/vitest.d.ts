import 'vitest'

interface CustomMatchers<R = unknown> {
    toDisplayRotaSpreadsheetLinkWithUrl: (expectedSpreadsheetUrl: string) => R
}

declare module 'vitest' {
    interface Assertion<T = any> extends CustomMatchers<T> {
    }

    interface AsymmetricMatchersContaining extends CustomMatchers {
    }
}