<script setup lang="ts">
import ChevronDown from '@/assets/icons/icon-chevron-down.svg'
import SearchIcon from '@/assets/icons/icon-search.svg'
import Checkmark from '@/assets/icons/icon-check.svg'
import { ref, useId, computed, watch, nextTick } from 'vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { useCurrencies } from '../../composables/useCurrencies'
import { getFlagUrl, onFlagError } from '../../utils/flags'
import { AnimatePresence, motion } from 'motion-v'
import { isTypingTarget } from '../../utils/keyboard.ts';
import { useCurrencyModal } from '../../composables/useCurrencyModal.ts'
import { getCurrencyName } from '../../utils/currencies.ts'

const { currencies } = useCurrencies()
const { openTarget, open } = useCurrencyModal()
const otherCurrencies = computed(() =>
    currencies.value.filter(c => !popularCodes.value.includes(c.iso_code))
)
const popularRows = computed(() =>
    currencies.value.filter(c => popularCodes.value.includes(c.iso_code))
)
const modalRef = ref(null)
const buttonRef = ref<HTMLButtonElement | null>(null)
const searchQuery = ref("")
const props = defineProps<{ modelValue: string; isDisabled: boolean; target: 'send' | 'receive' }>()
const isModalOpen = computed(() => openTarget.value === props.target)

const popularCodes = ref(['USD', 'EUR', 'JPY', 'GBP'])
const activeIndex = ref(-1)
const searchId = useId()
const searchRef = ref<HTMLInputElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const buttonRefs = ref<Array<HTMLButtonElement | null>>([])
const setButtonRef = (index: number, el: unknown) => {
    buttonRefs.value[index] = el as HTMLButtonElement | null
}
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const toggle = () => open(openTarget.value === props.target ? null : props.target)

const searchResult = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (!query) return currencies.value
    return currencies.value.filter(c => c.iso_code.toLowerCase().includes(query) || c.name.toLowerCase().includes(query) || getCurrencyName(c.iso_code, c.name).toLowerCase().includes(query))
})

onClickOutside(modalRef, () => {
    open(null)
}, { ignore: [buttonRef], target: modalRef })

onKeyStroke('Escape', (e) => {
    e.preventDefault()
    open(null)
})

watch(isModalOpen, async (isOpen) => {
    if (isOpen) {
        await nextTick()
        searchRef.value?.focus()
        if (containerRef.value) {
            containerRef.value.scrollTop = 0
        }
        searchQuery.value = ''
        activeIndex.value = -1
    } else {
        buttonRef.value?.focus()
    }
})

const visibleRows = computed(() => {
    if (searchQuery.value === '') {
        return [...popularRows.value, ...otherCurrencies.value]
    } else {
        return searchResult.value
    }
})

onKeyStroke('ArrowDown', (e) => {
    if (!isModalOpen.value) return
    e.preventDefault()
    if (activeIndex.value < visibleRows.value.length - 1) {
        activeIndex.value++
        buttonRefs.value[activeIndex.value]?.focus()
    }
})
onKeyStroke('ArrowUp', (e) => {
    if (!isModalOpen.value) return
    e.preventDefault()
    if (activeIndex.value > 0) {
        activeIndex.value--
        buttonRefs.value[activeIndex.value]?.focus()
    } else {
        searchRef.value?.focus()
        activeIndex.value = -1
    }
})
const onSearchInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    searchQuery.value = target.value
}
const onSearchEnter = () => {
    if (visibleRows.value.length === 0) return
    if (searchQuery.value === '') return
    activeIndex.value = 0
    emit('update:modelValue', visibleRows.value[activeIndex.value].iso_code)
    open(null)

}
onKeyStroke('/', (e) => {
    if (isTypingTarget(e.target)) return
    open(props.target)
    e.preventDefault()
    activeIndex.value = -1
})
</script>

<template>
    <div class="currency-button">
        <button
