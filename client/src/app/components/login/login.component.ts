import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Credential, LoginInfo } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(public authService: AuthService, public lsService: LocalstorageService,
    private router: Router, private navService: NavigationService){
    this.error = ""
  }


  username!: string
  password!: string
  credential?: Credential
  error!: string

  onSubmit(form: NgForm){
    if(form.valid){
      this.authService.login({login: this.username, password: this.password})
      .subscribe({
        next: cred => {
          this.credential = cred; 
          this.lsService.save(cred.token);
          this.error = "";
          this.navService.getDashboard();
        },
        error: e => {
          console.log('An error occurred:', e);
          this.error = "Invalid login credentials"
        }
      });

    } else{
      this.error = "Entry not valid";
    }
  }

  // Header
  headerText: string = "Register"
  navToRegister(){
    this.navService.getRegister();
  }
}
