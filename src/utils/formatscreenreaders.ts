export const numberFormat = new Intl.NumberFormat("en-US");

export const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const UNITS = [
  { seconds: 3601, short: "hours" },
  { seconds: 3600, short: "hour" },
  { seconds: 61, short: "minutes" },
  { seconds: 60, short: "minute" },
  { seconds: 2, short: "seconds" },
  { seconds: 1, short: "second" },
] as const;

const RECENT_THRESHOLD = 86400; // 7 days

export function formatEntryTime(iso: string): string {
  const diffSeconds = (Date.now() - new Date(iso).getTime()) / 1000;

  if (Math.abs(diffSeconds) > RECENT_THRESHOLD) {
    return dateFormat.format(new Date(iso));
  }

  for (const { seconds, short } of UNITS) {
    const value = Math.round(diffSeconds / seconds);
    if (value !== 0) {
      return `${value}${short}`;
    }
  }

  return "0S";
}
