<script setup lang="ts">
import FavoriteButton from '../ui/FavoriteButton.vue';
import { getFlagUrl, onFlagError } from '../../utils/flags'
import { computed } from 'vue';
import { numberFormat } from '../../utils/format.ts';
import { useFavorites } from '../../composables/useFavorites.ts';
import { getCurrencyName } from '../../utils/currencies.ts';

const { favorites } = useFavorites()
const props = defineProps<{
    primaryCurrency: string
    base: string
    amount: number
    subValue?: number
    isLoading: boolean
}>()
const emit = defineEmits(['enterPress'])
const display = computed(() => {
    if (!props.subValue) return null
    return {
        value: numberFormat.format(props.amount * props.subValue),
        rate: numberFormat.format(props.subValue)
    }
})
const isFavorite = computed(() =>
    favorites.value.some((f) => f.base === props.base && f.quote === props.primaryCurrency)
)
const toggleFavorites = () => {
    if (isFavorite.value) {
        favorites.value = favorites.value.filter(f => !(f.base === props.base && f.quote === props.primaryCurrency))
    } else {
        favorites.value.push({
            base: props.base,
            quote: props.primaryCurrency
        })
    }
}

</script>

<template>
    <div class="compare-item" tabindex="0" @keydown.enter="emit('enterPress')" @keydown.f.prevent="toggleFavorites">
        <img class="compare-item__flag" :src="getFlagUrl(props.primaryCurrency)" alt="" @error="onFlagError">
        <div class="compare-item__container">
            <p class="compare-item__primary-currency" aria-hidden="true">{{ props.primaryCurrency }}</p>
            <p class="compare-item__secondary-currency">{{ getCurrencyName(props.primaryCurrency) }}</p>
        </div>
        <div v-if="isLoading" class="compare-item__value-container">
            <div class="compare-item__skeleton--value"></div>
            <div class="compare-item__skeleton--sub-value"></div>
        </div>
        <div v-else-if="subValue && !isLoading" class="compare-item__value-container">
            <p class="compare-item__value">{{ display?.value }}</p>
            <p class="compare-item__sub-value">@ {{ display?.rate }}</p>
        </div>
        <div v-else-if="!isLoading" class="compare-item__value-container">
            <p class="compare-item__value">N/A</p>
            <p class="compare-item__sub-value">@ N/A</p>
        </div>
        <FavoriteButton
:is-favorited="isFavorite" :is-disabled="false" :icon-only="true" @click.stop="toggleFavorites"
            @keydown.enter.stop />
    </div>
</template>

<style lang="scss" scoped>
.compare-item {
    background-color: $neutral-600;
    box-shadow: inset 0 0 0 1px $neutral-500;
    border-radius: $radius-10;
    display: flex;
    align-items: center;
    gap: $spacing-125;
    padding: $spacing-150;
    cursor: pointer;
    border: none;
    outline: none;

    &:hover {
        box-shadow: inset 0 0 0 1px $neutral-300;
    }

    &:focus-visible {
        box-shadow: inset 0 0 0 1px $neutral-300, 0px 0px 0px 2px $neutral-900, 0px 0px 0px 4px $lime-500;
    }

    &__flag {
        height: 1.5rem;
    }

    &__container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: $spacing-075;
    }

    &__value-container {
        display: flex;
        flex-direction: column;
        gap: $spacing-075;
        text-align: end;
        align-items: flex-end
    }

    &__primary-currency {
        @include text-preset-4
    }

    &__secondary-currency {
        @include text-preset-5;
        color: $neutral-200
    }

    &__value {
        @include text-preset-3
    }

    &__sub-value {
        @include text-preset-6;
        color: $neutral-200
    }

    &__skeleton {

        &--value {
            width: 4rem;
            height: 1.2rem;
            background-color: $neutral-50;
            border-radius: $radius-full;
            opacity: 10%;
            animation: loading 2000ms cubic-bezier(0.7, 0.1, 0.5, 0.9) infinite;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }

        }

        &--sub-value {
            width: 3rem;
            height: 0.625rem;
            background-color: $neutral-200;
            border-radius: $radius-full;
            opacity: 10%;
            animation: loading 2000ms cubic-bezier(0.7, 0.1, 0.5, 0.9) infinite;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        }
    }

    @include tablet {
        gap: $spacing-250;
        padding: $spacing-150 $spacing-200
    }
}

@keyframes loading {
    50% {
        opacity: 5%;
    }
}
</style>