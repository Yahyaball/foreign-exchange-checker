<script setup lang="ts">
import Check from '@/assets/icons/icon-check.svg'

const props = defineProps<{ isLogged: boolean, isDisabled: boolean }>()
const emit = defineEmits<{ log: [] }>()
</script>

<template>
    <button
type="button" class="log-button"
        :class="{ 'log-button--logged': props.isLogged, 'log-button--disabled': props.isDisabled }"
        :disabled="props.isDisabled" @click="emit('log')">
        <img v-show="props.isLogged" :src="Check" alt="" class="log-button__check">
        <span v-if="props.isLogged">Logged</span>
        <span v-else>Log conversion</span>
    </button>
</template>

<style lang="scss" scoped>
.log-button {
    @include text-preset-5-medium;
    display: flex;
    gap: $spacing-100;
    padding: $spacing-100 $spacing-150;
    background-color: transparent;
    border: none;
    outline: none;
    box-shadow: inset 0 0 0 1px $lime-500;
    border-radius: $radius-8;
    text-transform: uppercase;
    color: $neutral-50;
    cursor: pointer;
    transition: background-color 300ms ease;
    min-width: 8.25rem;
    justify-content: center;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    &:hover {

        background-color: $lime-800;
    }

    &:focus-visible {
        box-shadow: inset 0 0 0 1px $lime-500, 0px 0px 0px 3px $neutral-700, 0px 0px 0px 4px $lime-500;
    }

    &--disabled {
        cursor: default;
        transition: none;
        box-shadow: inset 0 0 0 1px $neutral-300;
        color: $neutral-200;

        &:hover {
            background-color: transparent;
            box-shadow: inset 0 0 0 1px $neutral-300;
        }

        &>.log-button__star {
            filter: brightness(62%);
        }
    }

    &--logged {
        color: $neutral-900;
        background-color: $lime-500;
        box-shadow: inset 0 0 0 1px $lime-500;
        transition: opacity 300ms ease;
        text-transform: none;

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }

        &:hover {
            color: $neutral-900;
            background-color: $lime-500;
            box-shadow: inset 0 0 0 1px $lime-500;
        }

    }

    &__check {
        filter: brightness(0)
    }
}

[data-theme="light"] .log-button__check {
    filter: brightness(100);
}
</style>