export function getFlagUrl(code: string): string {
  return `https://hatscripts.github.io/circle-flags/flags/${code.slice(0, 2).toLowerCase()}.svg`;
}

const fallback = getFlagUrl("xx");

export function onFlagError(e: Event) {
  const img = e.target as HTMLImageElement;
  if (img.src === fallback) return;
  img.src = fallback;
}
