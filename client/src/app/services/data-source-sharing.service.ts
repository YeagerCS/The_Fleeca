import { Injectable } from '@angular/core';
import { Subject } from "rxjs"
import { TransactionConfirmation } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class DataSourceSharingService {

  constructor() { }
  private dataSourceSubject = new Subject<TransactionConfirmation[]>();
  public dataSource$ = this.dataSourceSubject.asObservable();

  updateDataSource(data: TransactionConfirmation[]): void{
    this.dataSourceSubject.next(data);
  }
}
