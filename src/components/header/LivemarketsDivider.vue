<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core';
import { useMarkets } from '../../composables/useMarkets';
import { getCurrencyName } from '../../utils/currencies';

const { markets } = useMarkets()
const motion = usePreferredReducedMotion()
const reducedMotion = motion.value === 'reduce' ? true : false
const copyCount = reducedMotion ? 1 : 2
</script>

<template>
    <div class="livemarkets">
        <div class="live">
            <div class="live__circle"></div>
            <p class="live__text">Live markets</p>
        </div>
        <div class="container">
            <ul v-for="copy in copyCount" :key="copy" class="container__markets" :aria-hidden="copy > 1">
                <li v-for="m in markets" :key="m.base + m.quote" class="container__list">
                    <span class="container__currency-pair" aria-hidden="true">{{ m.base }}/{{ m.quote }}</span>
                    <span class="sr-only">{{ getCurrencyName(m.base) }} to {{ getCurrencyName(m.quote) }}</span>
                    <span class="container__exchange-rate">{{ m.rate }}</span>
                    <span
class="container__exchange-rate-change"
                        :class="m.change >= 0 ? 'container__exchange-rate-change--up' : 'container__exchange-rate-change--down'">
                        {{ `${m.change >= 0 ? '▲ +' : '▼ '}${m.change.toFixed(2)}%` }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.livemarkets {
    display: flex;
    background-color: $neutral-700;
    align-items: center;

    .live {
        background-color: $lime-500;
        color: $neutral-900;
        padding: $spacing-150 $spacing-100;
        display: flex;
        align-items: center;
        gap: $spacing-100;
        flex-shrink: 0;
        @include text-preset-6;

        &__circle {
            width: 0.375rem;
            height: 0.375rem;
            background-color: $neutral-900;
            border-radius: $radius-full;
            animation: blink 1s linear infinite alternate;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        }

        &__text {
            text-transform: uppercase;
        }
    }

    .container {
        @include text-preset-6;
        display: flex;
        overflow: hidden;
        user-select: none;

        @media (prefers-reduced-motion: reduce) {
            overflow-x: auto;
        }

        &:hover .container__markets {
            animation-play-state: paused;
        }

        &__markets {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            min-width: 100%;
            animation: scroll 30s linear infinite;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        }

        &__list {
            display: flex;
            gap: $spacing-125;
            padding: $spacing-150;
            justify-content: center;
            box-shadow: inset -1px 0 0 0 $neutral-500;
        }

        &__currency-pair {
            color: $neutral-200;
        }

        &__exchange-rate-change {
            &--up {
                color: $green-500;
            }

            &--down {
                color: $red-500;
            }
        }
    }

    @include tablet {
        .live {
            padding: $spacing-150 $spacing-200;
            @include text-preset-5-medium
        }

        .container {
            &__list {
                @include text-preset-5-medium;
                padding: $spacing-150 0;
                width: 13rem;
            }
        }
    }
}

@keyframes scroll {
    to {
        transform: translateX(-100%)
    }
}

@keyframes blink {
    to {
        opacity: 0;
    }
}
</style>