import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() cancelLogin = new EventEmitter();
  captchaResponse: string;
  captchaSuccess: boolean = false;
  captchaIsExpired: boolean = false;
  siteKey: string = "6LeRhSIbAAAAALKN8pyF5Y6Fd-BbI5atWFioe7gH";
  loginFormGroup: FormGroup;
  
  constructor(
    public accountService: AccountService, 
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService) 
  { }

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      recaptcha: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (!this.captchaSuccess) {
      this.toastr.warning("reCAPTCHA Inválido"); 
      return
    }
    this.accountService.login(this.getForm()).subscribe(response => {
      this.router.navigateByUrl('/members');
    }, error => {
      this.toastr.error(error.error);
    })
  }

  getForm(): any {
    return {
      userName: this.loginFormGroup.get('userName').value,
      password: this.loginFormGroup.get('password').value
    }
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
  }

  handleError(): void {
    this.captchaSuccess = false;
  }

  cancel() {
    this.cancelLogin.emit(false);
  }

}
