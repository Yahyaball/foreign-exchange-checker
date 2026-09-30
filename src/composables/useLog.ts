import { ref, watchEffect } from "vue";
import { downloadCsv, toCsv } from "../utils/csv.ts";

export interface LogEntry {
  time: string;
  from: string;
  to: string;
  amountFrom: number;
  amountTo: number;
  id: string;
  createdAt: string;
}

function loadEntries(): LogEntry[] {
  try {
    return JSON.parse(localStorage.getItem("fx-log-v1") || "[]");
  } catch (err) {
    console.warn(err);
    return [];
  }
}

const entries = ref<LogEntry[]>(loadEntries());

watchEffect(() => {
  localStorage.setItem("fx-log-v1", JSON.stringify(entries.value));
});

const log = (payload: Omit<LogEntry, "id" | "createdAt">): boolean => {
  const uuid = () =>
    crypto.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const newEntry: LogEntry = {
    ...payload,
    id: uuid(),
    createdAt: new Date().toISOString(),
  };
  entries.value = [newEntry, ...entries.value].slice(0, 50);
  return true;
};

const remove = (id: string) => {
  entries.value = entries.value.filter((e) => e.id !== id);
};

const clear = () => {
  entries.value = [];
};

const exportCsv = (): number => {
  const rows = entries.value.map((entry) => ({
    from: entry.from,
    to: entry.to,
    amountFrom: entry.amountFrom,
    amountTo: entry.amountTo,
    createdAt: entry.createdAt,
  }));

  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(`fx-log-${date}.csv`, toCsv(rows));

  return rows.length;
};

export function useLog() {
  return { entries, log, remove, clear, exportCsv };
}

if (import.meta.env.DEV) {
  Object.assign(window, { log, remove, clear, exportCsv, entries });
}
