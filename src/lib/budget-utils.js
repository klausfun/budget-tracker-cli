// Нетипизированная JS-библиотека форматирования сумм. Типы — в budget-utils.d.ts
export function formatCurrency(amount, symbol = '₽') {
  const formatted = amount.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatted + ' ' + symbol;
}
