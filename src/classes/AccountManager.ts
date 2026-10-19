import { formatCurrency } from '../lib/budget-utils';
import { IAccountManager } from '../interfaces/IAccountManager';
import { ISummary } from '../interfaces/ISummary';
import { Account } from './Account';

const EMPTY_SUMMARY: ISummary = { income: 0, expenses: 0, balance: 0 };

export class AccountManager implements IAccountManager<Account>, ISummary {
  private accounts: Account[] = [];

  get income(): number {
    return this.accounts.reduce((sum: number, a: Account) => sum + a.income, 0);
  }

  get expenses(): number {
    return this.accounts.reduce((sum: number, a: Account) => sum + a.expenses, 0);
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  addAccount(account: Account): void {
    if (this.getAccountById(account.id)) {
      throw new Error(`Счёт с id ${account.id} уже существует`);
    }
    this.accounts.push(account);
  }

  /** Удаляет счёт вместе со всеми его транзакциями */
  removeAccountById(accountId: string): boolean {
    const account: Account | undefined = this.getAccountById(accountId);
    if (!account) {
      return false;
    }
    account.clearTransactions();
    this.accounts = this.accounts.filter((a: Account) => a.id !== accountId);
    return true;
  }

  getAccountById(id: string): Account | undefined {
    return this.accounts.find((a: Account) => a.id === id);
  }

  hasAccountWithName(name: string): boolean {
    const normalized: string = name.trim().toLowerCase();
    return this.accounts.some((a: Account) => a.name.trim().toLowerCase() === normalized);
  }

  getAccounts(): Account[] {
    return [...this.accounts];
  }

  getAllAccounts(): Account[] {
    return this.getAccounts();
  }

  /** Без id — сводка по всем счетам, с id — по одному счёту */
  getSummary(accountId?: string): ISummary {
    if (accountId === undefined) {
      return { income: this.income, expenses: this.expenses, balance: this.balance };
    }
    return this.getAccountById(accountId)?.getSummary() ?? EMPTY_SUMMARY;
  }

  getSummaryString(): string {
    return `Счетов: ${this.accounts.length} | Общий баланс: ${formatCurrency(this.balance)}`;
  }

  toString(): string {
    const lines: string[] = this.accounts.map(
      (a: Account) => `${a.name}: ${formatCurrency(a.balance)} (${a.transactionCount} тр.)`,
    );
    return [...lines, this.getSummaryString()].join('\n');
  }
}
