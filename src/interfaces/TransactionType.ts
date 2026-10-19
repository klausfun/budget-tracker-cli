export type TransactionType = 'income' | 'expense';

export const TRANSACTION_TYPE_LABELS: Readonly<Record<TransactionType, string>> = {
  income: 'доход',
  expense: 'расход',
};
