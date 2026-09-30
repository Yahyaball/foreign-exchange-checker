<script setup lang="ts">
import { ref } from 'vue';
import KeyboardButtons from '../ui/KeyboardButtons.vue';
import { shortcutGroups } from '../../utils/shortcuts.ts';
import { onClickOutside } from '@vueuse/core';
import { AnimatePresence, motion } from 'motion-v';

defineProps<{
    show: boolean
}>()
const emit = defineEmits<{ close: [] }>();
const boxRef = ref<HTMLElement | null>(null);

onClickOutside(boxRef, () => emit('close'));
</script>

<template>
    <AnimatePresence>
        <motion.div
v-if="show" class="overlay" :initial="{ opacity: 0 }" :animate="{ opacity: 0.5 }"
            :exit="{ opacity: 0 }">
        </motion.div>
        <motion.div
v-if="show" :initial="{ opacity: 0, scale: 0 }" :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 0 }" class="overlay-message" role="dialog" aria-modal="true">
            <div ref="boxRef" class="overlay-box">
                <h2 class="overlay-box__heading">Keyboard shortcuts</h2>
                <div class="overlay-box__list">
                    <div v-for="g in shortcutGroups" :key="g.view" class="overlay-box__view">
                        <h3 class="overlay-box__view-name">{{ g.view }}</h3>
                        <div v-for="s in g.shortcuts" :key="s.description" class="overlay-box__shortcuts">
                            <KeyboardButtons v-bind="s" />
                            <p class="overlay-box__description">{{ s.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
</template>

<style lang="scss" scoped>
.overlay {
    position: fixed;
    inset: 0;
    background-color: $neutral-900;
    opacity: 50%;
    z-index: 20;
}

.overlay-message {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 21;
    width: 100%;
    padding-inline: $spacing-400;
    padding-top: $spacing-200;
}

.overlay-box {
    display: flex;
    gap: $spacing-100;
    flex-direction: column;
    background-color: $neutral-600;
    width: 100%;
    max-height: 85vh;
    overflow-x: auto;
    box-shadow: inset 0 0 0 1px $neutral-400;
    border-radius: $radius-8;
    padding: $spacing-150;

    &__list {
        display: grid;
        gap: $spacing-200;
        grid-template-columns: repeat(auto-fit, minmax(17.25rem, 1fr));

    }

    &__view {
        display: flex;
        flex-direction: column;
        gap: $spacing-075;
    }

    &__view-name {
        @include text-preset-5;
        color: $neutral-100;
    }

    &__heading {
        @include text-preset-2;
        text-transform: uppercase;
    }

    &__shortcuts {
        display: flex;
        flex-direction: column;
        gap: $spacing-050;
    }

    &__description {
        @include text-preset-5;
        color: $neutral-200;
    }

}

@include tablet {
    .overlay-message {
        padding-block: $spacing-200;
        min-height: 100vh;
    }
}
</style>