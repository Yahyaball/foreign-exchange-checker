<script setup lang="ts">
</script>

<template>
    <button type="button" class="clear-button">Clear all</button>
</template>

<style lang="scss" scoped>
.clear-button {
    @include text-preset-5;
    padding: $spacing-100 $spacing-150;
    text-transform: uppercase;
    border-radius: $radius-8;
    border: 0;
    outline: 0;
    background-color: $neutral-600;
    box-shadow: inset 0 0 0 1px $neutral-400;
    color: $neutral-200;
    cursor: pointer;

    &:hover {
        background-color: $neutral-500;
    }

    &:focus-visible {
        box-shadow: inset 0 0 0 1px $neutral-500, 0px 0px 0px 3px $neutral-700, 0px 0px 0px 4px $lime-500;
    }
}
</style>