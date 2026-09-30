<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core';
import { motion } from 'motion-v';
import { ref, nextTick } from 'vue';

interface Range {
    text: string
    ariaLabel: string
}

const rangeList = ref<Range[]>([
    { text: '1d', ariaLabel: '1 day' },
    { text: '1w', ariaLabel: '1 week' },
    { text: '1m', ariaLabel: '1 month' },
    { text: '3m', ariaLabel: '3 months' },
    { text: '1y', ariaLabel: '1 year' },
    { text: '5y', ariaLabel: '5 years' }
])
const buttonRefs = ref<Array<HTMLButtonElement | null>>([])
const setButtonRef = (el: unknown, index: number) => { buttonRefs.value[index] = el as HTMLButtonElement | null }
const groupRef = ref<HTMLElement | null>(null)
const emit = defineEmits(['range'])
const props = defineProps<{
    selectedRange: string
}>()
onKeyStroke(['ArrowLeft', 'ArrowRight'], (e) => {
    if (!groupRef.value?.contains(document.activeElement)) return
    e.preventDefault()
    const current = rangeList.value.findIndex(r => r.text === props.selectedRange)
    const offset = e.key === 'ArrowRight' ? 1 : -1
    const next = (current + offset + rangeList.value.length) % rangeList.value.length
    emit('range', rangeList.value[next].text)
    nextTick(() => buttonRefs.value[next]?.focus())
})
</script>

<template>
    <ul ref="groupRef" class="range-buttons" role="listbox" aria-label="Chart date range">
        <li v-for="(r, index) in rangeList" :key="r.text" role="presentation">
            <button
:ref="el => setButtonRef(el, index)" type="button" role="option" :aria-label="r.ariaLabel"
                :aria-selected="selectedRange === r.text ? 'true' : undefined"
                :tabindex="props.selectedRange === r.text ? 0 : -1" class="range-buttons__button"
                :class="selectedRange === r.text ? 'range-buttons__button--text-select' : null" @click="emit('range', r.text)">
                <span aria-hidden="true">{{ r.text }}</span>
                <motion.div
v-if="selectedRange === r.text" layout-id="range-buttons__button--selected" animate="{y: 0}"
                    class="range-buttons__button--selected">
                </motion.div>
            </button>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.range-buttons {
    @include text-preset-5;
    display: flex;
    padding: $spacing-025;
    background-color: $neutral-700;
    width: fit-content;
    text-transform: uppercase;
    border-radius: $radius-8;

    &__button {
        position: relative;
        text-align: center;
        display: flex;
        padding: $spacing-150 $spacing-200;
        cursor: pointer;
        color: $neutral-200;
        z-index: 1;
        transition: color 250ms ease;
        border: none;
        outline: none;
        background: transparent;
        text-transform: uppercase;

        &:focus-visible {
            box-shadow: 0px 0px 0px 3px $neutral-900, 0px 0px 0px 4px $lime-500;
            border-radius: $radius-8;
        }

        &--text-select {
            color: $neutral-50;

        }

        &--selected {
            position: absolute;
            border-radius: $radius-8;
            background-color: $neutral-500;
            color: $neutral-50;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            user-select: none;
        }
    }

    &--disabled {
        opacity: 50%;
    }
}
</style>