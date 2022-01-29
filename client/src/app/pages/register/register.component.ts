import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(
    private accountService: AccountService, 
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
  }

  initializeForm() {
    this.registerFormGroup = this.fb.group({
      gender: ['male'],
      userName: ['', [Validators.required, Validators.minLength(2)]],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      password: ['', [Validators.required, 
        Validators.minLength(4), Validators.maxLength(8)]], 
      recaptcha: ['', Validators.required]
    })
    this.registerFormGroup.controls.password.valueChanges.subscribe(() => {
      this.registerFormGroup.controls.confirmPassword.updateValueAndValidity();
    })
  }

  // matchValues(matchTo: string): ValidatorFn {
  //   return (control: AbstractControl) => {
  //     return control.value === control?.parent?.controls[matchTo].value 
  //       ? null : {isTrue: true}
  //   }
  // }

  register() {
    if (!this.captchaSuccess) { this.toastr.warning("reCAPTCHA Inválido"); return }
    if (this.registerFormGroup.invalid) { this.toastr.warning("Formulário Inválido"); return }
    this.accountService.register(this.registerFormGroup.value).subscribe(response => {
      this.router.navigateByUrl('/members');
    }, error => {
      this.validationErrors = error;
    })
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
