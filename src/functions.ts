function calculateTotal(values: number[]): number {
  return values.reduce((sum: number, value: number) => sum + value, 0);
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return calculateTotal(values) / values.length;
}

function formatCurrency(amount: number, symbol: string): string {
  return `${amount} ${symbol}`;
}

function getTopValues(values: number[], count: number): number[] {
  return [...values].sort((a: number, b: number) => b - a).slice(0, count);
}

function printSummary(values: number[]): void {
  console.log(`Всего записей: ${values.length}`);
  console.log(`Сумма: ${calculateTotal(values)}`);
  console.log(`Среднее: ${calculateAverage(values)}`);
}

console.log(calculateTotal([1000, 2000, 3000]));
console.log(calculateAverage([1000, 2000, 3000]));
console.log(calculateAverage([]));
console.log(formatCurrency(1000, '₽'));
console.log(getTopValues([100, 500, 200, 800], 2));
printSummary([100, 500, 1000, 2000, 800]);
