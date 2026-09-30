<script setup lang="ts">
import { provide, ref, useSlots, type Ref, type VNode, watchEffect, watch, nextTick } from 'vue';
import ChevronDown from '@/assets/icons/icon-angle-down.svg'
import { onClickOutside, onKeyStroke, useMediaQuery } from "@vueuse/core";
import { AnimatePresence, motion } from 'motion-v';
import { isTypingTarget } from '../../utils/keyboard';

const isTablet = useMediaQuery('(min-width: 48rem)')
const slots = useSlots()
const containerRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const getTabs = (): { title: string; badge: number }[] => {
    const defaultSlot = slots.default ? slots.default() : []
    return defaultSlot.map((tab: VNode) => ({
        title: tab.props?.title,
        badge: tab.props?.badge
    }))
}

const tabs = ref(getTabs())
const selectedTitle = ref<string>(tabs.value[0]?.title || '')
const tabRefs = ref<Array<HTMLButtonElement | null>>([])
const setTabRef = (el: unknown, index: number) => { tabRefs.value[index] = el as HTMLButtonElement | null }
const tablistRef = ref<HTMLElement | null>(null)
const tablistRefMobile = ref<HTMLElement | null>(null)
provide<Ref<string>>('selectedTitle', selectedTitle)

watchEffect(() => {
    tabs.value = getTabs()
})
const isModalOpen = ref(false)
onClickOutside(containerRef, () => {
    isModalOpen.value = false
}, { ignore: [triggerRef] })

onKeyStroke('Escape', (e) => {
    if (!isModalOpen.value) return
    e.preventDefault()
    isModalOpen.value = false
    triggerRef.value?.focus()
})
onKeyStroke((e) => {
    if (!e.altKey) return
    if (isTypingTarget(e.target)) return
    const index = Number(e.code.replace('Digit', ''))
    if (!Number.isInteger(index) || index < 1 || index > tabs.value.length) return
    e.preventDefault()
    selectedTitle.value = tabs.value[index - 1]?.title ?? selectedTitle.value
})

onKeyStroke(['ArrowLeft', 'ArrowRight'], (e) => {
    if (!tablistRef.value?.contains(document.activeElement)) return
    e.preventDefault()
    const current = tabs.value.findIndex(t => t.title === selectedTitle.value)
    const offset = e.key === 'ArrowRight' ? 1 : -1
    const next = (current + offset + tabs.value.length) % tabs.value.length
    selectedTitle.value = tabs.value[next].title
    nextTick(() => tabRefs.value[next]?.focus())
})
watch(isModalOpen, async (isOpen) => {
    if (!isOpen) return
    await nextTick()
    const current = tabs.value.findIndex(t => t.title === selectedTitle.value)
    tabRefs.value[current]?.focus()
})

onKeyStroke(['ArrowUp', 'ArrowDown'], (e) => {
    console.log('ul:', tablistRefMobile.value, 'btn0:', tabRefs.value[0])
    if (!tablistRefMobile.value?.contains(document.activeElement)) return
    e.preventDefault()
    const current = tabs.value.findIndex(t => t.title === selectedTitle.value)
    const offset = e.key === 'ArrowDown' ? 1 : -1
    const next = (current + offset + tabs.value.length) % tabs.value.length
    selectedTitle.value = tabs.value[next].title
    nextTick(() => tabRefs.value[next]?.focus())
})
</script>

<template>
    <div v-if="isTablet" ref="tablistRef" class="tabs-tablet">
        <ul v-if="tabs" class="tabs-tablet__tabs-menu" role="listbox">
            <li v-for="(tab, index) in tabs" :key="tab.title" class="tabs-tablet__item">
                <button
:ref="el => setTabRef(el, index)" class="tabs-tablet__text"
                    :aria-selected="selectedTitle === tab.title" :tabindex="selectedTitle === tab.title ? 0 : -1"
                    @click="selectedTitle = tab.title">
                    {{ tab.title }}
                    <span v-show="tab.badge" class="tabs-tablet__badge">
                        {{ tab.badge }}
                    </span>
                </button>
                <motion.div v-if="selectedTitle === tab.title" layout-id="tabs-tablet__line" class="tabs-tablet__line">
                </motion.div>
            </li>
        </ul>
    </div>
    <div v-else ref="containerRef" class="tabs-mobile">
        <button