ref="buttonRef" :disabled="isDisabled" :class="isDisabled ? 'currency-button__button--disabled' : null"
            class="currency-button__button" aria-haspopup="listbox" :aria-expanded="isModalOpen ? true : false"
            @click="toggle">
            <img :src="getFlagUrl(props.modelValue)" alt="" class="currency-button__flag" @error="onFlagError">
            <span class="currency-button__text">
                <span aria-hidden="true">
                    {{ props.modelValue }}
                </span>
                <span class="sr-only">
                    {{ getCurrencyName(props.modelValue) }}
                </span>
            </span>
            <img :src="ChevronDown" alt="" class="currency-button__icon">
        </button>
        <AnimatePresence>
            <motion.div
v-if="isModalOpen" ref="modalRef" :initial="{ height: 0 }" :animate="{ height: 'auto' }"
                :exit="{ height: 0 }" class="content">
                <div class="content__search">
                    <img :src="SearchIcon" alt="" class="content__search-icon">
                    <label :for="searchId" class="sr-only">Search currencies</label>
                    <input
:id="searchId" ref="searchRef" type="text" inputmode="search" enterkeyhint="search"
                        class="content__search-input" placeholder="Search currencies..." autocomplete="off"
                        autocorrect="off" autocapitalize="none" spellcheck="false" :value="searchQuery"
                        @input="onSearchInput" @keydown.enter="onSearchEnter">
                </div>
                <div v-if="searchQuery === ''" ref="containerRef" class="container">
                    <p class="container__text">Popular <span>{{ popularCodes.length }}</span></p>
                    <ul class="container__list" role="listbox">
                        <li v-for="(c, i) in popularRows" :key="c.iso_code" class="container__currency">
                            <button
:ref="(el) => setButtonRef(i, el)" type="button" class="container__button"
                                role="option" :tabindex="i === activeIndex ? 0 : -1"
                                @keydown.tab="activeIndex < visibleRows.length - 1 && activeIndex++"
                                @click="open(null); emit('update:modelValue', c.iso_code)">
                                <img
:src="getFlagUrl(c.iso_code)" alt="" class="currency-button__flag"
                                    @error="onFlagError">
                                <span class="container__currency-symbol" aria-hidden="true">{{ c.iso_code }}</span>
                                <span class="container__currency-name">{{ getCurrencyName(c.iso_code, c.name) }}</span>
                                <img
v-show="props.modelValue === c.iso_code" :src="Checkmark" alt=""
                                    class="container__checkmark">
                            </button>
                        </li>
                    </ul>

                    <p class="container__text">Other currencies <span>{{ otherCurrencies.length }}</span></p>
                    <ul class="container__list" role="listbox">
                        <li v-for="(c, i) in otherCurrencies" :key="c.iso_code" class="container__currency">
                            <button
:ref="(el) => setButtonRef(popularRows.length + i, el)" type="button"
                                class="container__button" role="option"
                                :tabindex="popularRows.length + i === activeIndex ? 0 : -1"
                                @keydown.tab="activeIndex < visibleRows.length - 1 && activeIndex++"
                                @click="open(null); emit('update:modelValue', c.iso_code)">
                                <img
:src="getFlagUrl(c.iso_code)" alt="" class="currency-button__flag"
                                    @error="onFlagError">
                                <span class="container__currency-symbol" aria-hidden="true">{{ c.iso_code }}</span>
                                <span class="container__currency-name">{{ getCurrencyName(c.iso_code, c.name) }}</span>
                                <img
v-show="props.modelValue === c.iso_code" :src="Checkmark" alt=""
                                    class="container__checkmark">
                            </button>
                        </li>
                    </ul>
                </div>

                <div v-else ref="containerRef" class="container">
                    <p v-if="searchResult.length === 0" class="container__no-results">No results found</p>
                    <ul v-else class="container__list" role="listbox">
                        <li v-for="(c, i) in searchResult" :key="c.iso_code" class="container__currency">
                            <button
:ref="(el) => setButtonRef(i, el)" type="button" class="container__button"
                                role="option" :tabindex="i === activeIndex ? 0 : -1"
                                @keydown.tab="activeIndex < visibleRows.length - 1 && activeIndex++"
                                @click="open(null); emit('update:modelValue', c.iso_code)">
                                <img
