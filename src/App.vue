<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './components/layout/AppHeader.vue';
import AppMain from './components/layout/AppMain.vue';
import AppOverlay from './components/layout/AppOverlay.vue';
import { onKeyStroke } from '@vueuse/core';
import { isTypingTarget } from './utils/keyboard.ts';
import { MotionConfig } from 'motion-v';

const keyboardShortcutHelp = ref(false)
onKeyStroke('?', (e) => {
  if (isTypingTarget(e.target)) return
  e.preventDefault()
  keyboardShortcutHelp.value = !keyboardShortcutHelp.value
})
onKeyStroke('Escape', (e) => {
  if (isTypingTarget(e.target)) return
  if (!keyboardShortcutHelp.value) return
  e.preventDefault()
  keyboardShortcutHelp.value = false
})

</script>

<template>
  <MotionConfig reduced-motion="user">
    <AppOverlay :show="keyboardShortcutHelp" @close="keyboardShortcutHelp = false" />
    <header :inert="keyboardShortcutHelp || undefined">
      <AppHeader />
    </header>
    <main :inert="keyboardShortcutHelp || undefined">
      <AppMain />
    </main>
  </MotionConfig>
</template>

<style lang="scss">
@use '@/styles/main.scss';

body {
  background: $neutral-900;
  color: $neutral-50;
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>