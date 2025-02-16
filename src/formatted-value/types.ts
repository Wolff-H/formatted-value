export type FormattedValueProps =
{
    number: number | string
    sign?: boolean
    directional?: boolean
    thousandsSeparator?: boolean
    positiveSign?: boolean
    percentage?: boolean
    percentSign?: boolean
    percentSignSpace?: boolean
    direction?: 'down' | '' | 'up'
    decimals?:
        | number
        | [bit: number, method: 'floor' | 'round' | 'ceil' | undefined]
    titled?: boolean
    orderOfMagnitude?: number | number[] // OrderOfMagnitude | OrderOfMagnitude[]
    magnitudeDecimals?: Record<
        number,
        number | [bit: number, method: 'floor' | 'round' | 'ceil' | undefined]
    >
    fallback?: [tester: (numstr: string) => boolean, output: string]
    fallbackBy?: (number: string) => string | undefined | void
}

export type CompositionOutput = string | {
    sign: string
    number: string
    percentSign: string
    orderOfMagnitude: string
}

export type OrderOfMagnitude = 0 | 2 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13