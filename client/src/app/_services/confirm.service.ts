import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModelRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  confirm(title = 'Confirmação', 
    message = 'Você realmente deseja fazer isto?', 
    btnOkText = 'Ok', 
    btnCancelText = 'Cancelar') {
      const config = {
        initialState: {
          title,
          message,
          btnOkText,
          btnCancelText
        }
      }
    this.bsModelRef = this.modalService.show('confirm', config);
  }
}
