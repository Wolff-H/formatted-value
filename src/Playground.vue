<template lang="pug">
#playground
    formatted-value(number="1234567890")
    br
    formatted-value(:number="number")
    br
    formatted-value(:number="31415926535"
        :decimals="0"
        :order-of-magnitude="[4, 8]"
        :magnitude-decimals="{ 4: 2, 8: 4 }"
    )
    br
    formatted-value(:number="3.1415926"
        directional
    )
    br
    formatted-value(:number="3.1415926")
    br
    formatted-value(:number="-3.1415926"
        directional
    )
</template>



<script setup lang="ts">
import { ref } from "vue"
import FormattedValue from "./formatted-value"

const number = ref(3.1415926)
</script>



<style lang="stylus">
// 
</style>
