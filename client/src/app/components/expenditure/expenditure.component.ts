import { Component, OnInit } from '@angular/core';
import { forEach } from 'src/app/array-functions';
import { getFormattedCategory } from 'src/app/category-formatter';
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
        this.processData();
      }
    })
  }

  processData(): void{
    this.pieChartData = [];

    const categoryCount: { [key: string]: number } = {};

    forEach(this.transactionData, transaction => {
      const category = transaction.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    
    forEach(Object.keys(categoryCount), category => {
      this.pieChartData.push({
        name: getFormattedCategory(category),
        value: categoryCount[category]
      });
    });

  }
}
