<script setup lang="ts">
defineProps<{ count: number }>();
const emit = defineEmits<{ export: [] }>();
</script>

<template>
    <button type="button" class="export-button" @click="emit('export')">
        Export CSV
        <span class="sr-only">, {{ count }} entries</span>
    </button>
</template>

<style lang="scss" scoped>
.export-button {
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
