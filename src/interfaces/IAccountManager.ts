import { IAccount } from './IAccount';
import { ISummary } from './ISummary';

// Параметр TAccount позволяет менеджеру работать с классом Account,
// не импортируя классы в слой интерфейсов
export interface IAccountManager<TAccount extends IAccount = IAccount> {
  addAccount(account: TAccount): void;
  removeAccountById(accountId: string): boolean;
  getAccounts(): TAccount[];
  getAccountById(id: string): TAccount | undefined;
  getSummary(accountId: string): ISummary;
}
