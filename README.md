# Budget Tracker CLI

Консольное приложение для учёта личных финансов: счета, доходы и расходы, баланс, экспорт в CSV.
Учебный проект по дисциплине «Программирование на языке TypeScript и библиотеки фронтенд-разработки» (НИУ ВШЭ).

**Состояние: ДЗ 9 — утилитные типы.**

- `src/interfaces/utility-types.ts`: `TransactionUpdate` и `AccountUpdate` (`Partial`), `CompleteTransaction` (`Required`), `TransactionWithoutDescription` (`Omit`), `TransactionPreview` и `AccountInfo` (`Pick`), `CategoryLimits` (`Record`), `TransactionConstructorParams` и `TransactionInstance` (`ConstructorParameters`, `InstanceType`), `NullableDescription`.
- Методы `Transaction.update()` и `Account.update()` для частичного обновления. У полей снят `readonly`, кроме `id`.
- В `TransactionUpdate` нет `id` (`Partial<Omit<ITransaction, 'id'>>`) — идентификатор менять нельзя.

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
└── index.ts
```
