<script setup lang="ts">
import { computed } from 'vue';

const DIFF_CLASS = { 1: 'conversion-slots__value--decrease', 2: 'conversion-slots__value--increase' } as const
const props = defineProps<{
    title: string
    value: string
    isLoading: boolean
    isIncrease?: 1 | 2
}>()
const classDiff = computed(() => {
    if (!props.isIncrease) return undefined
    return DIFF_CLASS[props.isIncrease]
})

</script>

<template>
    <div class="conversion-slots">
        <p class="conversion-slots__label">{{ title }}</p>
        <div v-if="isLoading" class="conversion-slots__skeleton"></div>
        <p v-else class="conversion-slots__value" :class="classDiff">{{ value }} </p>
    </div>
</template>

<style lang="scss" scoped>
.conversion-slots {
    display: flex;
    flex-direction: column;
    background-color: $neutral-700;
    border-radius: $radius-16;
    padding: $spacing-150 $spacing-250;
    gap: $spacing-200;
    box-shadow: inset 0 0 0 1px $neutral-600;

    &__label {
        @include text-preset-4;
        opacity: 70%;
        text-transform: uppercase
    }

    &__value {
        @include text-preset-2;
        overflow-y: hidden;
        white-space: nowrap;

        &--decrease {
            color: $red-500
        }

        &--increase {
            color: $green-500
        }
    }

    &__skeleton {
        @include text-preset-2;
        background-color: $neutral-50;
        height: 1.5rem;
        width: 100%;
        border-radius: $radius-8;
        opacity: 10%;
        animation: loading 2000ms cubic-bezier(0.7, 0.1, 0.5, 0.9) infinite;

        @media (prefers-reduced-motion: reduce) {
            animation: none;
        }
    }

    @include tablet {
        width: 8.75rem;
    }
}

@keyframes loading {
    50% {
        opacity: 5%;
    }
}
</style>