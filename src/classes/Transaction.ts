/// <reference path="../interfaces/ITransaction.ts" />

namespace BudgetTracker {
  const TYPE_LABELS: Record<TransactionType, string> = {
    income: 'доход',
    expense: 'расход',
  };

  export class Transaction implements ITransaction {
    constructor(
      public readonly id: number,
      public readonly amount: number,
      public readonly type: TransactionType,
      public readonly date: string,
      public readonly description: string,
    ) {}

    get formattedDate(): string {
      return new Date(this.date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }

    toString(): string {
      return `${this.id}) ${this.description} (${TYPE_LABELS[this.type]} ${this.amount} ₽) | ${this.formattedDate}`;
    }
  }
}
