# Budget Tracker CLI

Консольное приложение для учёта личных финансов: счета, доходы и расходы, баланс, экспорт в CSV.
Всё управление — через интерактивное меню на [`inquirer`](https://www.npmjs.com/package/inquirer).

Учебный проект по дисциплине «Программирование на языке TypeScript и библиотеки фронтенд-разработки» (НИУ ВШЭ).

## Требования

- Node.js **20.17+** (проверено на Node 24)
- npm

## Установка и запуск

```bash
git clone https://github.com/klausfun/budget-tracker-cli.git
cd budget-tracker-cli
npm install
npm start
```

| Команда | Что делает |
|---------|------------|
| `npm start` | запуск приложения (через `tsx`, без отдельной сборки) |
| `npm run dev` | запуск с перезапуском при изменении файлов |
| `npm run typecheck` | проверка типов `tsc --noEmit` |

Логи декораторов `@LogClass` и `@LogMethod` по умолчанию выключены, чтобы не мешать меню. Включить:

```bash
# macOS / Linux / Git Bash
BUDGET_DEBUG=1 npm start
# Windows PowerShell
$env:BUDGET_DEBUG=1; npm start
```

## Что умеет

При запуске создаются два счёта с транзакциями («Личный бюджет», «Копилка на отпуск»).

- **Главное меню** — список счетов с балансом и числом транзакций, общий баланс, создание счёта, выход.
- **Создание счёта** — название проверяется: не пустое, до 40 символов, без повторов. ID — UUID.
- **Просмотр счёта** — доходы, расходы, баланс и таблица транзакций, отсортированных по дате.
- **Добавление транзакции** — тип (доход / расход), сумма (больше 0 и не больше 100 000 000 ₽, до двух знаков после запятой, можно через запятую), дата `YYYY-MM-DD` (по умолчанию сегодня, проверяется существование даты), описание.
- **Удаление транзакции** — выбор из списка, подтверждение, пункт «Отмена». Если транзакций нет — сообщение.
- **Удаление счёта** — подтверждение, счёт удаляется вместе со всеми транзакциями.
- **Экспорт в CSV** — имя файла без расширения (есть вариант по умолчанию), файл пишется в `exports/<имя>.csv`. Если файл уже есть — спрашивает, перезаписать ли. Значения с запятыми, кавычками и переносами строк экранируются, кириллица открывается в Excel (UTF-8 с BOM).

После каждого действия экран обновляется через `console.clear()`, а результат показывается строкой сверху. `Ctrl+C` завершает программу без падения.

## Структура проекта

```
budget-tracker-cli/
├── src/
│   ├── interfaces/
│   │   ├── TransactionType.ts      # enum TransactionType + подписи типов
│   │   ├── ITransaction.ts
│   │   ├── IAccount.ts
│   │   ├── ISummary.ts
│   │   ├── IAccountManager.ts      # обобщённый интерфейс IAccountManager<TAccount>
│   │   ├── utility-types.ts        # Partial, Pick, Omit, Record, ConstructorParameters…
│   │   └── mapped-types.ts         # условные и сопоставленные типы
│   ├── classes/
│   │   ├── Transaction.ts
│   │   ├── Account.ts              # сводка, toString, экспорт в CSV
│   │   ├── AccountManager.ts
│   │   └── ApplicationController.ts # меню и сценарии inquirer
│   ├── lib/
│   │   ├── budget-utils.js         # нетипизированная JS-библиотека formatCurrency
│   │   └── budget-utils.d.ts       # её декларация типов
│   ├── utils/
│   │   └── escapeCsvValue.ts
│   ├── decorators/
│   │   ├── LogClass.ts
│   │   ├── LogMethod.ts
│   │   ├── Metadata.ts             # reflect-metadata
│   │   └── ReadOnly.ts
│   └── index.ts                    # начальные данные и запуск контроллера
├── package.json
├── tsconfig.json
└── README.md
```

## Классы

| Класс | Ответственность |
|-------|-----------------|
| `Transaction` | одна операция: сумма, тип, дата, описание; UUID, форматирование через `moment` и `formatCurrency`, `update()` |
| `Account` | счёт: транзакции, геттеры `income` / `expenses` / `balance`, `getSummary()`, `getSummaryString()`, `toString()`, `exportTransactionsToCSV()` |
| `AccountManager` | коллекция счетов: добавление, поиск, удаление вместе с транзакциями, общая сводка |
| `ApplicationController` | интерактивный интерфейс: `start`, `createAccount`, `watchAccount`, `addTransaction`, `removeTransaction`, `removeAccount`, `exportTransactionsToCSV` |

## Типизация

- `strict: true`, плюс `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters`.
- Явного `any` нет, кроме сигнатуры конструктора в `@LogClass`: TypeScript разрешает наследоваться от обобщённого конструктора только с `(...args: any[])` (ошибка TS2545).
- Пункты меню описаны через `enum` и размеченное объединение `MainMenuChoice`, параметры новой транзакции собираются в кортеж `TransactionConstructorParams`.

## История

Проект собирался по шагам домашних заданий курса. Состояние после каждого задания сохранено в своей ветке:

- [`hw1`](https://github.com/klausfun/budget-tracker-cli/tree/hw1) — настройка проекта, tsconfig, npm-скрипты
- [`hw2`](https://github.com/klausfun/budget-tracker-cli/tree/hw2) — базовые типы и вычисления
- [`hw3`](https://github.com/klausfun/budget-tracker-cli/tree/hw3) — типизированные функции
- [`hw4`](https://github.com/klausfun/budget-tracker-cli/tree/hw4) — интерфейсы и типы
- [`hw5`](https://github.com/klausfun/budget-tracker-cli/tree/hw5) — классы `Transaction`, `Account`, `AccountManager`
- [`hw6`](https://github.com/klausfun/budget-tracker-cli/tree/hw6) — обобщённое хранилище `GenericStorage<T>`
- [`hw7`](https://github.com/klausfun/budget-tracker-cli/tree/hw7) — `namespace BudgetTracker`, сборка в один файл
- [`hw8`](https://github.com/klausfun/budget-tracker-cli/tree/hw8) — ES-модули, `uuid`, `moment`, declaration file
- [`hw9`](https://github.com/klausfun/budget-tracker-cli/tree/hw9) — утилитные типы, методы `update()`
- [`hw10`](https://github.com/klausfun/budget-tracker-cli/tree/hw10) — асинхронный экспорт в CSV
- [`hw11`](https://github.com/klausfun/budget-tracker-cli/tree/hw11) — условные и сопоставленные типы
- [`hw12`](https://github.com/klausfun/budget-tracker-cli/tree/hw12) — декораторы и `reflect-metadata`
- `main` — итоговое задание
