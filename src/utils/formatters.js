const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(val) {
  return currencyFormatter.format(val || 0);
}

export function formatPercentage(val, decimals = 2) {
  return (((val || 0) * 100).toFixed(decimals)).replace('.', ',') + '%';
}

export function round2(val) {
  return Math.round((val || 0) * 100) / 100;
}
