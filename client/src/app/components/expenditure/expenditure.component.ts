import { Component, OnInit } from '@angular/core';
import { AccountHandlerService } from 'src/app/services/account-handler.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { Transaction, TransactionConfirmation } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-expenditure',
  templateUrl: './expenditure.component.html',
  styleUrls: ['./expenditure.component.scss']
})
export class ExpenditureComponent implements OnInit{
  public constructor(private lsService: LocalstorageService, private accountHandler: AccountHandlerService){

  }

  transactionData: TransactionConfirmation[] = []; 

  jwt!: string

  showLabels: boolean = true;
  explodeSlices: boolean = false;
  doughnut: boolean = false;

  pieChartData: any[] = [];


  ngOnInit(): void {
    this.jwt = this.lsService.load();
    this.accountHandler.updateTransactions(this.jwt);

    this.accountHandler.transactionQuery.subscribe({
      next: tq => {
        this.transactionData = tq.result;
        this.processData(tq.result);
      }
    })
  }

  processData(data: TransactionConfirmation[]): void{
    this.pieChartData = [];

    const categoryCount: { [key: string]: number } = {};

    this.transactionData.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    
    Object.keys(categoryCount).forEach(category => {
      this.pieChartData.push({
        name: category,
        value: categoryCount[category]
      });
    });

  }
}
