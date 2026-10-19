import { Account, AccountManager, Transaction } from './classes';

console.log("🚀 Budget Tracker CLI\n");

const personalAccount = new Account(1, 'Личный бюджет');
personalAccount.addTransaction(new Transaction(1, 1000, 'income', '2023-01-01T00:00:00Z', 'Зарплата'));
personalAccount.addTransaction(new Transaction(2, 200, 'expense', '2023-01-05T00:00:00Z', 'Продукты'));
personalAccount.addTransaction(new Transaction(3, 150, 'expense', '2023-01-10T00:00:00Z', 'Коммунальные услуги'));

const vacationAccount = new Account(2, 'Копилка на отпуск');
vacationAccount.addTransaction(new Transaction(1, 500, 'income', '2023-04-01T00:00:00Z', 'Премия'));
vacationAccount.addTransaction(new Transaction(2, 300, 'expense', '2023-04-05T00:00:00Z', 'Билеты на самолёт'));

const manager = new AccountManager();
manager.addAccount(personalAccount);
manager.addAccount(vacationAccount);

console.log(String(personalAccount));
console.log(`\nОбщий баланс всех бюджетов: ${manager.balance} ₽`);

console.log('\nТранзакции личного бюджета:');
personalAccount.getTransactions().forEach((t: Transaction) => console.log(t.toString()));

console.log('\nСводка по личному бюджету:', personalAccount.getSummary());
console.log('Сводка по всем счетам:', manager.getSummary());
console.log('Сводка по счёту #2:', manager.getSummary(2));
console.log('Краткая информация:', personalAccount.getSummaryString());

console.log('\nУдаление транзакции #3:', personalAccount.removeTransactionById(3));
console.log('Удаление несуществующей транзакции #99:', personalAccount.removeTransactionById(99));
console.log(personalAccount.getSummaryString());

console.log('\nСчёт #2 найден:', manager.getAccountById(2)?.name);
console.log('Счёт #5 найден:', manager.getAccountById(5)?.name ?? 'нет');

console.log(`\n${manager}`);
console.log('\nУдаление счёта #2:', manager.removeAccountById(2));
console.log(`Счетов осталось: ${manager.getAllAccounts().length}`);
