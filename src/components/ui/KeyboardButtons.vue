<script setup lang="ts">
defineProps<{
    keys1: string,
    keys2?: string,
    keys3?: string,
    keysTo?: string,
    description: string,
}>()

const arrowToText = (text: string | undefined) => {
    if (!text) return
    if (text === '↓') {
        return 'down arrow'
    } else if (text === '↑') {
        return 'up arrow'
    } else if (text === '←') {
        return 'left arrow'
    } else if (text === '→') {
        return 'right arrow'
    } else if (text === 'Esc') {
        return 'escape'
    } else {
        return text
    }
}
</script>

<template>
    <p class="sr-only">{{ arrowToText(keys1) }} {{ keys2 ? `+ ${arrowToText(keys2)}` : '' }} {{ keys3 ? `+
        ${arrowToText(keys3)}` : ''
        }} {{ keysTo ? `to ${arrowToText(keysTo)}` : '' }}</p>
    <div class="keyboard-buttons" aria-hidden="true">
        <span class="keyboard-buttons__button">{{ keys1 }}</span>
        <span v-if="keys2" class="keyboard-buttons__button">{{ keys2 }}</span>
        <span v-if="keys3" class="keyboard-buttons__button">{{ keys3 }}</span>
        <div v-if="keysTo" class="keyboard-buttons__to">
            <span>-</span>
            <span class="keyboard-buttons__button">{{ keysTo }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.keyboard-buttons {
    @include text-preset-4;
    display: flex;
    text-transform: uppercase;
    gap: $spacing-100;

    &__button {
        box-shadow: inset 0 0 0 1px $neutral-50;
        padding: $spacing-100 $spacing-150;
        border-radius: $radius-8;
    }

    &__to {
        display: flex;
        gap: $spacing-100;
        align-items: center;
    }
}
</style>