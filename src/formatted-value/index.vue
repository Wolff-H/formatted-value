<template lang="pug">
    template(v-if="typeof comp === 'string'")
        span(
            ref="_ref"
            :class="getSpanClass('formatted-value--not-applicable')"
            :title="titled ? number : undefined"
        )
            |{{ placeholder !== undefined ? placeholder : comp }}
    template(v-else)
        span(
            ref="_ref"
            :class="getSpanClass('formatted-value--number')"
            :title="titled ? number : undefined"
        )
            |{{ comp.sign + comp.number }}
        span.percent-sign(v-if="comp.percentSign !== ''")
            |{{ comp.percentSign }}
        span.order-of-magnitude(v-if="comp.orderOfMagnitude !== ''")
            |{{ comp.orderOfMagnitude }}
</template>



<script lang="ts" setup>
import { computed, ref } from 'vue'
import { FORMATTED_VALUE_PROPS } from './formatted-value'
import toFormattedValueComposition from './toFormattedValueComposition'
import type { FormattedValueProps } from './types'

defineOptions({
    name: 'FormattedValue',
})

const props = defineProps(FORMATTED_VALUE_PROPS) as FormattedValueProps
const _ref = ref<HTMLSpanElement>()
const comp = computed(() => {
    return toFormattedValueComposition(props)
})

const directionClass = computed(() => {
    if (!props.directional || Number.isNaN(Number(props.number))) return ''
    if (typeof comp.value === 'string') return ''

    const number = Number(comp.value.number)

    return props.direction
        ? props.direction
        : number === 0
            ? ''
            : number > 0
                ? 'up'
                : 'down'
})

const getSpanClass = (baseClass: string) => {
    return [baseClass, `formatted-value--${directionClass.value}`]
}

defineExpose({
    /** @description span html element */
    ref: _ref,
    /** @description formatted result composition for the input number */
    composition: comp,
    /** @description carrying direction */
    directionClass,
})
</script>



<style lang="stylus">
.formatted-value
    > span.percent-sign
        color #999999 // $black50
.formatted-value--down
    color #237804 // $green60
.formatted-value--up
    color #ad2102 // $red60
.formatted-value--not-applicable
    color #b3b3b3 // $black30
</style>