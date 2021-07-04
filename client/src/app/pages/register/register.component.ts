import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  captchaResponse: string;
  captchaSuccess: boolean = false;
  captchaIsExpired: boolean = false;
  siteKey: string = "6LeRhSIbAAAAALKN8pyF5Y6Fd-BbI5atWFioe7gH";
  registerFormGroup: FormGroup;

  constructor(
    private accountService: AccountService, 
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    // this.registerFormGroup = this.fb.group({
    //   recaptcha: ['', Validators.required],
    //   userName: ['', Validators.required],
    //   password: ['', Validators.required]
    // });
    this.initializeForm();
  }

  initializeForm() {
    this.registerFormGroup = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, 
        Validators.minLength(4), Validators.maxLength(8)]), 
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')]),
      recaptcha: new FormControl('', Validators.required)
    })
    this.registerFormGroup.controls.password.valueChanges.subscribe(() => {
      this.registerFormGroup.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control?.parent?.controls[matchTo].value 
        ? null : {isTrue: true}
    }
  }

  register() {
    console.log(this.registerFormGroup.value);
    // if (!this.captchaSuccess) {
    //   this.toastr.warning("reCAPTCHA Inválido"); 
    //   return
    // }
    // this.accountService.register(this.getForm()).subscribe(response => {
    //   this.cancel();
    // }, error => {
    //   this.toastr.error(error.error);
    // })
  }

  getForm(): any {
    return {
      userName: this.registerFormGroup.get('userName').value,
      password: this.registerFormGroup.get('password').value
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
    this.cancelRegister.emit(false);
  }

}
