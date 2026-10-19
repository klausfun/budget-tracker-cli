import { access } from 'node:fs/promises';
import { join } from 'node:path';
import inquirer from 'inquirer';
import moment from 'moment';
import { formatCurrency } from '../lib/budget-utils';
import { TRANSACTION_TYPE_LABELS, TransactionType } from '../interfaces/TransactionType';
import { TRANSACTION_LIMITS, TransactionConstructorParams } from '../interfaces/utility-types';
import { Account } from './Account';
import { AccountManager } from './AccountManager';
import { Transaction } from './Transaction';

enum MainMenuAction {
  OpenAccount = 'open',
  CreateAccount = 'create',
  Exit = 'exit',
}

enum AccountMenuAction {
  AddTransaction = 'add',
  RemoveTransaction = 'remove',
  ExportCsv = 'export',
  RemoveAccount = 'delete',
  Back = 'back',
}

type MainMenuChoice =
  | { action: MainMenuAction.OpenAccount; accountId: string }
  | { action: MainMenuAction.CreateAccount }
  | { action: MainMenuAction.Exit };

type ValidationResult = true | string;

const DATE_FORMAT: string = 'YYYY-MM-DD';
const MAX_NAME_LENGTH: number = 40;
const MAX_DESCRIPTION_LENGTH: number = 100;
const EXPORT_DIR: string = join(process.cwd(), 'exports');
const AMOUNT_PATTERN: RegExp = /^\d+([.,]\d{1,2})?$/;
const FILENAME_FORBIDDEN: RegExp = /[\\/:*?"<>|]/;

export class ApplicationController {
  public readonly accountManager: AccountManager = new AccountManager();
  private notice: string | null = null;

  async start(): Promise<void> {
    try {
      await this.runMainMenu();
    } catch (error: unknown) {
      // Ctrl+C внутри inquirer — штатный выход, остальные ошибки пробрасываем
      if (error instanceof Error && error.name === 'ExitPromptError') {
        console.log('\nРабота завершена.');
        return;
      }
      throw error;
    }
  }

  async createAccount(): Promise<void> {
    this.render('Новый счёт');
    const { name } = await inquirer.prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: 'Название счёта:',
        validate: (value: string): ValidationResult => this.validateAccountName(value),
      },
    ]);

    const account: Account = new Account(name.trim());
    this.accountManager.addAccount(account);
    this.notice = `✔ Счёт «${account.name}» создан (id ${account.shortId})`;
  }

  async watchAccount(account: Account): Promise<void> {
    while (true) {
      this.render(`Счёт «${account.name}»`);
      console.log(account.getSummaryString());
      console.log();
      console.log(account.toString());
      console.log();

      const { action } = await inquirer.prompt<{ action: AccountMenuAction }>([
        {
          type: 'select',
          name: 'action',
          message: 'Что сделать со счётом?',
          choices: [
            { name: 'Добавить транзакцию', value: AccountMenuAction.AddTransaction },
            { name: 'Удалить транзакцию', value: AccountMenuAction.RemoveTransaction },
            { name: 'Экспортировать в CSV', value: AccountMenuAction.ExportCsv },
            { name: 'Удалить счёт', value: AccountMenuAction.RemoveAccount },
            new inquirer.Separator(),
            { name: '← Назад к списку счетов', value: AccountMenuAction.Back },
          ],
        },
      ]);

      switch (action) {
        case AccountMenuAction.AddTransaction:
          await this.addTransaction(account);
          break;
        case AccountMenuAction.RemoveTransaction:
          await this.removeTransaction(account);
          break;
        case AccountMenuAction.ExportCsv:
          await this.exportTransactionsToCSV(account);
          break;
        case AccountMenuAction.RemoveAccount:
          if (await this.removeAccount(account)) {
            return;
          }
          break;
        case AccountMenuAction.Back:
          return;
      }
    }
  }

  async removeAccount(account: Account): Promise<boolean> {
    const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
      {
        type: 'confirm',
        name: 'confirmed',
        message: `Удалить счёт «${account.name}» и все его транзакции (${account.transactionCount} шт.)?`,
        default: false,
      },
    ]);

    if (!confirmed) {
      this.notice = 'Удаление счёта отменено';
      return false;
    }

    const name: string = account.name;
    this.accountManager.removeAccountById(account.id);
    this.notice = `✔ Счёт «${name}» удалён`;
    return true;
  }

  async removeTransaction(account: Account): Promise<void> {
    const transactions: Transaction[] = account.getTransactions();
    if (transactions.length === 0) {
      this.notice = 'В этом счёте нет транзакций — удалять нечего';
      return;
    }

    const { transactionId } = await inquirer.prompt<{ transactionId: string | null }>([
      {
        type: 'select',
        name: 'transactionId',
        message: 'Какую транзакцию удалить?',
        choices: [
          ...transactions.map((t: Transaction) => ({ name: t.toString(), value: t.id })),
          new inquirer.Separator(),
          { name: '← Отмена', value: null },
        ],
        pageSize: 12,
      },
    ]);

    if (transactionId === null) {
      return;
    }

    const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Точно удалить эту транзакцию?',
        default: false,
      },
    ]);

    if (!confirmed) {
      this.notice = 'Удаление транзакции отменено';
      return;
    }

    this.notice = account.removeTransactionById(transactionId)
      ? '✔ Транзакция удалена'
      : '✖ Транзакция не найдена';
  }

  async addTransaction(account: Account): Promise<void> {
    this.render(`Новая транзакция — «${account.name}»`);

    const answers = await inquirer.prompt<{
      type: TransactionType;
      amount: string;
      date: string;
      description: string;
    }>([
      {
        type: 'select',
        name: 'type',
        message: 'Тип транзакции:',
        choices: [
          { name: 'Доход', value: TransactionType.Income },
          { name: 'Расход', value: TransactionType.Expense },
        ],
      },
      {
        type: 'input',
        name: 'amount',
        message: 'Сумма, ₽ (например, 1500 или 99,90):',
        validate: (value: string, current?: { type?: TransactionType }): ValidationResult =>
          this.validateAmount(value, current?.type ?? TransactionType.Expense),
      },
      {
        type: 'input',
        name: 'date',
        message: `Дата (${DATE_FORMAT}):`,
        default: moment().format(DATE_FORMAT),
        validate: (value: string): ValidationResult => this.validateDate(value),
      },
      {
        type: 'input',
        name: 'description',
        message: 'Описание:',
        validate: (value: string): ValidationResult => this.validateDescription(value),
      },
    ]);

    const params: TransactionConstructorParams = [
      this.parseAmount(answers.amount),
      answers.type,
      `${answers.date.trim()}T00:00:00Z`,
      answers.description.trim(),
    ];
    const transaction: Transaction = new Transaction(...params);
    account.addTransaction(transaction);
    this.notice = `✔ Добавлено: ${TRANSACTION_TYPE_LABELS[transaction.type]} ${transaction.formattedAmount}`;
  }

  async exportTransactionsToCSV(account: Account): Promise<void> {
    const { filename } = await inquirer.prompt<{ filename: string }>([
      {
        type: 'input',
        name: 'filename',
        message: 'Имя файла без расширения:',
        default: this.suggestFilename(account),
        validate: (value: string): ValidationResult => this.validateFilename(value),
      },
    ]);

    const filePath: string = join(EXPORT_DIR, `${filename.trim()}.csv`);

    if (await this.fileExists(filePath)) {
      const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Файл ${filename.trim()}.csv уже есть. Перезаписать?`,
          default: false,
        },
      ]);
      if (!overwrite) {
        this.notice = 'Экспорт отменён';
        return;
      }
    }

    try {
      await account.exportTransactionsToCSV(filePath);
      this.notice = `✔ Экспортировано транзакций: ${account.transactionCount} → ${filePath}`;
    } catch (error: unknown) {
      const message: string = error instanceof Error ? error.message : String(error);
      this.notice = `✖ Ошибка экспорта: ${message}`;
    }
  }

  private async runMainMenu(): Promise<void> {
    while (true) {
      this.render('Управление личными финансами');
      console.log(this.accountManager.getSummaryString());
      console.log();

      const accounts: Account[] = this.accountManager.getAccounts();
      const nameWidth: number = Math.max(0, ...accounts.map((a: Account) => a.name.length));

      const { choice } = await inquirer.prompt<{ choice: MainMenuChoice }>([
        {
          type: 'select',
          name: 'choice',
          message: 'Выберите счёт или действие:',
          choices: [
            ...accounts.map((a: Account) => ({
              name: `${a.name.padEnd(nameWidth)}  ${formatCurrency(a.balance).padStart(14)}  (${a.transactionCount} тр.)`,
              value: { action: MainMenuAction.OpenAccount, accountId: a.id } as MainMenuChoice,
            })),
            new inquirer.Separator(),
            { name: '+ Создать новый счёт', value: { action: MainMenuAction.CreateAccount } },
            { name: '× Выход', value: { action: MainMenuAction.Exit } },
          ],
          pageSize: 15,
        },
      ]);

      switch (choice.action) {
        case MainMenuAction.OpenAccount: {
          const account: Account | undefined = this.accountManager.getAccountById(choice.accountId);
          if (account) {
            await this.watchAccount(account);
          } else {
            this.notice = '✖ Счёт не найден';
          }
          break;
        }
        case MainMenuAction.CreateAccount:
          await this.createAccount();
          break;
        case MainMenuAction.Exit:
          console.clear();
          console.log('До встречи!');
          return;
      }
    }
  }

  private render(title: string): void {
    console.clear();
    console.log(`=== ${title} ===\n`);
    if (this.notice) {
      console.log(`${this.notice}\n`);
      this.notice = null;
    }
  }

  private validateAccountName(value: string): ValidationResult {
    const name: string = value.trim();
    if (name.length === 0) {
      return 'Название не может быть пустым';
    }
    if (name.length > MAX_NAME_LENGTH) {
      return `Не длиннее ${MAX_NAME_LENGTH} символов`;
    }
    if (this.accountManager.hasAccountWithName(name)) {
      return 'Счёт с таким названием уже есть';
    }
    return true;
  }

  private validateAmount(value: string, type: TransactionType): ValidationResult {
    const normalized: string = value.trim().replace(/\s/g, '');
    if (!AMOUNT_PATTERN.test(normalized)) {
      return 'Введите положительное число, не больше двух знаков после запятой';
    }
    const amount: number = this.parseAmount(normalized);
    if (amount <= 0) {
      return 'Сумма должна быть больше нуля';
    }
    if (amount > TRANSACTION_LIMITS[type]) {
      return `Сумма не может превышать ${formatCurrency(TRANSACTION_LIMITS[type])}`;
    }
    return true;
  }

  private validateDate(value: string): ValidationResult {
    if (!moment(value.trim(), DATE_FORMAT, true).isValid()) {
      return `Введите существующую дату в формате ${DATE_FORMAT}, например ${moment().format(DATE_FORMAT)}`;
    }
    return true;
  }

  private validateDescription(value: string): ValidationResult {
    const description: string = value.trim();
    if (description.length === 0) {
      return 'Описание не может быть пустым';
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return `Не длиннее ${MAX_DESCRIPTION_LENGTH} символов`;
    }
    return true;
  }

  private validateFilename(value: string): ValidationResult {
    const filename: string = value.trim();
    if (filename.length === 0) {
      return 'Имя файла не может быть пустым';
    }
    if (FILENAME_FORBIDDEN.test(filename) || /^\.+$/.test(filename)) {
      return 'Имя содержит недопустимые символы: \\ / : * ? " < > |';
    }
    if (filename.toLowerCase().endsWith('.csv')) {
      return 'Укажите имя без расширения — .csv добавится автоматически';
    }
    return true;
  }

  private parseAmount(value: string): number {
    return Number(value.trim().replace(/\s/g, '').replace(',', '.'));
  }

  private suggestFilename(account: Account): string {
    const base: string = account.name.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '_');
    return `${base}_${moment().format(DATE_FORMAT)}`;
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }
}
