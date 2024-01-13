import { distinctUntilChanged } from 'rxjs/operators';
import { SupplierscontactsComponent } from '../supplierscontacts.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Optional } from '@angular/core';

@Component({
  selector: 'app-add-edit-suppliercontact',
  templateUrl: './add-edit-suppliercontact.component.html',
  styleUrls: ['./add-edit-suppliercontact.component.scss']
})

export class AddEditSuppliercontactComponent implements OnInit {

  id: any;
  suppliercontact: any;
  action: string;
  myForm: FormGroup;
  current_supplier_id: number;

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SupplierscontactsComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
    this.action = this.data.action;
    this.myForm = new FormGroup({
      id: new FormControl(0),
      supplier_id: new FormControl(0, [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      workphone: new FormControl(''),
      cellphone: new FormControl(''),
      email: new FormControl('', [Validators.email]),
    });
  }

  ngOnInit(): void {

    this.AC.supplierObserver().pipe(
      distinctUntilChanged()
    ).subscribe((supplier_id) => {
      this.current_supplier_id = supplier_id;
      this.myForm.patchValue({
        supplier_id: Number(this.current_supplier_id)
      });
    });
    if (this.action === 'edit') {
      this.getContactByID();
    }
  }

  getContactByID() {
    this.id = this.data.id;
    const params = {
      //action: 'getById',
     // module: 'supplierscontacts',
      id: this.id,
    };
    const endpoint= 'supplierscontacts/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        id: Number(answer.suppliercontact.id),
        supplier_id: Number(answer.suppliercontact.supplier_id),
        firstname: answer.suppliercontact.firstname,
        lastname: answer.suppliercontact.lastname,
        title: answer.suppliercontact.title,
        workphone: answer.suppliercontact.workphone,
        cellphone: answer.suppliercontact.cellphone,
        email: answer.suppliercontact.email,
      });
      this.current_supplier_id = Number(answer.suppliercontact.supplier_id);
    });
  }

  convertToJSON(contact: any) {
    return JSON.parse(contact);
  }

  Submit() {
    if (this.action.toLowerCase() === 'add') {
      this.myForm.removeControl('id');
    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.removeControl('supplier_id');
      this.myForm.patchValue({
        id: this.data.id
      });
    }
    const params = {
     // action: this.action.toLowerCase() === 'add' ? 'supplierscontacts/put' : 'supplierscontacts/post';
      //module: 'supplierscontacts',
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'supplierscontacts/put' : 'supplierscontacts/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewSuppliersContact(answer.suppliercontact) :
        this.AC.setUpdatedSuppliersContact(answer.suppliercontact);
      this.closeDialog();
    });
  }

  Cancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
