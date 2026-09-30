<script setup lang="ts">
import { useDark } from '@vueuse/core';

const props = defineProps<{ isFavorited: boolean, isDisabled: boolean, iconOnly: boolean }>()
const isDark = useDark()
import Star from '@/assets/icons/icon-star.svg'
import StarFilled from '@/assets/icons/icon-star-filled.svg'
import StarFilledLight from '@/assets/icons/star-filled-light.svg'
</script>

<template>
    <button
type="button" class="favorite-button"
        :class="{ 'favorite-button--favorited': isFavorited, 'favorite-button--disabled': isDisabled, 'icon-only': iconOnly }"
        :disabled="isDisabled">
        <img
v-if="isFavorited" :src="isDark ? StarFilled : StarFilledLight" :alt="props.iconOnly ? 'Favorited' : ''"
            class="favorite-button__star">
        <img v-else :src="Star" :alt="props.iconOnly ? 'Favorite' : ''" class="favorite-button__star">
        <span v-if="isFavorited && !iconOnly">Favorited</span>
        <span v-else-if="!iconOnly">Favorite</span>
    </button>
</template>

<style lang="scss" scoped>
.favorite-button {
    @include text-preset-5-medium;
    display: flex;
    gap: $spacing-100;
    padding: $spacing-100 $spacing-150;
    background-color: $neutral-600;
    border: none;
    outline: none;
    box-shadow: inset 0 0 0 1px $neutral-500;
    border-radius: $radius-8;
    text-transform: uppercase;
    color: $neutral-50;
    cursor: pointer;
    transition: background-color 300ms ease;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    &:hover {
        background-color: $neutral-500;
        box-shadow: inset 0 0 0 1px $neutral-400;
    }

    &:focus-visible {
        box-shadow: inset 0 0 0 1px $neutral-400, 0px 0px 0px 3px $neutral-700, 0px 0px 0px 4px $lime-500;
    }

    &--disabled {
        cursor: default;
        transition: none;
        background-color: $neutral-600;
        box-shadow: inset 0 0 0 1px $neutral-300;
        color: $neutral-200;

        &:hover {
            background-color: $neutral-600;
            box-shadow: inset 0 0 0 1px $neutral-300;
        }

        &>.favorite-button__star {
            filter: brightness(62%);
        }
    }

    &--favorited {
        color: $neutral-900;
        background-color: $lime-500;
        box-shadow: inset 0 0 0 1px $lime-500;
        transition: opacity 300ms ease;

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }

        &:hover {
            opacity: 80%;
            color: $neutral-900;
            background-color: $lime-500;
            box-shadow: inset 0 0 0 1px $lime-500;
        }

        &:focus-visible {
            box-shadow: inset 0 0 0 1px $lime-500, 0px 0px 0px 3px $neutral-700, 0px 0px 0px 4px $lime-500;
        }

        &>.favorite-button__star {
            filter: brightness(0%);
        }
    }

    &.icon-only {
        gap: $spacing-100;
        padding: $spacing-100;

        &.favorite-button--favorited {
            background-color: $neutral-600;
            transition: background-color 300ms ease;

            @media (prefers-reduced-motion: reduce) {
                transition: none;
            }

            &:hover {
                opacity: 100%;
                background-color: $neutral-500;

            }

            &:focus-visible {
                box-shadow: inset 0 0 0 1px $lime-500, 0px 0px 0px 3px $neutral-700, 0px 0px 0px 4px $lime-500;
            }

            &>.favorite-button__star {
                filter: brightness(100%);
            }
        }
    }
}

[data-theme="light"] .favorite-button__star {
    filter: invert(1);
}

[data-theme="light"] .favorite-button--favorited>.favorite-button__star {
    filter: brightness(100);
}
</style>