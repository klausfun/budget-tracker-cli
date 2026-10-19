import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../lib/budget-utils';
import { IAccount } from '../interfaces/IAccount';
import { ISummary } from '../interfaces/ISummary';
import { TransactionType } from '../interfaces/TransactionType';
import { AccountUpdate } from '../interfaces/utility-types';
import { Transaction } from './Transaction';

export class Account implements IAccount, ISummary {
  public readonly id: string;
  private transactions: Transaction[] = [];

  constructor(public name: string) {
    this.id = uuidv4();
  }

  get shortId(): string {
    return this.id.slice(0, 8);
  }

  get income(): number {
    return this.sumByType('income');
  }

  get expenses(): number {
    return this.sumByType('expense');
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  removeTransactionById(transactionId: string): boolean {
    const index: number = this.transactions.findIndex((t: Transaction) => t.id === transactionId);
    if (index === -1) {
      return false;
    }
    this.transactions.splice(index, 1);
    return true;
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  update(update: AccountUpdate): void {
    if (update.name !== undefined) {
      this.name = update.name;
    }
  }

  getSummary(): ISummary {
    return {
      income: this.income,
      expenses: this.expenses,
      balance: this.balance,
    };
  }

  getSummaryString(): string {
    return `${this.name} [${this.shortId}]: баланс ${formatCurrency(this.balance)}, транзакций: ${this.transactions.length}`;
  }

  toString(): string {
    const lines: string[] = this.transactions.map((t: Transaction) => t.toString());
    const body: string = lines.length > 0 ? lines.join('\n') : 'Транзакций пока нет';
    return `${this.name} [${this.shortId}]\nСписок транзакций:\n${body}`;
  }

  private sumByType(type: TransactionType): number {
    return this.transactions
      .filter((t: Transaction) => t.type === type)
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  }
}
