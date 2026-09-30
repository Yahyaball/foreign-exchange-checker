<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import ConverterPage from '../converter/ConverterPage.vue';
import HistoryPage from '../history/HistoryPage.vue';
import TabList from '../ui/TabList.vue';
import TabsComponent from '../ui/TabsComponent.vue';
import ComparePage from '../compare/ComparePage.vue';
import FavoritesPage from '../favorites/FavoritesPage.vue';
import { useFavorites } from '../../composables/useFavorites.ts';
import LogPage from '../log/LogPage.vue';
import { useLog } from '../../composables/useLog.ts';
import { useAnnounce } from '../../composables/useAnnounce.ts';
import { useFavicon, useDark, onKeyStroke } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import { isTypingTarget } from '../../utils/keyboard.ts';

const route = useRoute()
const router = useRouter()
const { favorites } = useFavorites()
const { entries } = useLog()
const { message } = useAnnounce()
const isDark = useDark()
function validCode(value: unknown, fallback: string): string {
    return typeof value === 'string' && /^[A-Z]{3}$/.test(value) ? value : fallback
}
const send = ref('USD')
const receive = ref('EUR')
const amount = ref(0)
const favoriteBadge = ref(0)
const logBadge = ref(0)
const pageTitle = computed(
    () => {
        return `FX_CHECKER - ${send.value} to ${receive.value}`
    }
)
const faviconUrl = computed(() => {
    if (isDark.value) {
        return '/icon.svg'
    } else {
        return '/icon-light.svg'
    }
})

const exchange = () => {
    const temp = send.value
    send.value = receive.value
    receive.value = temp
}

watchEffect(() => {
    favoriteBadge.value = favorites.value.length
    logBadge.value = entries.value.length
    document.title = pageTitle.value
})
watch(() => route.query.send, v => { send.value = validCode(v, 'USD') }, { immediate: true })
watch(() => route.query.receive, v => { receive.value = validCode(v, 'EUR') }, { immediate: true })
watch([send, receive], () => {
    router.replace({ query: { ...route.query, send: send.value, receive: receive.value } })
})

useFavicon(faviconUrl)

onKeyStroke('ArrowDown', (e) => {
    if (!e.altKey) return
    if (isTypingTarget(e.target)) return
    e.preventDefault()
    exchange()
})
</script>

<template>
    <div class="sr-only" aria-live="polite">{{ message }}</div>
    <div class="main">
        <div class="rate-check">
            <h1 class="rate-check__heading">Check the rate</h1>
            <ConverterPage v-model:send="send" v-model:receive="receive" v-model:amount="amount" @exchange="exchange" />
        </div>
        <div class="details-container">
            <TabsComponent>
                <TabList title="History">
                    <HistoryPage :send="send" :receive="receive" />
                </TabList>
                <TabList title="Compare">
                    <ComparePage
:send="send" :receive="receive" :amount="amount"
                        @select-currency="(value) => receive = value" />
                </TabList>
                <TabList title="Favorites" :badge="favoriteBadge">
                    <FavoritesPage @interact="(pair) => { send = pair.send; receive = pair.receive }" />
                </TabList>
                <TabList title="Log" :badge="logBadge">
                    <LogPage @interact="(pair) => { send = pair.send; receive = pair.receive }" />
                </TabList>
            </TabsComponent>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    padding: $spacing-400 $spacing-200;
    width: 100%;
    gap: $spacing-500;

    .rate-check {
        display: flex;
        flex-direction: column;
        gap: $spacing-200;

        &__heading {
            @include text-preset-2;
            text-transform: uppercase;
        }
    }

    .details-container {
        display: flex;
        flex-direction: column;
        gap: $spacing-200;
    }

    @include tablet {
        padding: $spacing-600 $spacing-300
    }

    @include desktop {
        width: 68.75rem;
        padding: $spacing-600 $spacing-400
    }
}
</style>