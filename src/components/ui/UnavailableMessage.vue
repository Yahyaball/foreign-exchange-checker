<script setup lang="ts">
const props = defineProps({
    textWidth: {
        type: String,
        default: 'auto'
    }
})
</script>

<template>
    <div class="unavailable">
        <h2 class="unavailable__heading">
            <slot name="header"></slot>
        </h2>
        <p class="unavailable__text">
            <slot name="text"></slot>
        </p>
    </div>
</template>

<style lang="scss" scoped>
.unavailable {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: $spacing-200;
    padding-block: $spacing-500;

    &__heading {
        @include text-preset-2;
        color: $neutral-100;
    }

    &__text {
        @include text-preset-3-mobile;
        color: $neutral-200;
        max-width: v-bind('props.textWidth')
    }
}
</style>