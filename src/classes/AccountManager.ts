/// <reference path="../interfaces/IAccountManager.ts" />
/// <reference path="Account.ts" />

namespace BudgetTracker {
  export class AccountManager implements IAccountManager, ISummary {
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
      this.accounts.push(account);
    }

    removeAccountById(accountId: number): boolean {
      const index: number = this.accounts.findIndex((a: Account) => a.id === accountId);
      if (index === -1) {
        return false;
      }
      this.accounts.splice(index, 1);
      return true;
    }

    getAccountById(id: number): Account | undefined {
      return this.accounts.find((a: Account) => a.id === id);
    }

    getAllAccounts(): Account[] {
      return [...this.accounts];
    }

    getAccounts(): Account[] {
      return this.getAllAccounts();
    }

    // Без id — сводка по всем счетам, с id — по конкретному счёту
    getSummary(accountId?: number): ISummary {
      if (accountId === undefined) {
        return { income: this.income, expenses: this.expenses, balance: this.balance };
      }
      const account: Account | undefined = this.getAccountById(accountId);
      return account ? account.getSummary() : { income: 0, expenses: 0, balance: 0 };
    }

    getSummaryString(): string {
      return `Счетов: ${this.accounts.length}, общий баланс: ${this.balance} ₽`;
    }

    toString(): string {
      const lines: string[] = this.accounts.map((a: Account) => a.getSummaryString());
      const body: string = lines.length > 0 ? lines.join('\n') : 'Счетов пока нет';
      return `Все бюджеты:\n${body}\n${this.getSummaryString()}`;
    }
  }
}
