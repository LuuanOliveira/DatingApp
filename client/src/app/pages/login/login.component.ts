import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  model: any = {}
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
      recaptcha: ['', Validators.required]
    });
  }

  login() {
    console.log(this.loginFormGroup.get('recaptcha').value)
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/members');
    }, error => {
      this.toastr.error(error.error);
    })
  }

  cancel() {
    this.cancelLogin.emit(false);
  }

}
