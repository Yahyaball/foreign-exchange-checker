<script setup lang="ts">
import FavoriteItem from './FavoriteItem.vue';
import { useFavorites } from '../../composables/useFavorites.ts';
import UnavailableMessage from '../ui/UnavailableMessage.vue';
import { onKeyStroke } from '@vueuse/core';
import { nextTick, ref } from 'vue';

const groupRef = ref<HTMLElement | null>(null)
onKeyStroke(['ArrowDown', 'ArrowUp'], (e) => {
    if (!groupRef.value?.contains(document.activeElement)) return
    e.preventDefault()
    const items = Array.from(groupRef.value.querySelectorAll('.favorite-item'))
    const current = items.indexOf(document.activeElement as Element)
    const offset = e.key === 'ArrowDown' ? 1 : -1
    const next = (current + offset + items.length) % items.length
    nextTick(() => (items[next] as HTMLElement | undefined)?.focus())
})
const { favorites } = useFavorites()
const emit = defineEmits(['interact'])


</script>

<template>
    <UnavailableMessage v-if="favorites.length === 0" text-width="460px">
        <template #header>No pinned pairs yet</template>
        <template #text>Pin a pair to track its rate here. Tap the star icon on any conversion or comparison
            row.</template>
    </UnavailableMessage>
    <div v-else ref="groupRef" class="favorites">
        <div class="favorites__header">
            <p class="favorites__left">Pinned pairs</p>
            <p class="favorites__right">{{ `${favorites.length} ${favorites.length === 1 ? 'favorite' : 'favorites'}` }}
            </p>
        </div>
        <div v-for="f in favorites" :key="f.base" class="favorites__list">
            <FavoriteItem :send="f.base" :receive="f.quote" @interact="(pair) => emit('interact', pair)" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.favorites {
    display: flex;
    flex-direction: column;
    gap: $spacing-200;
    padding: $spacing-200;
    background-color: $neutral-700;
    box-shadow: inset 0 0 0 1px $neutral-600;
    border-radius: $radius-16;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-transform: uppercase
    }

    &__left {
        @include text-preset-3-medium;
    }

    &__right {
        @include text-preset-5;
        opacity: 70%;
    }

    @include tablet {
        gap: $spacing-250;
        padding: $spacing-250;
    }
}
</style>