import { Account } from './classes/Account';
import { AccountManager } from './classes/AccountManager';
import { Transaction } from './classes/Transaction';
import { formatCurrency } from './lib/budget-utils';
import {
  AccountInfo,
  limits,
  NullableDescription,
  TransactionConstructorParams,
  TransactionInstance,
  TransactionPreview,
} from './interfaces/utility-types';

console.log("🚀 Budget Tracker CLI\n");

const personalAccount = new Account('Личный бюджет');
const transaction: Transaction = new Transaction(1000, 'income', '2023-01-01T00:00:00Z', 'Зарплата');

transaction.update({ amount: 1200 });
console.log('Обновлённая транзакция:');
console.log(transaction.toString());

personalAccount.addTransaction(transaction);
personalAccount.addTransaction(new Transaction(200, 'expense', '2023-01-05T00:00:00Z', 'Продукты'));
personalAccount.addTransaction(new Transaction(150, 'expense', '2023-01-09T00:00:00Z', 'Коммунальные услуги'));

personalAccount.update({ name: 'Основной счёт' });
console.log('\nОбновлённый счёт:');
console.log(personalAccount.getSummaryString());

const manager = new AccountManager();
manager.addAccount(personalAccount);

console.log(`\n${personalAccount}`);
console.log(`\nОбщий баланс всех бюджетов: ${formatCurrency(manager.balance)}`);

console.log('\nЛимит пополнений:', limits.income);
console.log('Лимит трат:', limits.expense);

const transactionParams: TransactionConstructorParams = [500, 'expense', '2023-02-01T00:00:00Z', 'Покупка'];
const newTransaction: TransactionInstance = new Transaction(...transactionParams);
console.log('\nТранзакция из кортежа параметров конструктора:');
console.log(newTransaction.toString());

const preview: TransactionPreview = {
  id: newTransaction.id,
  amount: newTransaction.amount,
  type: newTransaction.type,
  date: newTransaction.date,
};
const accountInfo: AccountInfo = { id: personalAccount.id, name: personalAccount.name };
const withoutDescription: NullableDescription = { ...preview, description: null };

console.log('\nTransactionPreview:', preview);
console.log('AccountInfo:', accountInfo);
console.log('NullableDescription:', withoutDescription);
