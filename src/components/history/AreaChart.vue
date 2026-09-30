<script setup lang="ts">
import { computed, onMounted, onUnmounted, onWatcherCleanup, ref, watch } from 'vue';
import FrankfurterAPI from '../../services/FrankfurterAPI';
import apexchart from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts';
import type ApexCharts from 'apexcharts';
import { useDark } from '@vueuse/core';

interface Data {
    date: string,
    base: string,
    quote: string,
    rate: number
}
const isDark = useDark()
const isBottom = ref<boolean>(false)
const handleScroll = () => {
    const bottomReached =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 165
    isBottom.value = bottomReached
}
const chartRef = ref<ApexCharts | null>(null)
const chartData = ref<Data[]>([])
const isLoading = ref(true)
const dateValue = ref('')
const emit = defineEmits(['isLoading'])
const props = defineProps<{
    send: string
    receive: string
    range: string
    rate: string
}>()

const lineChartSeries = computed(() => [
    {
        name: `${props.send}/${props.receive}`,
        data: chartData.value,
        parsing: { x: 'date', y: 'rate' }
    }
])
const lineChartOptions = ref<ApexOptions>({
    chart: {
        accessibility: {
            enabled: true,
            announcements: {
                enabled: true
            }
        },
        events: {
            zoomed: function () {
                window.scrollTo(0, document.body.scrollHeight)
            },
            click: function () {
                window.scrollTo(0, document.body.scrollHeight)
            },
            updated: function () {
                if (isBottom.value) {
                    window.scrollTo(0, document.body.scrollHeight)
                }
            }
        },
        height: '512px',
        type: 'area',
        fontFamily: "JetBrains Mono, monospace",
        toolbar: {
            show: false,
        },
        foreColor: isDark.value ? '#9D9D9D' : '#4B4B4B',
        background: 'transparent'
    },
    dataLabels: {
        enabled: false
    },
    colors: [isDark.value ? '#CEF739' : '#7fa006'],
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            gradientToColors: [isDark.value ? '#171719' : '#FAFAFB'],
            opacityFrom: 1,
            opacityTo: 0,
            stops: [0, 100],
        },
    },
    stroke: {
        curve: 'straight',
        width: 2
    },
    markers: {
        strokeColors: 'transparent'
    },
    xaxis: {
        type: 'datetime',
        labels: {
            formatter: function (value: string) {
                const d = new Date(value)
                return d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })
            },
            style: {
                fontSize: '10px'
            },
            offsetY: 0,
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },

    },
    tooltip: {
        style: {
            background: isDark.value ? '#171719' : '#FAFAFB'
        }
    },
    theme: {
        mode: isDark.value ? 'dark' : 'light'
    },
    grid: {
        borderColor: isDark.value ? '#2E2E2E' : '#EEEEEE',
        padding: {
            left: 0,
            right: 0,
            bottom: -5,
            top: -12
        }
    }
})
function sendLoading() {
    emit('isLoading', isLoading.value)
}
watch([() => props.send, () => props.receive, () => props.range], async ([newSend, newReceive, newRange]) => {
    let cancelled = false
    isLoading.value = true
    onWatcherCleanup(() => { cancelled = true })
    sendLoading()
    try {
        const providerResponse = await FrankfurterAPI.getProvider()
        if (cancelled) return
        const endDateStr = providerResponse.data.end_date
        const date = new Date(endDateStr)
        const todayDate = new Date(endDateStr)
        if (newRange === '1d') {
            date.setUTCDate(date.getUTCDate() - 1);
        }
        if (newRange === '1w') {
            date.setUTCDate(date.getUTCDate() - 7);
        }
        if (newRange === '1m') {
            date.setUTCMonth(date.getUTCMonth() - 1);
        }
        if (newRange === '3m') {
            date.setUTCMonth(date.getUTCMonth() - 3);
        }
        if (newRange === '1y') {
            date.setFullYear(date.getFullYear() - 1);
        }
        if (newRange === '5y') {
            date.setFullYear(date.getFullYear() - 5);
        }
        const isoString = date.toISOString().split('T')[0]
        const oneMonthResponse = await FrankfurterAPI.getDateRange(newSend, newReceive, isoString, endDateStr);
        if (cancelled) return
        chartData.value = oneMonthResponse.data
        const dateString = todayDate.toLocaleString('en-US', { month: 'short', day: '2-digit' })
        const timeString = todayDate.toLocaleString('en-US', { timeStyle: 'short', hour12: false })
        const timeZoneString = new Date().toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop();

        dateValue.value = `${dateString} ${timeString} ${timeZoneString}`
        if (newRange.endsWith('y')) {
            chartRef.value?.updateOptions({
                xaxis: {
                    labels: {
                        formatter: function (value: string) {
                            const d = new Date(value)
                            return d.toLocaleDateString('en-US', { timeZone: 'UTC', month: '2-digit', day: '2-digit', year: '2-digit' })
                        },
                    }
                }
            })
        } else {
            chartRef.value?.updateOptions({
                xaxis: {
                    labels: {
                        formatter: function (value: string) {
                            const d = new Date(value)
                            return d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })
                        },
                    }
                }
            })
        }
        const rates = chartData.value.map(i => i.rate)
        const min = rates.length > 0 ? Math.min(...rates) : 0
        const max = rates.length > 0 ? Math.max(...rates) : 0
        chartRef.value?.updateOptions({
            yaxis: {
                min: min,
                max: max,
                forceNiceScale: true,
                showForNullSeries: true,
                tickAmount: 2,
                labels: {
                    formatter: function (val: number) {
                        return val.toLocaleString()
                    },
                    style: {
                        fontSize: '10px'
                    },
                    offsetX: -17
                }
            }
        })
    } catch (err) {
        console.error(err)
    } finally {
        if (!cancelled) {
            isLoading.value = false
            sendLoading()
        }
    }
}, { immediate: true })
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
    <div class="chart">
        <div v-show="isLoading">
            <div class="chart__header">
                <div class="chart__title--skeleton"></div>
                <div class="chart__date-info--skeleton"></div>
            </div>
            <div class="chart__skeleton"></div>
        </div>
        <div v-show="!isLoading">
            <div class="chart__header">
                <p class="chart__title">{{ `${props.send}/${props.receive}` }}</p>
                <p class="chart__date-info">{{ `${props.rate} · ${dateValue}` }}</p>
            </div>
            <apexchart ref="chartRef" height="318px" :series="lineChartSeries" :options="lineChartOptions" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chart {
    background-color: $neutral-700;
    box-shadow: inset 0 0 0 1px $neutral-600;
    border-radius: $radius-16;
    padding: $spacing-200 $spacing-150;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-transform: uppercase;
        margin-bottom: $spacing-250;
    }

    &__title {
        @include text-preset-3-medium;

        &--skeleton {
            height: 1.2rem;
            background-color: $neutral-50;
            width: 4.75rem;
            border-radius: $radius-full;
            opacity: 10%;
            animation: loading 2000ms cubic-bezier(0.7, 0.1, 0.5, 0.9) infinite;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        }
    }

    &__skeleton {
        height: 318px;
        width: 100%;
        background-color: $lime-500;
        border-radius: $radius-12;
        opacity: 10%;
        animation: loading 2000ms cubic-bezier(0.7, 0.1, 0.5, 0.9) infinite;

        @media (prefers-reduced-motion: reduce) {
            animation: none;
        }
    }

    &__date-info {
        @include text-preset-5;
        opacity: 70%;

        &--skeleton {
            height: 0.9rem;
            background-color: $neutral-50;
            width: 12rem;
            border-radius: $radius-full;
            opacity: 10%;
            animation: loading 2000ms cubic-bezier(0.7, 0.1, 0.5, 0.9) infinite;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        }
    }

    @include tablet {
        padding: $spacing-250
    }
}

@keyframes loading {
    50% {
        opacity: 5%;
    }
}

.vue-apexcharts {
    min-height: auto !important
}
</style>