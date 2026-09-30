import { ref } from "vue";
import FrankfurterAPI from "../services/FrankfurterAPI";
import { type AxiosResponse } from "axios";

// module scope — shared across all consumers
const markets = ref<
  { base: string; quote: string; rate: number; change: number }[]
>([]);
const loading = ref(false);

const pairs = [
  { base: "EUR", quote: "USD" },
  { base: "USD", quote: "JPY" },
  { base: "GBP", quote: "USD" },
  { base: "AUD", quote: "USD" },
  { base: "USD", quote: "CAD" },
  { base: "USD", quote: "CHF" },
  { base: "NZD", quote: "USD" },
];
const hasRate = (response: AxiosResponse) =>
  response.data[0]?.rate !== undefined;

async function load() {
  loading.value = true;
  try {
    const requests = pairs.map((p) => FrankfurterAPI.getRates(p.base, p.quote));
    const responses = await Promise.all(requests);
    const firstResponse = responses.find(hasRate);
    if (!firstResponse) return;
    const date = new Date(firstResponse.data[0].date);
    date.setUTCDate(date.getUTCDate() - 1);
    const yesterday = date.toISOString().split("T")[0];
    const previousRequests = pairs.map((p) =>
      FrankfurterAPI.getRates(p.base, p.quote, yesterday),
    );
    const previousResponses = await Promise.all(previousRequests);
    const shaped = responses.map((res, i) => {
      const todayRow = res.data[0];
      const yesterdayRow = previousResponses[i].data[0];
      if (!todayRow || !yesterdayRow) return null;
      return {
        base: res.data[0].base,
        quote: res.data[0].quote,
        rate: todayRow.rate,
        change: ((todayRow.rate - yesterdayRow.rate) / yesterdayRow.rate) * 100,
      };
    });
    markets.value = shaped.filter((row) => row !== null);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

load();

export function useMarkets() {
  return { markets, loading };
}
