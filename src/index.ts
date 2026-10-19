import { IAccount, IAccountManager, ISummary, ITransaction } from './types';

console.log("🚀 Budget Tracker CLI");

const accountManager: IAccountManager & { accounts: IAccount[] } = {
  accounts: [],
  addAccount(account: IAccount): void {
    this.accounts.push(account);
  },
  removeAccountById(accountId: number): boolean {
    const index: number = this.accounts.findIndex((a: IAccount) => a.id === accountId);
    if (index === -1) {
      return false;
    }
    this.accounts.splice(index, 1);
    return true;
  },
  getAccounts(): IAccount[] {
    return [...this.accounts];
  },
  getAccountById(id: number): IAccount | undefined {
    return this.accounts.find((a: IAccount) => a.id === id);
  },
  getSummary(accountId: number): ISummary {
    const account: IAccount | undefined = this.getAccountById(accountId);
    const transactions: ITransaction[] = account ? account.getTransactions() : [];
    const income: number = transactions
      .filter((t: ITransaction) => t.type === 'income')
      .reduce((sum: number, t: ITransaction) => sum + t.amount, 0);
    const expenses: number = transactions
      .filter((t: ITransaction) => t.type === 'expense')
      .reduce((sum: number, t: ITransaction) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }
};

const account: IAccount & { transactions: ITransaction[] } = {
  id: 1,
  name: "Личный бюджет",
  transactions: [],
  addTransaction(transaction: ITransaction): void {
    this.transactions.push(transaction);
  },
  removeTransactionById(transactionId: number): boolean {
    const index: number = this.transactions.findIndex((t: ITransaction) => t.id === transactionId);
    if (index === -1) {
      return false;
    }
    this.transactions.splice(index, 1);
    return true;
  },
  getTransactions(): ITransaction[] {
    return [...this.transactions];
  }
};

account.addTransaction({
  id: 1,
  amount: 1000,
  type: 'income',
  date: '2023-01-01T00:00:00Z',
  description: 'Зарплата за январь'
});

account.addTransaction({
  id: 2,
  amount: 200,
  type: 'expense',
  date: '2023-01-05T00:00:00Z',
  description: 'Покупка продуктов'
});

account.addTransaction({
  id: 3,
  amount: 150,
  type: 'expense',
  date: '2023-01-10T00:00:00Z',
  description: 'Оплата коммунальных услуг'
});

accountManager.addAccount(account);
console.log("Список всех бюджетов:", accountManager.getAccounts());
console.log("Сводная информация о бюджете:", accountManager.getSummary(1));
console.log("Удаление транзакции #3:", account.removeTransactionById(3));
console.log("Сводная информация после удаления:", accountManager.getSummary(1));
accountManager.removeAccountById(account.id);
console.log("Список всех бюджетов:", accountManager.getAccounts());
