import { Account } from './classes/Account';
import { AccountManager } from './classes/AccountManager';
import { Transaction } from './classes/Transaction';
import { formatCurrency } from './lib/budget-utils';

console.log("🚀 Budget Tracker CLI\n");

const personalAccount = new Account('Личный бюджет');
personalAccount.addTransaction(new Transaction(1000, 'income', '2023-01-01T00:00:00Z', 'Зарплата'));
personalAccount.addTransaction(new Transaction(200, 'expense', '2023-01-05T00:00:00Z', 'Продукты, хлеб'));
personalAccount.addTransaction(new Transaction(150, 'expense', '2023-01-09T00:00:00Z', 'Оплата "ЖКХ"'));

const manager = new AccountManager();
manager.addAccount(personalAccount);

console.log(String(personalAccount));
console.log(`\nОбщий баланс всех бюджетов: ${formatCurrency(manager.balance)}`);

try {
  await personalAccount.exportTransactionsToCSV('exports/main_account.csv');
  console.log('\nТранзакции сохранены в exports/main_account.csv');
} catch (error: unknown) {
  console.log('В процессе записи произошла ошибка', (error as Error).message);
}

// Запись в несуществующий диск — проверка обработки ошибки
try {
  await personalAccount.exportTransactionsToCSV('Z:/no/such/dir/main_account.csv');
} catch (error: unknown) {
  console.log('В процессе записи произошла ошибка:', (error as Error).message);
}
