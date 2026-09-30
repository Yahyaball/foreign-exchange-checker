<script setup lang="ts">
import Logo from '@/assets/shared/logo.svg'
import LogoLight from '@/assets/shared/logo-light.svg'
import { useCurrencies } from '../../composables/useCurrencies';
import { useDark } from '@vueuse/core';

const isDark = useDark()
const { currencies, providerKey } = useCurrencies()
</script>

<template>
    <div class="header">
        <img class="header__logo" :src="isDark ? Logo : LogoLight" alt="FX Checker">
        <p class="header__info-text">{{ `${currencies.length} CURRENCIES · EOD · ${providerKey} DATA` }}</p>
    </div>
</template>

<style lang="scss" scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-200;

    &__logo {
        height: 1.25rem;
    }

    &__info-text {
        @include text-preset-6;
        color: $neutral-200;
        text-align: end;
    }
}

@include tablet {
    .header {
        padding: $spacing-250 $spacing-300;

        &__logo {
            height: auto;
        }

        &__info-text {
            @include text-preset-4;
        }
    }
}
</style>