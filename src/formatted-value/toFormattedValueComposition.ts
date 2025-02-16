import type { FormattedValueProps, CompositionOutput, OrderOfMagnitude } from './types'

const dictOrderOfMagnitude =
{
    0: '',
    1: '十',
    2: '百',
    3: '千',
    4: '万',
    5: '十万',
    6: '百万',
    7: '千万',
    8: '亿',
    9: '十亿',
    10: '百亿',
    11: '千亿',
    12: '万亿',
    13: '兆',
} satisfies Record<OrderOfMagnitude, string>

function getNumberOrderOfMagnitude(
    number: number,
    orders: OrderOfMagnitude | OrderOfMagnitude[]
):
{
    value: number
    order: OrderOfMagnitude
    satisfied: boolean
}
{
    if (Array.isArray(orders))
    {
        const ordersSorted = [...orders].sort((a, b) => b - a)
        for (const order of ordersSorted)
        {
            const transformed = number / 10 ** order
            if (Math.abs(transformed) >= 1)
            {
                return {
                    value: transformed,
                    order,
                    satisfied: true,
                }
            }
        }
        return {
            value: number,
            order: 0,
            satisfied: false,
        }
    }
    else
    {
        const order = orders
        return {
            value: number / 10 ** order,
            order: order,
            satisfied: true,
        }
    }
}

function getConfigTuple(
    config: number | [number, 'floor' | 'round' | 'ceil' | undefined]
): [number, 'floor' | 'round' | 'ceil']
{
    const configTuple = [0, 'round'] as [number, 'floor' | 'round' | 'ceil']
    
    if (typeof config === 'number')
    {
        configTuple[0] = config
    }
    else
    {
        configTuple[0] = config?.[0] || 0
        configTuple[1] = config?.[1] || 'round'
    }
    
    return configTuple
}

function formatNumberString(
    number_raw: number,
    bit: number,
    method: 'floor' | 'round' | 'ceil',
    percentage?: boolean
): string
{
    return (Math[method](number_raw * (percentage ? 100 : 1) * 10 ** bit) / 10 ** bit).toFixed(bit)
}

function formattedNumberString(props: FormattedValueProps)
{
    if (typeof props.number !== 'number') return props.number

    let number_raw = (
        (props.sign === undefined ? true : props.sign)
            ? props.number
            : Math.abs(props.number!)
    )!

    if (props.orderOfMagnitude)
    {
        number_raw = getNumberOrderOfMagnitude(
            number_raw,
            props.orderOfMagnitude as OrderOfMagnitude | OrderOfMagnitude[],
        ).value
    }

    let number_string = `${number_raw}`

    // 处理小数位。 //
    // 如果数值在超过其数量级上有定义小数保留方式，则使用给定的小数保留方式。 //
    const magnitude = Math.floor(Math.log10(props.number))
    const sorted_defined_magnitude = Object.keys(props.magnitudeDecimals || {})
        .map((key) => +key)
        .slice()
        .sort()
        .reverse()

    let max_satisfied_defined_magnitude = 0

    for (const n of sorted_defined_magnitude)
    {
        if (n <= magnitude)
        {
            max_satisfied_defined_magnitude = n
            break
        }
    }

    if (
        props.magnitudeDecimals?.[max_satisfied_defined_magnitude] &&
        max_satisfied_defined_magnitude !== 0
    )
    {
        const [bit, method] = getConfigTuple(
            props.magnitudeDecimals[max_satisfied_defined_magnitude]
        )
        number_string = formatNumberString(number_raw, bit, method, props.percentage)
    }

    // 如果没有数量级小数保留定义，但有通用小数保留定义，使用通用小数保留定义。 //
    else if (props.decimals !== undefined)
    {
        const [bit, method] = getConfigTuple(props.decimals)
        number_string = formatNumberString(number_raw, bit, method, props.percentage)
    }

    if (props.thousandsSeparator)
    {
        const nfObj = new Intl.NumberFormat('en-US')

        if (number_string.includes('.'))
        {
            const [integerPart, decimalPart] = number_string.split('.')
            number_string = `${nfObj.format(Number(integerPart))}.${decimalPart}`
        }
        else
        {
            number_string = nfObj.format(Number(number_string))
        }
    }

    return number_string
}

export default function toFormattedValueComposition(arg1: FormattedValueProps): CompositionOutput
{
    // 正规化 props //
    const props = { ...arg1 }

    // 检查兜底 //
    if (props.fallbackBy)
    {
        // 优先使用 fallbackBy 函数式兜底 //
        const fallback_result = props.fallbackBy(String(props.number))

        if (typeof fallback_result === 'string') return fallback_result
        else props.number = Number(props.number)
    }
    else
    {
        // 默认使用 fallback 断言式兜底 //
        let _fallback = [
            (numstr: string) => ['', '-', 'null', 'undefined'].includes(numstr),
            '-',
        ] as Required<FormattedValueProps>['fallback']

        if (props.fallback) _fallback = props.fallback

        const [_fallback_tester, _fallback_output] = _fallback

        if (_fallback_tester(String(props.number)))
        {
            return _fallback_output
        }
        else
        {
            props.number = Number(props.number)
        }
    }

    const output_part_sign =
        [undefined, true].includes(props.sign) &&
        props.positiveSign &&
        props.number > 0
            ? '+'
            : ''

    const output_part_number =
        typeof props.number === 'number'
            ? formattedNumberString(props)
            : '-'

    const output_part_percentSign =
        props.percentSign || (typeof props.number === 'number' && props.percentage)
            ? `${props.percentSignSpace === false ? '%' : ' %'}`
            : ''

    let output_part_orderOfMagnitude = ''

    if (props.orderOfMagnitude && typeof props.number === 'number')
    {
        const magnitudeOrdered = getNumberOrderOfMagnitude(
            props.number,
            props.orderOfMagnitude as OrderOfMagnitude | OrderOfMagnitude[],
        )
        output_part_orderOfMagnitude = magnitudeOrdered.satisfied
            ? dictOrderOfMagnitude[magnitudeOrdered.order as OrderOfMagnitude]
            : ''
    }

    const output = {
        sign: output_part_sign,
        number: output_part_number,
        percentSign: output_part_percentSign,
        orderOfMagnitude: output_part_orderOfMagnitude,
    }

    return output
}
