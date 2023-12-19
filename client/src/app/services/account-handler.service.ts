import { Injectable } from '@angular/core';
import { Account, AccountBalance, AccountService } from './account.service';
import { Observable, Subject } from 'rxjs';
import { TransactionQuery, TransactionService } from './transaction.service';


export type ReadonlyAccountBalance = Readonly<AccountBalance>
export type ReadonlyTransactionQuery = Readonly<TransactionQuery>

@Injectable({
  providedIn: 'root'
})
export class AccountHandlerService {

  constructor(public accountService: AccountService, public transactionService: TransactionService) { }

  private accountBalance!: ReadonlyAccountBalance
  private accountBalanceSubject = new Subject<ReadonlyAccountBalance>();
  private transactions!: ReadonlyTransactionQuery
  private transactionsSubject = new Subject<ReadonlyTransactionQuery>();

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
    this.transactionService.getTransactions(token).subscribe({
      next: tQuery => {
        this.transactions = tQuery;
        this.transactionsSubject.next(tQuery);
      },
      error: e => {
        console.log(e);
      }
    })
  }

  updateTransactionsByDate(token: string, startDate: Date, endDate: Date): void{
    this.transactionService.getTransactions(token, {fromDate: startDate, toDate: endDate}).subscribe({
      next: tq => {
        this.transactions = tq;
        this.transactionsSubject.next(tq)
      },
      error: e => {
        console.log(e);
      }
    })
  }
  
}
