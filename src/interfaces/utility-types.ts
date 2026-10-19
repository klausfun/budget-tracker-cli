import type { Transaction } from '../classes/Transaction';
import { IAccount } from './IAccount';
import { ITransaction } from './ITransaction';
import { TransactionType } from './TransactionType';

// id исключён: идентификатор после создания менять нельзя
export type TransactionUpdate = Partial<Omit<ITransaction, 'id'>>;
export type AccountUpdate = Partial<Pick<IAccount, 'name'>>;

export type CompleteTransaction = Required<ITransaction>;
export type TransactionWithoutDescription = Omit<ITransaction, 'description'>;

export type TransactionPreview = Pick<ITransaction, 'id' | 'amount' | 'type' | 'date'>;
export type AccountInfo = Pick<IAccount, 'id' | 'name'>;

export type CategoryLimits = Record<TransactionType, number>;

export type TransactionConstructorParams = ConstructorParameters<typeof Transaction>;
export type TransactionInstance = InstanceType<typeof Transaction>;

export type NullableDescription = Omit<ITransaction, 'description'> & {
  description: string | null;
};

// Предельная сумма одной транзакции — используется при валидации ввода
export const TRANSACTION_LIMITS: Readonly<CategoryLimits> = {
  [TransactionType.Income]: 100_000_000,
  [TransactionType.Expense]: 100_000_000,
};
