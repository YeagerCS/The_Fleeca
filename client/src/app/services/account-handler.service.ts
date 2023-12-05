import { Injectable } from '@angular/core';
import { Account, AccountBalance, AccountService } from './account.service';
import { Observable, Subject } from 'rxjs';
import { TransactionQuery, TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class AccountHandlerService {

  constructor(public accountService: AccountService, public transactionService: TransactionService) { }

  private accountBalance!: AccountBalance
  private accountBalanceSubject = new Subject<AccountBalance>();
  private transactions!: TransactionQuery
  private transactionsSubject = new Subject<TransactionQuery>();

  get userBalance(): Observable<AccountBalance> {
    return this.accountBalanceSubject.asObservable();
  }

  get transactionQuery(): Observable<TransactionQuery> {
    return this.transactionsSubject.asObservable();
  }

  updateBalance(token: string): void{
    this.accountService.getCurrentBalance(token).subscribe({
      next: accountBalance => {
        this.accountBalance = accountBalance;
        this.accountBalanceSubject.next(accountBalance);
      },
      error: e => {
        console.log(e);
      }
    })
  }

  updateTransactions(token: string): void{
    this.transactionService.getTransactions(token, new Date("01/01/1669"), new Date(), 1000, undefined).subscribe({
      next: tQuery => {
        this.transactions = tQuery;
        this.transactionsSubject.next(tQuery);
      },
      error: e => {
        console.log(e);
      }
    })
  }
  
}
