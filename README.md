# Budget Tracker CLI

Консольное приложение для учёта личных финансов: счета, доходы и расходы, баланс, экспорт в CSV.
Учебный проект по дисциплине «Программирование на языке TypeScript и библиотеки фронтенд-разработки» (НИУ ВШЭ).

## Запуск

```bash
npm install
npm run build
npm start                     # src/index.ts — демонстрация классов
node dist/functions.js        # утилиты для анализа бюджета
node dist/calculation-demo.js # базовые вычисления
```

## Структура

| Файл | Что внутри |
|------|------------|
| `src/types.ts` | `TransactionType`, `ITransaction`, `IAccount`, `ISummary`, `IAccountManager` |
| `src/classes.ts` | классы `Transaction`, `Account`, `AccountManager` |
| `src/functions.ts` | функции `calculateTotal`, `calculateAverage`, `formatCurrency`, `getTopValues`, `printSummary` |
| `src/calculation-demo.ts` | доход, расход, сбережения и остаток |
| `src/index.ts` | пример работы со счетами и транзакциями |
