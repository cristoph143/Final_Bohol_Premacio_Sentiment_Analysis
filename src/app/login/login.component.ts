import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private toast: HotToastService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  loginForm: FormGroup = new FormGroup({
    emailLogin: new FormControl('', Validators.required),
    passLogin: new FormControl('', Validators.required)
  });
  registerForm: FormGroup = new FormGroup({
    $key: new FormControl(['']),
    emailRegister: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    passwordRegister: new FormControl('', [
      Validators.required,
    ]),
    confirmPassword: new FormControl('', Validators.required),
  });
  onSubmitLogin(){
    if (!this.loginForm.valid) {
      this.toast.error("Invalid Login");
      return;
    }
      this.authService.login(this.loginForm.value.emailLogin,this.loginForm.value.passLogin).pipe(
        this.toast.observe({
          success: 'Logged In Sucessfully',
          loading: 'Loading',
          error: 'There was a problem with your login.'
        })
      ).subscribe(()=>{
         this.router.navigate(['/user-dashboard']);

      });

  }
  onSubmitRegister(){
    if(!this.registerForm.valid || this.registerForm.value.passwordRegister != this.registerForm.value.confirmPassword){
      this.toast.error("Invalid Registration");
      return;
    }
    this.authService.register(this.registerForm.value.emailRegister,this.registerForm.value.passwordRegister).pipe(
      this.toast.observe({
        success: 'Registered Successfully!',
        loading: 'Processing',
        error: (message) => `${message}`
      })
    ).subscribe(()=>{
      this.router.navigate(['/user-dashboard']);
    });

  }
  

}
