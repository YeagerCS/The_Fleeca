import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AccountHandlerService } from 'src/app/services/account-handler.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { TransactionConfirmation, TransactionQuery, TransactionService } from 'src/app/services/transaction.service';
import { MatTableModule, MatTableDataSource, MatTable } from "@angular/material/table"
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator'
import { DataSourceSharingService } from 'src/app/services/data-source-sharing.service';
import { currency } from 'src/app/currency-formatter';
import { format } from 'src/app/date-formatter';
import { getFormattedCategory } from 'src/app/category-formatter';

@Component({
  selector: 'app-latest-transactions',
  templateUrl: './latest-transactions.component.html',
  styleUrls: ['./latest-transactions.component.scss']
})
export class LatestTransactionsComponent implements OnInit{
  constructor(private accountHandler: AccountHandlerService, private lsService: LocalstorageService,
    private dataSourceSerivce: DataSourceSharingService){
  }

  @Input() cockpit: boolean = false;
  transactionQuery!: TransactionQuery
  jwt!: string
  displayedColumns: string[] = ['Source', 'Target', 'Amount', 'Balance', 'Date', 'Category']
  dataSource!: MatTableDataSource<TransactionConfirmation>;
  currency: (value: number) => string = currency;
  format: (value: string) => string = format;
  getFormattedCategory: (value: string) => string = getFormattedCategory;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('tbSort') tbSort = new MatSort() 

  

 
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
  }

  applySort(event: Sort): void {
    const data = this.dataSource.data.slice(); //'slice' copies the array

    if (event.active && event.direction) {
      this.dataSource.data = this.sortData(data, event.active, event.direction);
    }
  }

  private sortData(data: TransactionConfirmation[], column: string, direction: string): TransactionConfirmation[] {
    return data.sort((a, b) => {
      const valueA = this.getSortingValue(a, column);
      const valueB = this.getSortingValue(b, column);

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * (direction === 'asc' ? 1 : -1);
      } else {
        return valueA.localeCompare(valueB) * (direction === 'asc' ? 1 : -1);
      }
    });
  }

  private getSortingValue(item: TransactionConfirmation, column: string): any {
    switch (column) {
      case 'Source':
        return item.from;
      case 'Target':
        return item.target;
      case 'Amount':
        return item.amount;
      case 'Balance':
        return item.total;
      case 'Date':
        return item.date;
      case 'Category':
        return item.category;
      default:
        return (item as any)[column];
    }
  }

}
