export const numberFormat = new Intl.NumberFormat("en-US");

export const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export const relativeTimeFormat = new Intl.RelativeTimeFormat("en-US", {
  numeric: "always",
});

const UNITS = [
  { seconds: 3600, short: "H", unit: "hour" },
  { seconds: 60, short: "M", unit: "minute" },
  { seconds: 1, short: "S", unit: "second" },
] as const;

const RECENT_THRESHOLD = 86400; // 1 day

type TimeStyle = "short" | "long";

export function formatEntryTime(iso: string, style: TimeStyle = "short"): string {
  const diffSeconds = (Date.now() - new Date(iso).getTime()) / 1000;

  if (Math.abs(diffSeconds) > RECENT_THRESHOLD) {
    return dateFormat.format(new Date(iso));
  }

  for (const { seconds, short, unit } of UNITS) {
    const value = Math.round(diffSeconds / seconds);
    if (value !== 0) {
      return style === "long"
        ? relativeTimeFormat.format(value, unit)
        : `${value}${short}`;
    }
  }

  return style === "long"
    ? relativeTimeFormat.format(0, "second")
    : "0S";
}
