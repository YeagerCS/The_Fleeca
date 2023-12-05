import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/services/account.service';
import { AuthService, Credential } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(public authService: AuthService, public lsService: LocalstorageService,
    private router: Router){
    this.error = ""
  }


  error!: string
  username!: string
  firstname!: string
  lastname!: string
  password!: string
  confirmpass!: string
  credential!: Credential

  onSubmit(loginForm: NgForm){
    if(loginForm.valid){
      if(this.password === this.confirmpass){
        this.authService.register({login: this.username, password: this.password, firstname: this.firstname, lastname: this.lastname})
          .subscribe({
            next: acc => {
              this.authService.login({login: this.username, password: this.password})
                .subscribe({
                  next: cred => {
                    this.credential = cred;
                    this.lsService.save(cred.token);
                    this.error = "";
                    this.router.navigate(["/dashboard"])
                  },
                  error: e => {
                    console.log(e);
                    this.error = "Something went wrong (2)";
                  }
                })
              
            },
            error: e => {
              console.log(e);
              this.error = "Something went wrong."
            }
          })

      } else{
        this.error = "The passwords don't match"
      }
    } else{
      this.error = "The form is not valid"
    }
  }

  //Header
  headerText: string = "Login";
  navToLogin(){
    this.router.navigate(["/login"])
  }
}
