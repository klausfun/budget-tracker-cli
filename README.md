# Budget Tracker CLI

Консольное приложение для учёта личных финансов: счета, доходы и расходы, баланс, экспорт в CSV.
Учебный проект по дисциплине «Программирование на языке TypeScript и библиотеки фронтенд-разработки» (НИУ ВШЭ).

**Состояние: ДЗ 12 — декораторы и метапрограммирование.**

В `tsconfig.json` включены `experimentalDecorators` и `emitDecoratorMetadata`. Декораторы в `src/decorators/` применены к классу `Account`:

- `@LogClass` — пишет в консоль, когда создаётся счёт, и с какими аргументами;
- `@LogMethod` на `addTransaction`, `removeTransactionById`, `getTransactions` — пишет вызов с аргументами и возвращённое значение;
- `@ReadOnly` на `id` — значение задаётся один раз в конструкторе, повторная запись выбрасывает ошибку;
- `@Metadata('description', …)` на `transactions` — описание хранится через `reflect-metadata` и выводится в `getSummaryString()`.

`npm start` показывает все четыре декоратора, включая попытку изменить `id`.

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
│   ├── utility-types.ts
│   └── mapped-types.ts
├── classes/
│   ├── Transaction.ts
│   ├── Account.ts
│   └── AccountManager.ts
├── lib/
│   ├── budget-utils.js
│   └── budget-utils.d.ts
├── utils/
│   └── escapeCsvValue.ts
├── decorators/
│   ├── LogClass.ts
│   ├── LogMethod.ts
│   ├── Metadata.ts
│   └── ReadOnly.ts
└── index.ts
```
