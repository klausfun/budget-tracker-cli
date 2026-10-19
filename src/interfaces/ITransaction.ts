import { TransactionType } from './TransactionType';

export interface ITransaction {
  readonly id: string;
  amount: number;
  type: TransactionType;
  /** Дата в формате ISO 8601 */
  date: string;
  description: string;
}
