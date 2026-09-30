<script setup lang="ts">
import ArrowRight from '@/assets/icons/icon-arrow-right.svg'
import DeleteButton from '../ui/DeleteButton.vue';
import { type LogEntry } from '../../composables/useLog.ts';
import { numberFormat, formatEntryTime } from '../../utils/format.ts';
import { getCurrencyName } from '../../utils/currencies.ts';

const { entry } = defineProps<{ entry: LogEntry }>()
const emit = defineEmits(['delete', 'interact'])
</script>

<template>
    <div
class="log-item" tabindex="0" @click="emit('interact', { send: entry.from, receive: entry.to })"
        @keydown.l.prevent="emit('delete')">
        <div class="log-item__left">
            <p class="log-item__time">
                <span aria-hidden="true">{{ formatEntryTime(entry.createdAt) }}</span>
                <span class="sr-only">{{ formatEntryTime(entry.createdAt, 'long') }}</span>
            </p>

            <p class="log-item__currency-pair">
                <span class="log-item__currencies" aria-hidden="true">{{ entry.from }}<img :src="ArrowRight" alt="to">{{
                    entry.to }}</span>
                <span class="sr-only">{{ getCurrencyName(entry.from) }} to {{ getCurrencyName(entry.to) }}</span>
            </p>
        </div>
        <div class="log-item__right">

            <p class="log-item__send">{{ numberFormat.format(entry.amountFrom) }}</p>
            <p class="log-item__receive">{{ numberFormat.format(entry.amountTo) }}</p>
        </div>
        <DeleteButton
:from="entry.from" :to="entry.to" :amount-from="entry.amountFrom" :amount-to="entry.amountTo"
            @delete="emit('delete')" />
    </div>
</template>

<style lang="scss" scoped>
.log-item {
    display: flex;
    gap: $spacing-125;
    padding: $spacing-150;
    border-radius: $radius-10;
    background-color: $neutral-600;
    box-shadow: inset 0 0 0 1px $neutral-500;
    align-items: center;
    cursor: pointer;
    border: 0;
    outline: 0;

    &:hover {
        box-shadow: inset 0 0 0 1px $neutral-300;
    }

    &:focus-visible {
        box-shadow: inset 0 0 0 1px $neutral-300, 0px 0px 0px 2px $neutral-900, 0px 0px 0px 4px $lime-500;
    }

    &__left {
        @include text-preset-4;
        display: flex;
        flex-direction: column;
        gap: $spacing-050;
        flex-grow: 1;
    }

    &__time {
        text-shadow: 0 4px 4px rgba($neutral-900, 25%);
        color: $neutral-200;
        width: 2rem;
    }

    &__currencies {
        display: flex;
        gap: $spacing-100;
    }

    &__right {
        @include text-preset-3;
        display: flex;
        flex-direction: column;
        gap: $spacing-025;
        text-align: right;
        align-items: flex-end;
        overflow-x: auto;
        overflow-y: hidden;
    }

    &__send {
        color: $neutral-100;
    }

    &__receive {
        color: $lime-500;
    }

    @include tablet {
        gap: $spacing-200;
        padding: $spacing-200
    }

    &__left,
    &__right {
        gap: $spacing-200;
        flex-direction: row;
        align-items: center;
    }

    &__time {
        min-width: auto;
    }

    @include tablet {
        &__time {
            min-width: 4rem;
        }
    }
}
</style>