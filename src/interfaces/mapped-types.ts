import { ITransaction } from './ITransaction';
import { TransactionType } from './TransactionType';

export type TransactionFieldType<TField> = TField extends keyof ITransaction
  ? ITransaction[TField]
  : never;

export type OptionalTransaction<TFields extends keyof ITransaction> =
  Omit<ITransaction, TFields> & { [K in TFields]?: ITransaction[K] };

export type ReadonlyTransactionFields<TFields extends keyof ITransaction> =
  Omit<ITransaction, TFields> & { readonly [K in TFields]: ITransaction[K] };

export type IsIncome<T> = T extends { type: TransactionType.Income } ? true : false;

// Примеры использования
export type AmountType = TransactionFieldType<'amount'>; // number
export type UnknownType = TransactionFieldType<'unknown'>; // never

// Черновик транзакции из формы: дата и описание могут быть ещё не заполнены
export type TransactionDraft = OptionalTransaction<'description' | 'date'>;
export type TransactionReadonlyIdAndType = ReadonlyTransactionFields<'id' | 'type'>;

export type CheckIncome1 = IsIncome<{ type: TransactionType.Income; amount: number }>; // true
export type CheckIncome2 = IsIncome<{ type: TransactionType.Expense; amount: number }>; // false
export type CheckIncome3 = IsIncome<ITransaction>; // false — type может быть и доходом, и расходом
