import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, forkJoin, map, take } from 'rxjs';
import { format } from 'date-fns';
import { AccountHandlerService } from 'src/app/services/account-handler.service';
import { AccountBalance } from 'src/app/services/account.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { Transaction, TransactionConfirmation } from 'src/app/services/transaction.service';
import { reduce, filter } from 'src/app/array-functions';


@Component({
  selector: 'app-budgetplan',
  templateUrl: './budgetplan.component.html',
  styleUrls: ['./budgetplan.component.scss']
})
export class BudgetplanComponent implements OnInit{
  constructor(private accountHandler: AccountHandlerService, private lsService: LocalstorageService){}

  chartData!: any[]
  @Input() currentUser!: AccountBalance

  selectedYear: number = new Date().getFullYear();
  incomeData!: TransactionConfirmation[]
  expenseData!: TransactionConfirmation[]

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'CHF';
  legendTitle: string = 'Legend';

  jwt!: string

  colorScheme = {
    domain: ['blue', 'gray'],
  };

  onSelectionChanged(){
    this.updateData()
  }


  ngOnInit(): void {
    this.populateYears()
    this.jwt = this.lsService.load();
    this.accountHandler.updateTransactions(this.jwt)
    
    this.initialLoad();
  }

  initialLoad(): void{
    
    combineLatest([
      this.accountHandler.transactionQuery.pipe(
        map(tq => filter(tq.result, transaction => transaction.from !== this.currentUser.accountNr))
      ),
      this.accountHandler.transactionQuery.pipe(
        map(tq => filter(tq.result, transaction => transaction.from === this.currentUser.accountNr))
      )
    ]).subscribe(([incomeData, expenseData]) => {
      this.incomeData = incomeData;
      this.expenseData = expenseData;
      
      this.updateData();
    });
  }

  updateData(){
    const incomeData = filter(this.incomeData, transaction => new Date(transaction.date).getFullYear() == Number(this.selectedYear));
    const expenseData = filter(this.expenseData, transaction => new Date(transaction.date).getFullYear() == Number(this.selectedYear));

    this.processData(incomeData, expenseData)
  }


  processData(incoming: TransactionConfirmation[], outgoing: TransactionConfirmation[]){
    const months: string[] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    const monthStrings: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const groupedData = [];
    // Groups data by the month
    let index = 0
    for(const month of months){
      
      const incomingTotal = this.calculateTotal(incoming, month);
      const outgoingTotal = this.calculateTotal(outgoing, month);
      
      groupedData.push({
        name: monthStrings[index],
        series: [
          { name: "Income", value: incomingTotal },
          { name: "Expense", value: Math.abs(outgoingTotal)}
        ]
      })

      index++;
    }
    
    this.chartData = [...groupedData] || [];
  }

  /* checks for the month in all transactions and filters out the transactions for 
  // each specific month. It does that by reducing the filtered array to the total 
  // amount of every filtered transaction*/
  calculateTotal(transactions: TransactionConfirmation[], month: string){
    const fitlered = transactions.filter(
      (t) => t.date.split("-")[1] === month
    );

    return reduce(fitlered, (total, t) => total + t.amount, 0);
  }

  years: number[] = [];

  populateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      this.years.push(year);
    }
  }
}
