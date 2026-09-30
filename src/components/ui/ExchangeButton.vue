<script setup lang="ts">
import Exchange from "@/assets/icons/icon-exchange.svg"
import ExchangeVertical from "@/assets/icons/icon-exchange-vertical.svg"
import { useMediaQuery } from "@vueuse/core";
const props = defineProps<{ isDisabled: boolean }>()
const emits = defineEmits<{ 'exchangeCurrency': [] }>()
const isTablet = useMediaQuery('(min-width: 48rem)')
</script>

<template>
    <button
type="button" class="exchange-button" aria-label="Exchange currency" :disabled="props.isDisabled"
        :class="{ 'exchange-button--disabled': props.isDisabled }" @click="emits('exchangeCurrency')">
        <img :src="isTablet ? Exchange : ExchangeVertical" alt="" class="exchange-button__icon">
    </button>
</template>

<style lang="scss" scoped>
.exchange-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background-color: $neutral-600;
    border: none;
    outline: none;
    border-radius: $radius-8;
    box-shadow: inset 0 0 0 1px $neutral-500;
    transition: background-color 300ms ease;
    cursor: pointer;
    flex-shrink: 0;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    &:hover {
        background-color: $neutral-500;
        box-shadow: inset 0 0 0 1px $neutral-400;
    }

    &:focus-visible {
        transition: none;
        box-shadow: inset 0 0 0 1px $neutral-500, 0px 0px 0px 3px $neutral-700, 0px 0px 0px 4px $lime-500;
    }

    &__icon {
        transition: opacity 300ms ease;

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }


    }


    &--disabled {
        background-color: $neutral-600;
        box-shadow: inset 0 0 0 1px $neutral-300;
        cursor: not-allowed;
        transition: none;

        &>.exchange-button__icon {
            opacity: 62%;
            transition: none;
        }

        &:hover {
            background-color: $neutral-600;
            box-shadow: inset 0 0 0 1px $neutral-300;
        }
    }
}

[data-theme="light"] .exchange-button__icon {
    filter: invert(1);
}
</style>