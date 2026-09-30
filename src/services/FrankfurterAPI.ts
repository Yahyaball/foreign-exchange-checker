import API from "./API";
export type Currency = {
  iso_code: string;
  iso_numeric: string;
  name: string;
  symbol: string;
  start_date: string;
  end_date: string;
};
export type Provider = {
  key: string;
  currencies: string[];
  end_date: string;
};
export type LatestRate = {
  rate: number;
  date: string;
  base: string;
  quote: string;
};
export type DateRange = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

export default {
  getProvider() {
    return API().get<Provider>("/providers/bdi");
  },
  getRates(base: string, quote: string, date?: string) {
    let url = `/providers/bdi/rates?base=${base}&quotes=${quote}`;
    if (date) {
      url += `&date=${date}`;
    }
    return API().get<LatestRate[]>(url);
  },
  getCurrencies() {
    return API().get<Currency[]>("/currencies");
  },
  getDateRange(base: string, quote: string, from: string, to: string) {
    return API().get<DateRange[]>(
      `/providers/bdi/rates?base=${base}&quotes=${quote}&from=${from}&to=${to}`,
    );
  },
  getCompare(base: string) {
    return API().get<LatestRate[]>(`providers/bdi/rates?base=${base}`);
  },
};
