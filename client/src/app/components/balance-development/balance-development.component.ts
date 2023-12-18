import { Component, Input } from '@angular/core';
import { combineLatest, forkJoin, from, map, tap } from 'rxjs';
import { format } from 'src/app/date-formatter';
import { AccountHandlerService } from 'src/app/services/account-handler.service';
import { AccountBalance } from 'src/app/services/account.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { TransactionConfirmation } from 'src/app/services/transaction.service';
import { MatInput } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import { filter } from 'src/app/array-functions';

@Component({
  selector: 'app-balance-development',
  templateUrl: './balance-development.component.html',
  styleUrls: ['./balance-development.component.scss']
})
export class BalanceDevelopmentComponent {
  public constructor(private accountHandler: AccountHandlerService, private lsService: LocalstorageService){
    
  }
  date!: FormControl

  @Input() currentUser!: AccountBalance
  jwt!: string

  colorScheme = {
    domain: ['#5AA454', '#E44D25'],
  } as any;
  
  chartData!: any[];

  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Date';
  yAxisLabel = 'Balance';

  gradient = false;

  ngOnInit() {
    this.jwt = this.lsService.load();
    this.accountHandler.updateTransactions(this.jwt);

    combineLatest([
      this.accountHandler.transactionQuery.pipe(
        map(tq => filter(tq.result, transaction => transaction.from !== this.currentUser.accountNr)),
      ),
      this.accountHandler.transactionQuery.pipe(
        map(tq => filter(tq.result, transaction => transaction.from === this.currentUser.accountNr)),
      )
    ]).subscribe(([incomingData, outgoingData]) => {
    
      this.chartData = [
        {
          name: 'Incoming',
          series: incomingData.map(transaction => ({
            name: format(transaction.date),
            value: transaction.amount,
          })),
        },
        {
          name: 'Outgoing',
          series: outgoingData.map(transaction => ({
            name: format(transaction.date),
            value: Math.abs(transaction.amount),
          })),
        },
      ];
    });
  }
}
