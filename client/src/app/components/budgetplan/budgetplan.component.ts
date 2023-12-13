import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, filter, forkJoin, map, take } from 'rxjs';
import { format } from 'date-fns';
import { AccountHandlerService } from 'src/app/services/account-handler.service';
import { AccountBalance } from 'src/app/services/account.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { Transaction, TransactionConfirmation } from 'src/app/services/transaction.service';

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
    this.loadData();
  }


  ngOnInit(): void {
    this.populateYears()
    this.jwt = this.lsService.load();
    this.accountHandler.updateTransactions(this.jwt)
    
    this.loadData();
  }

  loadData(): void{
    console.log(this.selectedYear + " it's here!!");
    
   const selectedYear = this.selectedYear;

    const incomingQuery$ = this.accountHandler.transactionQuery.pipe(
      map(tq => tq.result.filter(
        transaction => transaction.from !== this.currentUser.accountNr &&
        new Date(transaction?.date)?.getFullYear() === selectedYear
      ))
    );

    const outgoingQuery$ = this.accountHandler.transactionQuery.pipe(
      map(tq => tq.result.filter(
        transaction => transaction.from === this.currentUser.accountNr &&
        new Date(transaction?.date)?.getFullYear() === selectedYear
      ))
    );

    combineLatest([incomingQuery$, outgoingQuery$]).subscribe(([incomingData, outgoingData]) => {
      console.log("Inside of subscription");
      this.processData(incomingData, outgoingData);
    });
  }


  processData(incoming: TransactionConfirmation[], outgoing: TransactionConfirmation[]){
    const months: string[] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    const groupedData = [];


    for(const month of months){
      
      const incomingTotal = this.calculateTotal(incoming, month);
      const outgoingTotal = this.calculateTotal(outgoing, month);
      
      groupedData.push({
        name: month,
        series: [
          { name: "income", value: incomingTotal },
          { name: "Expense", value: outgoingTotal * -1}
        ]
      })
    }
    
    this.chartData = [...groupedData];
  }

  calculateTotal(transactions: TransactionConfirmation[], month: string){
    const fitlered = transactions.filter(
      (t) => t.date.split("-")[1] === month
    );

    return fitlered.reduce((total, t) => total + t.amount, 0);
  }

  years: number[] = [];

  populateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      this.years.push(year);
    }
  }
}
