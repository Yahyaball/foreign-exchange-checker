<script setup lang="ts">
import Delete from '@/assets/icons/icon-delete.svg'
import DeleteFilled from '@/assets/icons/icon-delete-filled.svg'
import { ref } from 'vue';
import { motion } from 'motion-v';
import { getCurrencyName } from '../../utils/currencies';

const { from, to, amountFrom, amountTo } = defineProps<{ from: string, to: string, amountFrom: number, amountTo: number }>()
const isHovered = ref(false)
const emit = defineEmits<{ delete: [] }>()
</script>

<template>
    <motion.button
type="button" class="delete-button"
        :aria-label="`delete ${amountFrom} ${getCurrencyName(from)} to ${amountTo} ${getCurrencyName(to)}`"
        while-hover="hover" @mouseenter="isHovered = true" @mouseleave="isHovered = false" @click="emit('delete')">
        <motion.img :variants="{ hover: { opacity: 0 } }" :src="Delete" alt="" class="delete-button__icon" />
        <motion.img
:variants="{ hover: { opacity: 1 } }" :src="DeleteFilled" alt=""
            class="delete-button__icon--hover-overlay" />
    </motion.button>
</template>

<style lang="scss" scoped>
.delete-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-100;
    width: 2rem;
    height: 2rem;
    border: none;
    outline: none;
    border-radius: $radius-8;
    background-color: $neutral-600;
    box-shadow: inset 0 0 0 1px $neutral-500;
    cursor: pointer;
    transition: background-color 300ms ease;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    &__icon {
        &--hover-overlay {
            position: absolute;
            pointer-events: none;
            opacity: 0;
        }
    }

    &:hover {
        background-color: $neutral-500;
        box-shadow: inset 0 0 0 1px $neutral-400;
    }

    &:focus-visible {
        box-shadow: inset 0 0 0 1px $neutral-500, 0px 0px 0px 3px $neutral-900, 0px 0px 0px 4px $lime-500;
    }
}

[data-theme="light"] .delete-button__icon,
[data-theme="light"] .delete-button__icon--hover-overlay {
    filter: invert(1);
}
</style>