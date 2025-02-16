export const FORMATTED_VALUE_PROPS = {
    number: {
        type: [Number, String],
        required: true,
    },
    sign: {
        type: Boolean,
        default: undefined,
    },
    directional: Boolean,
    thousandsSeparator: Boolean,
    positiveSign: Boolean,
    percentage: Boolean,
    percentSign: Boolean,
    percentSignSpace: Boolean,
    direction: {
        type: String as () => 'down' | '' | 'up',
        default: '',
    },
    decimals: {
        type: [
            Object as () => [
                bit: number,
                method: 'floor' | 'round' | 'ceil' | undefined
            ],
            Number,
        ],
        default: undefined,
    },
    titled: Boolean,
    orderOfMagnitude: {
        type: Object as () => number | number[],
        default: undefined,
    },
    magnitudeDecimals: {
        type: Object as () => Record<
            number,
            number | [bit: number, method: 'floor' | 'round' | 'ceil' | undefined]
        >,
        default: undefined,
    },
    fallback: {
        type: Object as () => [tester: (numstr: string) => boolean, output: string],
        default: undefined,
    },
    fallbackBy: {
        type: Object as (number: string) => string | undefined | void,
        default: undefined,
    },
}
