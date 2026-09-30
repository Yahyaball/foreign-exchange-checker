<script setup lang="ts">
import { computed, ref } from 'vue';
import { numberFormat } from '../../utils/format';
import CurrencyButton from '../ui/CurrencyButton.vue';
const inputField = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const props = defineProps<{
    send?: boolean
    modelValue: string
    amount: number
    isLoading?: boolean
}>()
const emit = defineEmits<{
    'update:modelValue': [value: string]
    'update:amount': [value: number]
}>()
const focusInput = () => {
    if (inputField.value) {
        inputField.value.focus()
    }
}
defineExpose({ focusInput })
const amountModel = computed({
    get: () => (props.send && isFocused.value) ? props.amount : numberFormat.format(props.amount),
    set: (value) => {
        const parsed = Number(String(value).replace(',', '.').replace(/[^\d.]/g, ''))
        if (Number.isFinite(parsed)) emit('update:amount', parsed)
    }
})

const onKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement
    if (e.ctrlKey || e.metaKey) return
    if (e.key.length > 1) return
    if (/\d/.test(e.key)) return
    if (e.key === "." && !target.value.includes('.')) {
        return
    }
    if (e.key === ".") {
        e.preventDefault()
    }
    e.preventDefault()
}

</script>

<template>
    <div class="converter-input">
        <p class="converter-input__text">{{ send ? 'Send' : 'Receive' }}</p>
        <div class="second-conversion" :class="send ? null : 'second-conversion--default'">
            <div class="second-conversion__divider" @click="focusInput">
                <div v-if="isLoading && !send" class="second-conversion__skeleton"></div>
                <input
v-else ref="inputField" v-model.number="amountModel" type="text" inputmode="decimal"
                    placeholder="0" class="second-conversion__input" :disabled="send ? false : true"
                    :class="{ 'second-conversion__input--lime': !send, 'second-conversion__input--empty': !amount }"
                    @keydown="onKeyDown" @blur="isFocused = false" @focus="isFocused = true"
                    @keydown.esc="inputField?.blur()">
            </div>
            <CurrencyButton
:target="send ? 'send' : 'receive'" :is-disabled="isLoading" :model-value="modelValue"
                @update:model-value="emit('update:modelValue', $event)" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.converter-input {
    display: flex;
    flex-direction: column;
    gap: $spacing-250;
    padding: $spacing-200;
    background-color: $neutral-600;
    border-radius: $radius-16;
    box-shadow: inset 0 0 0 1px $neutral-500;
    width: 100%;

    &__text {
        @include text-preset-4;
        text-transform: uppercase;
        color: $neutral-100;
    }

    .second-conversion {
        display: flex;
        align-items: center;
        cursor: text;
        gap: $spacing-200;

        &--default {
            cursor: default
        }

        &__divider {
            flex-grow: 1;
            min-width: 0;

            &:hover>.second-conversion__input {
                text-decoration: underline;
                text-decoration-color: $neutral-200;
            }
        }

        &__skeleton {
            width: 100%;
            height: 43px;
            border-radius: $radius-8;
            background-color: $neutral-200;
            opacity: 10%;
            animation: loading 2000ms cubic-bezier(0.7, 0.1, 0.5, 0.9) infinite;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        }

        &__input {
            @include text-preset-1-tablet;
            field-sizing: content;
            max-width: 100%;
            border: none;
            padding: 0;
            background: transparent;
            color: $neutral-50;
            -moz-appearance: textfield;
            appearance: textfield;
            outline: none;
            border-radius: $radius-8;

            &::placeholder {
                color: $neutral-200;
            }

            &:focus {
                text-decoration: underline;
                text-decoration-color: $neutral-600;
                box-shadow: 0px 0px 0px 2px $neutral-600, 0px 0px 0px 4px $lime-500;
            }

            &--lime {
                color: $lime-500
            }

            &--empty {
                color: $neutral-200
            }

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
        }
    }

    @include tablet {
        padding: $spacing-250;
    }
}

@keyframes loading {
    50% {
        opacity: 5%;
    }
}
</style>