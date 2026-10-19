import { Account } from './classes/Account';
import { Transaction } from './classes/Transaction';
import {
  AmountType,
  CheckIncome1,
  CheckIncome2,
  CheckIncome3,
  TransactionDraft,
  TransactionReadonlyIdAndType,
  UnknownType,
} from './interfaces/mapped-types';

console.log("🚀 Budget Tracker CLI\n");

// Проверки типов на этапе компиляции: при неверном типе tsc выдаст ошибку
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;

export type TypeChecks = [
  Expect<Equal<AmountType, number>>,
  Expect<Equal<UnknownType, never>>,
  Expect<Equal<CheckIncome1, true>>,
  Expect<Equal<CheckIncome2, false>>,
  Expect<Equal<CheckIncome3, false>>,
];

// OptionalTransaction: черновик без даты и описания — допустим
const draft: TransactionDraft = { id: 'draft-1', amount: 300, type: 'expense' };
const description: string = draft.description ?? 'Без описания';
const date: string = draft.date ?? new Date().toISOString();

const account = new Account('Личный бюджет');
account.addTransaction(new Transaction(draft.amount, draft.type, date, description));
console.log('Транзакция из черновика:');
console.log(String(account));

// ReadonlyTransactionFields: id и type доступны только для чтения
const locked: TransactionReadonlyIdAndType = {
  id: 'tx-1',
  amount: 1000,
  type: 'income',
  date: '2023-01-01T00:00:00Z',
  description: 'Зарплата',
};
locked.amount = 1100; // можно
// locked.type = 'expense'; // ошибка компиляции: свойство только для чтения
console.log('\nReadonly id и type, изменённая сумма:', locked);
