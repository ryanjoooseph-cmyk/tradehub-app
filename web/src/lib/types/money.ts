export function moneyAUD(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format((cents || 0) / 100);
}
