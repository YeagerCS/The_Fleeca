import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/services/account.service';
import { AuthService, Credential } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  registerForm!: FormGroup

  constructor(public authService: AuthService, public lsService: LocalstorageService,
    private router: Router, private navService: NavigationService, private formBuilder: FormBuilder){
    this.error = ""
  }

  error!: string
  credential!: Credential

  ngOnInit(): void {
      this.registerForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        firstname: ['', [Validators.required, Validators.minLength(3)]],
        lastname: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/)]],
        confirmPass: ['', Validators.required]
      }, {validators: this.passwordMatchValidator})
  }

  passwordMatchValidator(formGroup: FormGroup){
    const password = formGroup.get('password')?.value;
    const confirmPass = formGroup.get('confirmPass')?.value;

    return password === confirmPass ? null : { mismatch: true };
  }

  onSubmit(){
    if(this.registerForm.valid){
      this.authService.register({login: this.registerForm.get("username")?.value, password: this.registerForm.get("password")?.value, firstname: this.registerForm.get("firstname")?.value, lastname: this.registerForm.get("lastname")?.value})
      .subscribe({
        next: acc => {
          this.authService.login({login:this.registerForm.get("username")?.value, password: this.registerForm.get("password")?.value})
            .subscribe({
              next: cred => {
                this.credential = cred;
                this.lsService.save(cred.token);
                this.error = "";
                this.navService.getDashboard();
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
      this.error = "Form data is not valid.l"
    }
  }

  //Header
  headerText: string = "Login";
  navToLogin(){
    this.navService.getLogin();
  }
}
