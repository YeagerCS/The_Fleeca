import {Component, OnInit, Input, OnChanges, SimpleChanges} from "@angular/core"
import { NgForm } from "@angular/forms";
import { finalize } from "rxjs";
import { currency } from "src/app/currency-formatter";
import { AccountHandlerService } from "src/app/services/account-handler.service";
import { Account, AccountBalance, AccountService } from "src/app/services/account.service";
import { DataSourceSharingService } from "src/app/services/data-source-sharing.service";
import { LocalstorageService } from "src/app/services/localstorage.service";
import { TransactionService } from "src/app/services/transaction.service";

const DEFAULT_MSG = "Please specify the target account number";
@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.scss']
})
export class NewPaymentComponent implements OnInit{
  constructor(private transactionService: TransactionService, private lsService: LocalstorageService,
    private accountService: AccountService, private accountHandler: AccountHandlerService,
    private dataSourceService: DataSourceSharingService){

  }

  fromString!: string;
  targetInput!: string
  amountString!: string
  amountInput!: number
  currency: (value: number) => string = currency;
  userBalance!: AccountBalance
  jwt!: string
  currentBalance!: number;
  transactionCompleted!: boolean
  targetMessage: string = DEFAULT_MSG;
  error!: string

  ngOnInit(): void {
    this.jwt = this.lsService.load();
    this.accountHandler.updateBalance(this.jwt);

    this.accountHandler.userBalance.subscribe(accountBalance => {
      this.updateFromText(accountBalance);
      this.currentBalance = accountBalance.amount;
      this.userBalance = accountBalance;
    })

  }


  startOver(){
    this.targetInput = ""
    this.accountHandler.updateBalance(this.jwt);

    this.amountInput = Number()
    this.amountString = "";
    this.transactionCompleted = false
    this.accountHandler.userBalance.subscribe(accountBalance => {
      this.updateFromText(accountBalance);
      this.currentBalance = accountBalance.amount;
    })
  }

  private updateFromText(accountBalance: AccountBalance){
    this.fromString = accountBalance.accountNr + " [" + currency(accountBalance.amount) + "]";
  }

  onKeyUp(){
    if(this.targetInput){
      this.accountService.getAccountInfo(this.jwt, this.targetInput).subscribe({
        next: info => {
          this.targetMessage = info.owner.firstname + " " + info.owner.lastname;
          this.targetMessage += this.targetInput === this.userBalance.accountNr ? ` (You can't send yourself money.)` : "";
        },
        error: e => {
          this.targetMessage = "Unknown account number specified";
        }
      })
    } else{
      this.targetMessage = DEFAULT_MSG;
    }
  }

  transferAmount(form: NgForm){
    if(form.valid && this.targetInput !== this.userBalance.accountNr){
      this.amountInput = Number(this.amountString)

      this.transactionService.transfer(this.jwt, {target: this.targetInput, amount: this.amountInput}).subscribe({
        next: confirmation => { 
          this.transactionCompleted = true;
          this.currentBalance = confirmation.total;
          this.error = "";

          setTimeout(() => {
            this.accountHandler.updateTransactions(this.jwt);
          }, 900)
          this.accountHandler.transactionQuery.subscribe(tq => {
            this.dataSourceService.updateDataSource(tq.result);
            console.log(tq);
          });
        },
        error: e => {
          this.error = "Couldn't find the specified user."
        }
      })
    } else{
      this.error = "Please fill out the fields.";
    }
  }
}
