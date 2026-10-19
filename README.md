# Budget Tracker CLI

Консольное приложение для учёта личных финансов: счета, доходы и расходы, баланс, экспорт в CSV.
Учебный проект по дисциплине «Программирование на языке TypeScript и библиотеки фронтенд-разработки» (НИУ ВШЭ).

**Состояние: ДЗ 7 — модули и пространства имён.** Все интерфейсы и классы лежат в отдельных файлах внутри общего `namespace BudgetTracker`, связаны через `/// <reference>` и собираются в один файл `dist/budget-tracker.js` (`"module": "none"`, `outFile`).

## Запуск

```bash
npm install
npm run build
npm start
```

## Структура

```
src/
├── interfaces/
│   ├── TransactionType.ts
│   ├── ITransaction.ts
│   ├── IAccount.ts
│   ├── ISummary.ts
│   └── IAccountManager.ts
├── classes/
│   ├── Transaction.ts
│   ├── Account.ts
│   └── AccountManager.ts
└── index.ts
```
