import { Component, OnInit } from '@angular/core';
import { AccountHandlerService } from 'src/app/services/account-handler.service';
import { AccountBalance, AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TransactionConfirmation, TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-e-cockpit',
  templateUrl: './e-cockpit.component.html',
  styleUrls: ['./e-cockpit.component.scss']
})
export class ECockpitComponent implements OnInit{
  public constructor(private navService: NavigationService, private lsService: LocalstorageService,
    private transactionService: TransactionService, private accountHandler: AccountHandlerService,
    private accountService: AccountService){

  }

  isBudgetPlan: boolean = false
  currentUser!: AccountBalance
  transactions!: TransactionConfirmation[]
  jwt!: string

  ngOnInit(): void {
    this.jwt = this.lsService.load()
    this.accountHandler.updateTransactions(this.jwt);
    

    this.accountHandler.transactionQuery.subscribe({
      next: tq => {
        this.transactions = tq.result;
      }
    })

    this.accountService.getCurrentBalance(this.jwt).subscribe({
      next: acc => {
        this.currentUser = acc;
      }
    })
  }

  headerText = "Dashboard";
  navDashboard(){
    this.navService.getDashboard();
  }

  onTabChanged(event: any){
    this.isBudgetPlan = event.index === 3;
  }
}
