import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { Router } from '@angular/router';
import { AccountHandlerService } from 'src/app/services/account-handler.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { NavigationService } from 'src/app/services/navigation.service';


const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class HeaderComponent implements OnInit{
  constructor(private router: Router, private lsService: LocalstorageService,
    private navService: NavigationService, private accountHandler: AccountHandlerService){}



  ngOnInit(): void {
  }

  @Input() headerText!: string;
  @Input() func!: () => void;
  @Input() dateFilter: boolean = false;
  @Input() yearFilter: boolean = false;
  jwt!: string


  date!: FormControl

  navEcockpit(){
    this.navService.getEcockpit();
  }

  navDashboard(){
    this.navService.getDashboard();
  }

  onDateSelected(event: any): void{
    this.jwt = this.lsService.load();

    if(!event.value){
      this.accountHandler.updateTransactions(this.jwt)
      return;
    }

    const startDate: Date = new Date(event.value)
    const endDate: Date = new Date(startDate);

    endDate.setMonth(startDate.getMonth() + 1)

    this.accountHandler.updateTransactionsByDate(this.jwt, startDate, endDate);
  }

  
}
