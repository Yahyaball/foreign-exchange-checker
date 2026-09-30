import { ref } from "vue";
import FrankfurterAPI from "../services/FrankfurterAPI";
import type { Currency } from "../services/FrankfurterAPI";

const currencies = ref<Currency[]>([]);
const providerKey = ref("");

async function load() {
  const currenciesResponse = await FrankfurterAPI.getCurrencies();
  const providerResponse = await FrankfurterAPI.getProvider();
  const currenciesData = currenciesResponse.data;
  const providerData = providerResponse.data.currencies;
  const filtered = currenciesData.filter((c) =>
    providerData.includes(c.iso_code),
  );
  currencies.value = filtered;
  providerKey.value = providerResponse.data.key;
}

load();

export function useCurrencies() {
  return { currencies, providerKey };
}
