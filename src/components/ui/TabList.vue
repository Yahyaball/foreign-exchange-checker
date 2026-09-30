<script setup lang="ts">
import { inject } from 'vue';
const props = defineProps<{
    title: string
    badge?: number
}>()
const selectedTitle = inject('selectedTitle')
</script>

<template>
    <div v-if="props.title == selectedTitle">
        <slot></slot>
    </div>
</template>