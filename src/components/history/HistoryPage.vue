<script setup lang="ts">
import { onWatcherCleanup, ref, watch } from 'vue';
import FrankfurterAPI from '../../services/FrankfurterAPI.ts';
import ConversionStats from './ConversionStats.vue';
import { numberFormat } from '../../utils/format.ts';
import RangeButtons from './RangeButtons.vue';
import AreaChart from './AreaChart.vue';
import UnavailableMessage from '../ui/UnavailableMessage.vue';

const props = defineProps<{
    send: string
    receive: string
}>()
const openValue = ref('0')
const lastValue = ref('0')
const changeValue = ref('0')
const changePercentage = ref('▲ +0.00%')
const isIncrease = ref<1 | 2>(2)
const isLoading = ref(true)
const isChartLoading = ref(true)
const rangeValue = ref('1d')
const hasData = ref(false)

watch([() => props.send, () => props.receive], async ([newSend, newReceive]) => {
    let cancelled = false
    isLoading.value = true
    hasData.value = false
    onWatcherCleanup(() => { cancelled = true })
    try {
        const ratesResponse = await FrankfurterAPI.getRates(newSend, newReceive);
        if (cancelled) return
        if (!ratesResponse.data.length) return
        hasData.value = ratesResponse.data.length > 0
        // getting open value
        const today = ratesResponse.data[0].date;
        const date = new Date(today);
        date.setUTCDate(date.getUTCDate() - 1);
        const yesterday = date.toISOString().split("T")[0];
        const previousRequests =
            await FrankfurterAPI.getRates(newSend, newReceive, yesterday)
        if (cancelled) return
        if (!previousRequests.data.length) return
        const open = previousRequests.data[0].rate
        openValue.value = numberFormat.format(open)
        // getting last value
        const last = ratesResponse.data[0].rate
        lastValue.value = numberFormat.format(last)
        // getting change value
        const change = last - open
        changeValue.value = `${change >= 0 ? '+' : ''}${change.toFixed(4)}`
        // getting change percentage
        const changePer = (change / open) * 100
        changePercentage.value = `${change >= 0 ? '▲ +' : '▼ '}${changePer.toFixed(2)}%`
        //getting differences
        isIncrease.value = change >= 0 ? 2 : 1
    } catch (err) {
        console.error(err)
    } finally {
        if (!cancelled) isLoading.value = false
    }
}, { immediate: true })

</script>

<template>
    <UnavailableMessage v-if="!isLoading && !hasData">
        <template #header>No chart data available</template>
        <template #text>We couldn't load rate history for {{ send }}/{{ receive }} right now.<br />This usually
            clears up in a
            minute.</template>
    </UnavailableMessage>
    <div v-else class="history">
        <div class="history__container">
            <div class="history__stats">
                <ConversionStats title="Open" :value="openValue" :is-loading="isLoading" />
                <ConversionStats title="Last" :value="lastValue" :is-loading="isLoading" />
                <ConversionStats
title="Change" :value="changeValue" :is-loading="isLoading"
                    :is-increase="isIncrease" />
                <ConversionStats
title="% Change" :value="changePercentage" :is-loading="isLoading"
                    :is-increase="isIncrease" />
            </div>
            <RangeButtons :selected-range="rangeValue" @range="(value) => rangeValue = value" />
        </div>
        <AreaChart
:send="props.send" :receive="props.receive" :range="rangeValue" :rate="lastValue"
            @is-loading="(value) => isChartLoading = value" />
    </div>
</template>

<style lang="scss" scoped>
.history {
    display: flex;
    flex-direction: column;
    gap: $spacing-200;

    &__container {
        display: flex;
        flex-direction: column;
        gap: $spacing-250;
    }

    &__stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: $spacing-125;
    }

    @include tablet {
        &__stats {
            display: flex;
            gap: $spacing-200;
        }
    }

    @include desktop {
        &__container {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
    }
}
</style>