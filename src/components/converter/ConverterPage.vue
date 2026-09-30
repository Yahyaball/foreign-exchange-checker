<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ConverterInput from './ConverterInput.vue';
import ExchangeButton from '../ui/ExchangeButton.vue';
import FrankfurterAPI from '../../services/FrankfurterAPI.ts';
import { numberFormat } from '../../utils/format.ts';
import FavoriteButton from '../ui/FavoriteButton.vue';
import LogButton from '../ui/LogButton.vue';
import { useFavorites } from '../../composables/useFavorites.ts';
import { useLog } from '../../composables/useLog.ts';
import { useAnnounce } from '../../composables/useAnnounce.ts';
import { onKeyStroke } from '@vueuse/core';
import { isTypingTarget } from '../../utils/keyboard.ts';
import { useCurrencyModal } from '../../composables/useCurrencyModal.ts';
import { getCurrencyName } from '../../utils/currencies.ts';

const { favorites } = useFavorites()
const { log } = useLog()
const { announce } = useAnnounce()
const { open } = useCurrencyModal()
const send = defineModel<string>('send', { required: true })
const receive = defineModel<string>('receive', { required: true })
const emit = defineEmits(['exchange', 'log'])
const sendAmount = defineModel<number>('amount', { required: true })
const rate = ref(0)
const isLoading = ref(true)
const receiveAmount = computed(() => sendAmount.value * rate.value)
const canLog = computed(() => hasRate.value && !isLoading.value && sendAmount.value > 0 && !isLogged.value)
const canFavorite = computed(() => hasRate.value && !isLoading.value)
const exchangeCurrency = () => {
    emit('exchange')
}
const hasRate = ref(true)
const isLogged = ref(false)
const isFavorite = computed(() =>
    favorites.value.some((f) => f.base === send.value && f.quote === receive.value)
)
const inputRef = ref<{ focusInput: () => void } | null>(null)
watch(sendAmount, () => {
    if (!hasRate.value) return
    if (!Number.isFinite(receiveAmount.value)) return
    announce(`${numberFormat.format(receiveAmount.value)} ${getCurrencyName(receive.value)}`)
})

watch([() => send.value, () => receive.value], async ([newProps, newReceive]) => {
    isLoading.value = true
    hasRate.value = false
    rate.value = 0
    try {
        const response = await FrankfurterAPI.getRates(newProps, newReceive)
        if (response.data[0]) {
            hasRate.value = true
            rate.value = response.data[0].rate
        }
    } catch (err) {
        console.error(err)
    } finally {
        isLoading.value = false
    }
}, { immediate: true })

const toggleFavorites = () => {
    if (isFavorite.value) {
        favorites.value = favorites.value.filter(f => !(f.base === send.value && f.quote === receive.value))
        announce(`unpinned ${getCurrencyName(send.value)} to ${getCurrencyName(receive.value)}`)
    } else {
        favorites.value.push({
            base: send.value,
            quote: receive.value
        })
        announce(`pinned ${getCurrencyName(send.value)} to ${getCurrencyName(receive.value)}`)
    }
}

const logConversion = () => {
    log({
        time: new Date().toISOString(),
        from: send.value,
        to: receive.value,
        amountFrom: sendAmount.value,
        amountTo: receiveAmount.value
    })
    isLogged.value = true
    announce('logged')
}

watch([send, receive, sendAmount], () => {
    isLogged.value = false
})

onKeyStroke(['l', 'L'], (e) => {
    if (!e.altKey) return
    if (isTypingTarget(e.target)) return
    if (!canLog.value) return
    e.preventDefault()
    logConversion()
})
onKeyStroke(['f', 'F'], (e) => {
    if (!e.altKey) return
    if (isTypingTarget(e.target)) return
    if (!canFavorite.value) return
    e.preventDefault()
    toggleFavorites()
})
onKeyStroke(['a', 'A'], (e) => {
    if (!e.altKey) return
    if (isTypingTarget(e.target)) return
    e.preventDefault()
    inputRef.value?.focusInput()
})

onKeyStroke(['s', 'S'], (e) => {
    if (!e.altKey) return
    if (isTypingTarget(e.target)) return
    e.preventDefault()
    open('send')
})
onKeyStroke(['r', 'R'], (e) => {
    if (!e.altKey) return
    if (isTypingTarget(e.target)) return
    e.preventDefault()
    open('receive')
})
</script>

<template>
    <div class="converter">
        <div class="converter__top">
            <ConverterInput
ref="inputRef" v-model="send" v-model:amount="sendAmount" :send="true"
                :is-loading="isLoading" />
            <ExchangeButton :is-disabled="isLoading" @exchange-currency="exchangeCurrency" />
            <ConverterInput v-model="receive" v-model:amount="receiveAmount" :send="false" :is-loading="isLoading" />
        </div>
        <div class="converter__bottom">
            <div v-if="isLoading" class="converter__skeleton"></div>
            <p v-else-if="!hasRate" class="converter__rate--unavailable">Rate unavailable for this pair</p>
            <p v-else class="converter__rate">
                <span aria-hidden="true">
                    1 {{ send }} = {{ numberFormat.format(rate) }} {{ receive
                    }} </span>
                <span class="sr-only"> 1 {{ getCurrencyName(send) }} = {{ numberFormat.format(rate) }} {{
                    getCurrencyName(receive)
                }}</span>

            </p>
            <div class="converter__button">
                <FavoriteButton
:is-favorited="isFavorite" :is-disabled="!canFavorite" :icon-only="false"
                    @click="toggleFavorites" />
                <LogButton :is-logged="isLogged" :is-disabled="!canLog" @click="logConversion" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.converter {
    background-color: $neutral-700;
    border-radius: $radius-20;
    box-shadow: 0px 12px 40px 0 rgba($neutral-900, 0.4);

    &__top {
        display: flex;
        flex-direction: column;
        gap: $spacing-200;
        padding: $spacing-200;
        align-items: center;
        border-bottom: 1px dashed $neutral-500;
    }

    &__bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: $spacing-200;
        gap: $spacing-200;
    }

    &__rate {
        @include text-preset-6;

        &--unavailable {
            @include text-preset-6;
            color: $neutral-200;
        }
    }

    &__button {
        display: flex;
        gap: $spacing-100;
    }

    &__skeleton {
        @include text-preset-6;
        width: 7rem;
        height: 1em;
        border-radius: $radius-full;
        background-color: $neutral-50;
        opacity: 10%;
        animation: loading 2000ms cubic-bezier(0.7, 0.1, 0.5, 0.9) infinite;

        @media (prefers-reduced-motion: reduce) {
            animation: none;
        }
    }

    @include tablet {
        &__top {
            flex-direction: row;
            padding: $spacing-250;
            gap: $spacing-300;
        }

        &__bottom {
            flex-direction: row;
            justify-content: space-between;
            padding: $spacing-200 $spacing-250;
        }

        &__rate {
            @include text-preset-5;

            &--unavailable {
                @include text-preset-5;
            }
        }
    }
}

@keyframes loading {
    50% {
        opacity: 5%;
    }
}
</style>