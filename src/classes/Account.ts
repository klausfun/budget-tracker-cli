import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { LogClass } from '../decorators/LogClass';
import { LogMethod } from '../decorators/LogMethod';
import { getPropertyMetadata, Metadata } from '../decorators/Metadata';
import { ReadOnly } from '../decorators/ReadOnly';
import { formatCurrency } from '../lib/budget-utils';
import { IAccount } from '../interfaces/IAccount';
import { ISummary } from '../interfaces/ISummary';
import { TRANSACTION_TYPE_LABELS, TransactionType } from '../interfaces/TransactionType';
import { AccountUpdate } from '../interfaces/utility-types';
import { escapeCsvValue } from '../utils/escapeCsvValue';
import { Transaction } from './Transaction';

const CSV_HEADER: string = 'id,amount,type,date,description';

@LogClass
export class Account implements IAccount, ISummary {
  @ReadOnly
  public readonly id: string;

  @Metadata('description', 'Транзакции счёта')
  private transactions: Transaction[] = [];

  constructor(public name: string) {
    this.id = uuidv4();
  }

  get shortId(): string {
    return this.id.slice(0, 8);
  }

  get income(): number {
    return this.sumByType(TransactionType.Income);
  }

  get expenses(): number {
    return this.sumByType(TransactionType.Expense);
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  get transactionCount(): number {
    return this.transactions.length;
  }

  @LogMethod
  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  @LogMethod
  removeTransactionById(transactionId: string): boolean {
    const index: number = this.transactions.findIndex((t: Transaction) => t.id === transactionId);
    if (index === -1) {
      return false;
    }
    this.transactions.splice(index, 1);
    return true;
  }

  /** Копия списка транзакций, отсортированная по дате */
  @LogMethod
  getTransactions(): Transaction[] {
    return [...this.transactions].sort(
      (a: Transaction, b: Transaction) => Date.parse(a.date) - Date.parse(b.date),
    );
  }

  clearTransactions(): void {
    this.transactions = [];
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
    const description: string =
      getPropertyMetadata<string>('description', this, 'transactions') ?? 'Транзакции';
    return [
      `Счёт «${this.name}» [${this.shortId}]`,
      `Доходы: ${formatCurrency(this.income)} | Расходы: ${formatCurrency(this.expenses)} | Баланс: ${formatCurrency(this.balance)}`,
      `${description}: ${this.transactions.length} шт.`,
    ].join('\n');
  }

  toString(): string {
    const transactions: Transaction[] = this.getTransactions();
    if (transactions.length === 0) {
      return 'Транзакций пока нет';
    }
    const header: string = `${'№'.padEnd(3)} ${'Дата'.padEnd(19)} ${'Тип'.padEnd(7)} ${'Сумма'.padStart(18)}  Описание`;
    const rows: string[] = transactions.map(
      (t: Transaction, index: number) =>
        `${String(index + 1).padEnd(3)} ${t.formattedDate.padEnd(19)} ${TRANSACTION_TYPE_LABELS[t.type].padEnd(7)} ${t.formattedAmount.padStart(18)}  ${t.description}`,
    );
    const line: string = '─'.repeat(header.length + 10);
    return [header, line, ...rows].join('\n');
  }

  async exportTransactionsToCSV(filePath: string): Promise<void> {
    const rows: string[] = this.getTransactions().map((t: Transaction) =>
      [t.id, t.amount, t.type, t.date, t.description].map(escapeCsvValue).join(','),
    );
    // BOM нужен, чтобы Excel правильно открыл кириллицу
    const content: string = '﻿' + [CSV_HEADER, ...rows].join('\n') + '\n';

    try {
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, content, 'utf-8');
    } catch (error: unknown) {
      const reason: string = error instanceof Error ? error.message : String(error);
      throw new Error(`Не удалось записать файл «${filePath}»: ${reason}`);
    }
  }

  private sumByType(type: TransactionType): number {
    return this.transactions
      .filter((t: Transaction) => t.type === type)
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  }
}
