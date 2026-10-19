# Budget Tracker CLI

Консольное приложение для учёта личных финансов: счета, доходы и расходы, баланс, экспорт в CSV.
Учебный проект по дисциплине «Программирование на языке TypeScript и библиотеки фронтенд-разработки» (НИУ ВШЭ).

**Состояние: ДЗ 10 — асинхронный код, экспорт в CSV.**

- `src/utils/escapeCsvValue.ts` — значения с запятой, кавычками или переносом строки оборачиваются в кавычки, внутренние `"` удваиваются.
- `Account.exportTransactionsToCSV(filePath): Promise<void>` — собирает CSV (`id,amount,type,date,description`) и асинхронно пишет файл через `fs/promises`. Каталог создаётся при необходимости, ошибки записи выбрасываются с понятным сообщением.
- `npm start` создаёт `exports/main_account.csv` и показывает обработку ошибки записи.

## Запуск

Нужен Node.js 20+.

```bash
npm install
npm start           # запуск через tsx
npm run typecheck   # проверка типов
```

## Структура

```
src/
├── interfaces/
│   ├── TransactionType.ts
│   ├── ITransaction.ts
│   ├── IAccount.ts
│   ├── ISummary.ts
│   ├── IAccountManager.ts
│   └── utility-types.ts
├── classes/
│   ├── Transaction.ts
│   ├── Account.ts
│   └── AccountManager.ts
├── lib/
│   ├── budget-utils.js
│   └── budget-utils.d.ts
├── utils/
│   └── escapeCsvValue.ts
└── index.ts
```
