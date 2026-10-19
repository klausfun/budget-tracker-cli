export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

export const TRANSACTION_TYPE_LABELS: Readonly<Record<TransactionType, string>> = {
  [TransactionType.Income]: 'доход',
  [TransactionType.Expense]: 'расход',
};
