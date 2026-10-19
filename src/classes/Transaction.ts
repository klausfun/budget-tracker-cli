import moment from 'moment';
import 'moment/locale/ru';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../lib/budget-utils';
import { ITransaction } from '../interfaces/ITransaction';
import { TRANSACTION_TYPE_LABELS, TransactionType } from '../interfaces/TransactionType';

export class Transaction implements ITransaction {
  public readonly id: string;

  constructor(
    public readonly amount: number,
    public readonly type: TransactionType,
    public readonly date: string,
    public readonly description: string,
  ) {
    this.id = uuidv4();
  }

  get shortId(): string {
    return this.id.slice(0, 8);
  }

  get formattedDate(): string {
    return moment.utc(this.date).locale('ru').format('LL');
  }

  get formattedAmount(): string {
    const sign: string = this.type === 'income' ? '+' : '−';
    return `${sign}${formatCurrency(this.amount)}`;
  }

  toString(): string {
    return `[${this.shortId}] ${this.formattedDate} | ${TRANSACTION_TYPE_LABELS[this.type]} ${this.formattedAmount} | ${this.description}`;
  }
}
