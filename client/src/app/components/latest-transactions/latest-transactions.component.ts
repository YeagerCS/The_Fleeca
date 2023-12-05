import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AccountHandlerService } from 'src/app/services/account-handler.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { TransactionConfirmation, TransactionQuery, TransactionService } from 'src/app/services/transaction.service';
import { MatTableModule, MatTableDataSource, MatTable } from "@angular/material/table"
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator'
import { DataSourceSharingService } from 'src/app/services/data-source-sharing.service';
import { currency } from 'src/app/currency-formatter';

@Component({
  selector: 'app-latest-transactions',
  templateUrl: './latest-transactions.component.html',
  styleUrls: ['./latest-transactions.component.scss']
})
export class LatestTransactionsComponent implements OnInit, AfterViewInit{
  constructor(private accountHandler: AccountHandlerService, private lsService: LocalstorageService,
    private dataSourceSerivce: DataSourceSharingService){
  }

  transactionQuery!: TransactionQuery
  jwt!: string
  displayedColumns: string[] = ['Source', 'Target', 'Amount', 'Balance']
  dataSource!: MatTableDataSource<TransactionConfirmation>;
  currency: (value: number) => string = currency;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort

  

 
  ngOnInit(): void {
    this.jwt = this.lsService.load();

    if(this.jwt){
      this.accountHandler.updateTransactions(this.jwt);
      console.log(this.jwt);
      
    }

    this.accountHandler.transactionQuery.subscribe(tQuery => {
      this.transactionQuery = tQuery;
      this.dataSource = new MatTableDataSource<TransactionConfirmation>(tQuery.result);
      this.dataSource.paginator = this.paginator;


    })  
    // TODO: Sorting doesn't work.
    this.sort.sortChange.subscribe((sortEvent: Sort) => {
      if (sortEvent.active === 'Balance') {
        this.dataSource.data = this.dataSource.data.sort((a, b) => {
          if (sortEvent.direction === 'asc') {
            return a.total - b.total;
          } else {
            return b.total - a.total;
          }
        });
      }
    });

  }

  ngAfterViewInit(): void {

  }

}
