<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { numberFormat } from '../../utils/format.ts';
import CompareItem from './CompareItem.vue';
import FrankfurterAPI from '../../services/FrankfurterAPI.ts';
import UnavailableMessage from '../ui/UnavailableMessage.vue';
import { useFavorites } from '../../composables/useFavorites.ts';
import { onKeyStroke } from '@vueuse/core';
import { nextTick } from 'vue';

const groupRef = ref<HTMLElement | null>(null)
onKeyStroke(['ArrowDown', 'ArrowUp'], (e) => {
    if (!groupRef.value?.contains(document.activeElement)) return
    e.preventDefault()
    const items = Array.from(groupRef.value.querySelectorAll('.compare-item'))
    const current = items.indexOf(document.activeElement as Element)
    const offset = e.key === 'ArrowDown' ? 1 : -1
    const next = (current + offset + items.length) % items.length
    nextTick(() => (items[next] as HTMLElement | undefined)?.focus())
})
const { favorites } = useFavorites()
const props = defineProps<{
    send: string
    receive: string
    amount: number
}>()
const isLoading = ref(true)
const currencies = ref(['USD', 'EUR', 'JPY', 'GBP', 'CNY', 'CHF', 'AUD', 'CAD'])
const filteredCurrencies = computed(() => {
    const base = currencies.value.filter(c => c !== props.receive && c !== props.send)
    const pins = favorites.value
        .filter(f => f.base === props.send)
        .map(f => f.quote)
        .filter(q => q !== props.receive)
    return [...new Set([...base, ...pins])]
})

const rates = ref<Record<string, number>>({})
const emit = defineEmits(['selectCurrency'])
watch(() => props.send, async (newSend) => {
    isLoading.value = true
    try {
        rates.value = {}
        const response = await FrankfurterAPI.getCompare(newSend)
        rates.value = Object.fromEntries(response.data.map(item => [item.quote, item.rate]))
    } catch (err) {
        console.error(err)
    } finally {
        isLoading.value = false
    }
}, { immediate: true })
</script>

<template>
    <UnavailableMessage v-if="props.amount === 0" text-width="28.75rem">
        <template #header>No comparison available</template>
        <template #text>Enter an amount in SEND above to see what your money is worth in other
            currencies.</template>
    </UnavailableMessage>
    <div v-else ref="groupRef" class="compare">
        <div class="compare__header">
            <p class="compare__left">Multi currency<span class="compare__left--big">{{
                numberFormat.format(props.amount) }} from {{ props.send
                    }}</span></p>
            <p class="compare__right">{{ filteredCurrencies.length }} pairs</p>
        </div>
        <div v-for="c in filteredCurrencies" :key="c" class="compare__items">
            <CompareItem
:primary-currency="c" :sub-value="rates[c]" :base="send" :amount="amount"
                :is-loading="isLoading" @enter-press="emit('selectCurrency', c)" @click="emit('selectCurrency', c)" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.compare {
    display: flex;
    flex-direction: column;
    gap: $spacing-200;
    padding: $spacing-200;
    background-color: $neutral-700;
    box-shadow: inset 0 0 0 1px $neutral-600;
    border-radius: $radius-16;

    &__header {
        display: flex;
        flex-direction: column;
        gap: $spacing-125;
        text-transform: uppercase
    }

    &__left {
        @include text-preset-4;
        color: $neutral-200;

        &--big {
            margin-left: $spacing-150;
            @include text-preset-3-medium;
            color: $neutral-50
        }
    }

    &__right {
        @include text-preset-5;
        opacity: 70%;
    }

    &__items {
        display: flex;
        flex-direction: column;
        gap: $spacing-150;
    }

    @include tablet {
        gap: $spacing-250;
        padding: $spacing-250;

        &__header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }

    }
}
</style>