ref="triggerRef" type="button" aria-haspopup="listbox" class="tabs-mobile__button"
            :aria-expanded="isModalOpen ? true : false" @click="isModalOpen = !isModalOpen">
            {{ selectedTitle }}
            <img :src="ChevronDown" alt="" class="tabs-mobile__icon">
        </button>
        <div ref="tablistRefMobile">
            <AnimatePresence>
                <motion.ul
v-if="tabs && isModalOpen" class="tabs-mobile__tabs-menu" role="listbox"
                    :initial="{ height: 0 }" :animate="{ height: 'auto' }" :exit="{ height: 0 }">
                    <li v-for="(tab, index) in tabs" :key="tab.title" class="tabs-mobile__item">
                        <button
:ref="el => setTabRef(el, index)" type="button" class="tabs-mobile__list-button"
                            role="option" :aria-selected="selectedTitle === tab.title"
                            @click="selectedTitle = tab.title, isModalOpen = false">
                            {{ tab.title }}
                            <span v-show="tab.badge" class="tabs-mobile__badge">
                                {{ tab.badge }}
                            </span>
                        </button>
                    </li>
                </motion.ul>
            </AnimatePresence>
        </div>
    </div>
    <slot />
</template>

<style lang="scss" scoped>
.tabs-mobile {

    &__button {

        @include text-preset-3;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-inline: $spacing-150;
        height: 2.5rem;
        text-transform: uppercase;
        background-color: $neutral-700;
        border: none;
        outline: none;
        color: $neutral-50;
        box-shadow: inset 0 0 0 1px $neutral-400;
        border-radius: $radius-8;
        cursor: pointer;

        &:focus-visible {
            box-shadow: inset 0 0 0 1px $neutral-400, 0px 0px 0px 2px $neutral-900, 0px 0px 0px 4px $lime-500;
        }
    }

    &__tabs-menu {
        position: absolute;
        background-color: $neutral-700;
        width: calc(100% - $spacing-400);
        margin-top: $spacing-100;
        border-radius: $radius-10;
        box-shadow: inset 0 0 0 1px $neutral-600;
        display: flex;
        flex-direction: column;
        padding: $spacing-100;
        z-index: 10;
        overflow-x: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    &__list-button {
        @include text-preset-3;
        padding: $spacing-125 $spacing-100;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        text-transform: uppercase;
        color: $neutral-50;
        border: none;
        outline: none;
        width: 100%;
        background-color: transparent;
        border-radius: $radius-8;

        &:focus-visible {
            box-shadow: 0px 0px 0px 2px $neutral-700, 0px 0px 0px 4px $lime-500;
        }
    }

    &__badge {
        @include text-preset-6;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        color: $lime-500;
        background-color: $lime-800;
        border-radius: $radius-full;
    }
}

.tabs-tablet {
    width: 100%;
    box-shadow: inset 0 -1px 0 0 $neutral-600;

    &__tabs-menu {
        display: flex;
        gap: $spacing-100;
    }

    &__item {
        display: flex;
        flex-direction: column;
    }

    &__text {
        padding-inline: $spacing-200;
        @include text-preset-3;
        height: 2.5rem;
        display: flex;
        gap: $spacing-100;
        align-items: center;
        text-transform: uppercase;
        color: $neutral-50;
        border: none;
        outline: none;
        background-color: transparent;
        cursor: pointer;

        &:focus-visible {
            border-radius: $radius-4;
            box-shadow: 0px 0px 0px 2px $neutral-900, 0px 0px 0px 4px $lime-500;
        }
    }

    &__line {
        height: 2px;
        width: 100%;
        background-color: $lime-500;
        z-index: -1;
    }

    &__badge {
        @include text-preset-6;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        color: $lime-500;
        background-color: $lime-800;
        border-radius: $radius-full;
    }
}

[data-theme="light"] .tabs-mobile__icon {
    filter: invert(1);
}
</style>