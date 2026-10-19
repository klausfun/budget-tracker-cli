/// <reference path="../interfaces/IAccount.ts" />
/// <reference path="../interfaces/ISummary.ts" />
/// <reference path="Transaction.ts" />

namespace BudgetTracker {
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
}
