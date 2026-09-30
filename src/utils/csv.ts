const FORMULA_RISK = /^[=+\-@\t\r]/;

function escapeField(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);
  const guarded = FORMULA_RISK.test(raw) ? `'${raw}` : raw;
  return `"${guarded.replaceAll('"', '""')}"`;
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  const lines = [headers.map(escapeField).join(",")];

  for (const row of rows) {
    lines.push(headers.map((header) => escapeField(row[header])).join(","));
  }

  return lines.join("\r\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
