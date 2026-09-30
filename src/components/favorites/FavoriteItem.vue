<script setup lang="ts">
import ArrowRight from '@/assets/icons/icon-arrow-right.svg'
import FavoriteButton from '../ui/FavoriteButton.vue';
import { computed, onMounted, ref } from 'vue';
import { useFavorites } from '../../composables/useFavorites.ts';
import FrankfurterAPI from '../../services/FrankfurterAPI.ts';
import { numberFormat } from '../../utils/format.ts';
import { getCurrencyName } from '../../utils/currencies.ts';

const { favorites } = useFavorites()
const isLoading = ref(true)
const props = defineProps<{
    send: string
    receive: string
}>()
const emit = defineEmits(['interact'])
const rates = ref(0)
const change = ref(0)
const isFavorite = computed(() =>
    favorites.value.some((f) => f.base === props.send && f.quote === props.receive)
)
const toggleFavorites = () => {
    if (isFavorite.value) {
        favorites.value = favorites.value.filter(f => !(f.base === props.send && f.quote === props.receive))
    } else {
        favorites.value.push({
            base: props.send,
            quote: props.receive
        })
    }
}

onMounted(async () => {
    isLoading.value = true
    try {
        const response = await FrankfurterAPI.getRates(props.send, props.receive)
        rates.value = response.data[0]?.rate
        const today = response.data[0]?.date
        const date = new Date(today);
        date.setUTCDate(date.getUTCDate() - 1);
        const yesterday = date.toISOString().split("T")[0];
        const previousResponse = await FrankfurterAPI.getRates(props.send, props.receive, yesterday)
        const previousRates = previousResponse.data[0]?.rate
        change.value = ((rates.value - previousRates) / previousRates) * 100
    } catch (err) {
        console.error(err)
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <div
class="favorite-item" tabindex="0" @click="emit('interact', { send: props.send, receive: props.receive })"
        @keydown.enter="emit('interact', { send: props.send, receive: props.receive })"
        @keydown.f.prevent="toggleFavorites">
        <p class="favorite-item__currency-pair">
            <span aria-hidden="true" class="favorite-item__currencies">
                {{ send }}<img :src="ArrowRight" alt="to">{{ receive }}
            </span>
            <span class="sr-only">{{ getCurrencyName(send) }} to {{ getCurrencyName(receive) }}</span>
        </p>
        <div v-if="isLoading" class="favorite-item__price">
            <div class="favorite-item__rate--skeleton"></div>
            <div class="favorite-item__change--skeleton"></div>
        </div>
        <div v-else class="favorite-item__price">
            <p class="favorite-item__rate">{{ numberFormat.format(rates) }}</p>
            <p
class="favorite-item__change"
                :class="change >= 0 ? 'favorite-item__change--increase' : 'favorite-item__change--decrease'">{{
                    `${change >= 0 ? '▲ +' : '▼ '}${change.toFixed(2)}%` }}</p>
        </div>
        <FavoriteButton
:is-favorited="isFavorite" :is-disabled="false" :icon-only="true" @click.stop="toggleFavorites"
            @keydown.enter.stop />
    </div>
</template>

<style lang="scss" scoped>
.favorite-item {
    background-color: $neutral-600;
    box-shadow: inset 0 0 0 1px $neutral-500;
    border-radius: $radius-10;
    display: flex;
    align-items: center;
    gap: $spacing-250;
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

    &__currency-pair {
        @include text-preset-4;
        flex-grow: 1;
    }

    &__currencies {
        display: flex;
        gap: $spacing-100;
    }

    &__price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        text-align: end;
        gap: $spacing-075;
    }

    &__rate {
        @include text-preset-3;

        &--skeleton {
            height: 1.2rem;
            width: 63px;
            border-radius: $radius-full;
            background-color: $neutral-50;
            animation: loading 2000ms cubic-bezier(0.7, 0.1, 0.5, 0.9) infinite;
            opacity: 10%;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        }
    }

    &__change {
        @include text-preset-6;

        &--increase {
            color: $green-500
        }

        &--decrease {
            color: $red-500
        }

        &--skeleton {
            height: 0.625rem;
            width: 48px;
            border-radius: $radius-full;
            background-color: $neutral-50;
            opacity: 10%;
            animation: loading 2000ms cubic-bezier(0.7, 0.1, 0.5, 0.9) infinite;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        }
    }

    @include tablet {
        padding: $spacing-150 $spacing-200
    }
}

@keyframes loading {
    50% {
        opacity: 5%;
    }
}
</style>