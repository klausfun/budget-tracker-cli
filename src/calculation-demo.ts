const income: number = 120000;
const expenses: number = 85000;
const savings: number = 20000;

const netIncome: number = income - expenses;
const remaining: number = netIncome - savings;

console.log(`Доход за месяц: ${income}`);
console.log(`Расход за месяц: ${expenses}`);
console.log(`Хочу отложить: ${savings}`);
console.log(`Чистый доход: ${netIncome}`);
console.log(`Остаток после сбережений: ${remaining}`);
