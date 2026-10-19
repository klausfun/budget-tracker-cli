# Budget Tracker CLI

Консольное приложение для учёта личных финансов: счета, доходы и расходы, баланс, экспорт в CSV.
Учебный проект по дисциплине «Программирование на языке TypeScript и библиотеки фронтенд-разработки» (НИУ ВШЭ).

**Состояние: ДЗ 8 — declaration files.**

- Проект переведён с `namespace` на ES-модули (`"module": "ESNext"`, `"type": "module"`), запуск через `tsx`.
- Сторонние библиотеки с типами: `uuid` генерирует строковые id счетов и транзакций, `moment` форматирует даты.
- Своя нетипизированная библиотека `src/lib/budget-utils.js` (функция `formatCurrency`) и декларация типов к ней `src/lib/budget-utils.d.ts`.

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
│   └── IAccountManager.ts
├── classes/
│   ├── Transaction.ts
│   ├── Account.ts
│   └── AccountManager.ts
├── lib/
│   ├── budget-utils.js
│   └── budget-utils.d.ts
└── index.ts
```