:src="getFlagUrl(c.iso_code)" alt="" class="currency-button__flag"
                                    @error="onFlagError">
                                <span class="container__currency-symbol" aria-hidden="true">{{ c.iso_code }}</span>
                                <span class="container__currency-name">{{ getCurrencyName(c.iso_code, c.name) }}</span>
                                <img
v-show="props.modelValue === c.iso_code" :src="Checkmark" alt=""
                                    class="container__checkmark">
                            </button>
                        </li>
                    </ul>
                </div>
            </motion.div>
        </AnimatePresence>
    </div>
</template>

<style lang="scss" scoped>
.currency-button {
    position: relative;

    &__button {
        @include text-preset-4;
        display: flex;
        gap: $spacing-100;
        padding: $spacing-125;
        border-radius: $radius-8;
        border: none;
        box-shadow: inset 0 0 0 1px $neutral-400;
        background-color: $neutral-500;
        color: $neutral-50;
        cursor: pointer;
        align-items: center;
        transition: background-color 300ms ease;

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }

        &:hover {

            background-color: $neutral-400;
        }

        &:focus-visible {
            outline: none;
            box-shadow: inset 0 0 0 1px $neutral-400, 0px 0px 0px 3px $neutral-600, 0px 0px 0px 4px $lime-500;
        }

        &--disabled {
            cursor: default;
            opacity: 70%;

            &:hover {
                background-color: $neutral-500;
            }
        }
    }

    &__flag {
        height: 1.25rem;
    }

    .content {
        position: absolute;
        right: -1rem;
        transform: translate(0, 1.5rem);
        width: 85vw;
        height: auto;
        max-height: 28.625rem;
        max-width: 19.4375rem;
        box-shadow: inset 0 0 0 1px $neutral-400, 0 20px 60px 0 rgba($neutral-900, 0.5);
        background-color: $neutral-600;
        border-radius: $radius-8;
        padding: $spacing-100;
        flex-direction: column;
        gap: $spacing-125;
        display: flex;
        z-index: 10;
        overflow: hidden;

        @include tablet {
            max-width: 23.5rem;
        }

        &__search {
            box-shadow: inset 0 0 0 1px $neutral-200;
            border-radius: $radius-6;
            display: flex;
            gap: $spacing-125;
            padding: $spacing-150;
            justify-content: center;

            &:has(> .content__search-input:focus) {
                box-shadow: inset 0 0 0 1px $lime-500;
            }
        }

        &__search-input {
            @include text-preset-5;
            flex-grow: 1;
            padding: 0;
            border: none;
            outline: none;
            background: transparent;
            color: $neutral-50;

            &::placeholder {
                color: $neutral-200;
            }
        }

        .container {
            display: flex;
            flex-direction: column;
            gap: $spacing-050;
            overflow-y: auto;

            &__no-results {
                @include text-preset-5;
                padding: $spacing-100;
                color: $neutral-200;
            }

            &__text {
                @include text-preset-5;
                display: flex;
                justify-content: space-between;
                color: $neutral-200;
                text-transform: uppercase;
                gap: $spacing-125;
                padding: $spacing-100;
                box-shadow: inset 0 -1px 0 0 $neutral-500;
            }

            &__list {
                display: flex;
                flex-direction: column;
            }

            &__button {
                display: flex;
                align-items: center;
                width: 100%;
                border: none;
                outline: none;
                gap: $spacing-150;
                padding: $spacing-150 $spacing-100;
                background: transparent;
                cursor: pointer;
                border-radius: $radius-4;

                &:hover {
                    box-shadow: inset 0 0 0 1px $neutral-200
                }

                &:focus-visible {
                    box-shadow: inset 0 0 0 1px $lime-500;
                }
            }

            &__currency-symbol {
                @include text-preset-4;
                color: $neutral-50;
            }

            &__currency-name {
                @include text-preset-5;
                flex-grow: 1;
                width: 100%;
                text-align: start;
                color: $neutral-200;
            }
        }
    }

}

[data-theme="light"] .currency-button__icon,
[data-theme="light"] .content__search-icon,
[data-theme="light"] .container__checkmark {
    filter: invert(1);
}
</style>