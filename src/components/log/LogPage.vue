<script setup lang="ts">
import { useLog } from '../../composables/useLog.ts';
import ClearButton from '../ui/ClearButton.vue';
import ExportButton from '../ui/ExportButton.vue';
import UnavailableMessage from '../ui/UnavailableMessage.vue';
import LogItem from './LogItem.vue';
import { isTypingTarget } from '../../utils/keyboard.ts';
import { onKeyStroke } from '@vueuse/core';
import { nextTick, ref } from 'vue';
import { useAnnounce } from '../../composables/useAnnounce.ts';

const groupRef = ref<HTMLElement | null>(null)
onKeyStroke(['ArrowDown', 'ArrowUp'], (e) => {
    if (!groupRef.value?.contains(document.activeElement)) return
    e.preventDefault()
    const items = Array.from(groupRef.value.querySelectorAll('.log-item'))
    const current = items.indexOf(document.activeElement as Element)
    const offset = e.key === 'ArrowDown' ? 1 : -1
    const next = (current + offset + items.length) % items.length
    nextTick(() => (items[next] as HTMLElement | undefined)?.focus())
})
const { entries, clear, remove, exportCsv } = useLog()
const { announce } = useAnnounce()

const onExport = () => {
    const count = exportCsv()
    announce(`Exported ${count} ${count === 1 ? "entry" : "entries"} as CSV`)
}

onKeyStroke(['l', 'L'], (e) => {
    if (!e.altKey) return
    if (!e.shiftKey) return
    if (isTypingTarget(e.target)) return
    e.preventDefault()
    clear()
})
onKeyStroke(['e', 'E'], (e) => {
    if (!e.altKey) return
    if (!e.shiftKey) return
    if (isTypingTarget(e.target)) return
    e.preventDefault()
    onExport()
})
const emit = defineEmits(['interact'])
</script>

<template>
    <UnavailableMessage v-if="entries.length === 0" text-width="46.25rem">
        <template #header>No conversions logged yet</template>
        <template #text>Every conversion is recorded here automatically when you tap LOG CONVERSION.
            Your log is
            private to this session and this browser.</template>
    </UnavailableMessage>
    <div v-else ref="groupRef" class="log">
        <div class="log__header">
            <p class="log__left">Conversion log</p>
            <div class="log__right">
                <p class="log__log-length">{{ entries.length }} logged</p>
                <div class="log__actions">
                    <ExportButton :count="entries.length" @export="onExport" />
                    <ClearButton @click="clear" />
                </div>
            </div>
        </div>
        <div class="log__list">
            <LogItem
v-for="entry in entries" :key="entry.id" :entry="entry" @delete="remove(entry.id)"
                @interact="(pair) => emit('interact', pair)" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.log {
    display: flex;
    flex-direction: column;
    gap: $spacing-200;
    padding: $spacing-200;
    background-color: $neutral-700;
    box-shadow: inset 0 0 0 1px $neutral-600;
    border-radius: $radius-16;

    &__header {
        display: flex;
        flex-direction: column;
        gap: $spacing-125;
        text-transform: uppercase;
    }

    &__left {
        @include text-preset-3-medium
    }

    &__right {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__log-length {
        @include text-preset-5;
        opacity: 70%;
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: $spacing-100;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: $spacing-150;
    }

    @include tablet {
        gap: $spacing-250;
        padding: $spacing-250;

        &__header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }

        &__right {
            justify-content: flex-end;
            gap: $spacing-200;
        }
    }
}
</style>