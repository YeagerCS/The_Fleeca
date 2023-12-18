import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'src/app/array-functions';
import { AccountHandlerService } from 'src/app/services/account-handler.service';
import { Account, AccountBalance, AccountService } from 'src/app/services/account.service';
import { AuthService, Credential } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  constructor(private router: Router, public lsService: LocalstorageService, public accountService: AccountService,
    private authService: AuthService, private accountHandler: AccountHandlerService, private navService: NavigationService){

  }

  token!: string
  theUser!: AccountBalance

  ngOnInit(): void {
    this.token = this.lsService.load();

    if(this.token){
      this.accountHandler.updateBalance(this.token);
      this.accountHandler.userBalance.subscribe(accountBalance => {
        this.theUser = accountBalance;
      })
    }

    const testarray = [1, 4, 2, 5, 7, 2, 9]
    
  }

  getHeaderText(){
    try{
      return "Logout " + this.theUser.owner.firstname + " " + this.theUser.owner.lastname
    } catch(e){
      return "Logout";
    }
  }
  logOut(){ 
    this.lsService.delete();
    this.navService.getLogin();
  }
}
