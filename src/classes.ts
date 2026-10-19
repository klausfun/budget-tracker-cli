import { IAccount, IAccountManager, ISummary, ITransaction, TransactionType } from './types';

const TYPE_LABELS: Record<TransactionType, string> = {
  income: 'доход',
  expense: 'расход',
};

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export class Transaction implements ITransaction {
  constructor(
    public readonly id: number,
    public readonly amount: number,
    public readonly type: TransactionType,
    public readonly date: string,
    public readonly description: string,
  ) {}

  toString(): string {
    return `${this.id}) ${this.description} (${TYPE_LABELS[this.type]} ${this.amount} ₽) | ${formatDate(this.date)}`;
  }
}

export class Account implements IAccount, ISummary {
  private transactions: Transaction[] = [];

  constructor(
    public readonly id: number,
    public name: string,
  ) {}

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

  removeTransactionById(transactionId: number): boolean {
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

  getSummary(): ISummary {
    return {
      income: this.income,
      expenses: this.expenses,
      balance: this.balance,
    };
  }

  getSummaryString(): string {
    return `${this.name}: баланс ${this.balance} ₽, транзакций: ${this.transactions.length}`;
  }

  toString(): string {
    const lines: string[] = this.transactions.map((t: Transaction) => t.toString());
    const body: string = lines.length > 0 ? lines.join('\n') : 'Транзакций пока нет';
    return `${this.id}) ${this.name}\nСписок транзакций:\n${body}`;
  }

  private sumByType(type: TransactionType): number {
    return this.transactions
      .filter((t: Transaction) => t.type === type)
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  }
}

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
