# Budget Tracker CLI

Консольное приложение для учёта личных финансов: счета, доходы и расходы, баланс, экспорт в CSV.
Учебный проект по дисциплине «Программирование на языке TypeScript и библиотеки фронтенд-разработки» (НИУ ВШЭ).

**Состояние: ДЗ 11 — условные и сопоставленные типы.**

`src/interfaces/mapped-types.ts`:

- `TransactionFieldType<TField>` — тип поля `ITransaction`, для чужого ключа `never`;
- `OptionalTransaction<TFields>` — указанные поля становятся необязательными (пример — черновик `TransactionDraft`);
- `ReadonlyTransactionFields<TFields>` — указанные поля только для чтения;
- `IsIncome<T>` — `true`, если `type` у `T` — `'income'`.

В `src/index.ts` типы проверяются на этапе компиляции (`Expect<Equal<…>>`): если тип посчитан неверно, `npm run typecheck` упадёт.

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
└── index.ts
```
