import { Injectable } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  @BlockUI() blockUI: NgBlockUI;
  busyRequestCount = 0;

  constructor(
    private spinnerService: NgxSpinnerService
  ) { }

  busy() {
    this.busyRequestCount++;
    this.blockUI.start('Carregando...')
    // this.spinnerService.show(undefined, {
    //   type: 'square-loader',
    //   bdColor: 'rgba(255,255,255,0)',
    //   color: '#333333'
    // });
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.blockUI.reset();
      // this.spinnerService.hide();
    }
  }
}
