import 'reflect-metadata';
import { Account } from './classes/Account';
import { ApplicationController } from './classes/ApplicationController';
import { Transaction } from './classes/Transaction';
import { TransactionType } from './interfaces/TransactionType';

function setInitialState(controller: ApplicationController): void {
  const personalAccount = new Account('Личный бюджет');
  personalAccount.addTransaction(new Transaction(1000, TransactionType.Income, '2023-01-01T00:00:00Z', 'Зарплата'));
  personalAccount.addTransaction(new Transaction(200, TransactionType.Expense, '2023-01-05T00:00:00Z', 'Продукты'));
  personalAccount.addTransaction(new Transaction(150, TransactionType.Expense, '2023-01-09T00:00:00Z', 'Коммунальные услуги'));
  controller.accountManager.addAccount(personalAccount);

  const vacationAccount = new Account('Копилка на отпуск');
  vacationAccount.addTransaction(new Transaction(500, TransactionType.Income, '2023-04-01T00:00:00Z', 'Премия'));
  vacationAccount.addTransaction(new Transaction(600, TransactionType.Income, '2023-01-01T00:00:00Z', 'Возврат долга'));
  vacationAccount.addTransaction(new Transaction(300, TransactionType.Expense, '2023-01-05T00:00:00Z', 'Билеты на самолёт'));
  vacationAccount.addTransaction(new Transaction(200, TransactionType.Expense, '2023-01-09T00:00:00Z', 'Номер в отеле'));
  controller.accountManager.addAccount(vacationAccount);
}

const controller = new ApplicationController();
setInitialState(controller);

controller.start().catch((error: unknown) => {
  console.error('Непредвиденная ошибка:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
