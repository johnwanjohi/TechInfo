import { CustomersComponent } from '../customers.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrls: ['./add-edit-customer.component.scss']
})

export class AddEditCustomerComponent implements OnInit {

  id: any;
  action: any;
  myForm: FormGroup;

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<CustomersComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.action = data.action;
    this.myForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      postal: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.action.toLowerCase() === 'edit') {
      this.getCustomerByID();
    }
  }

   getCustomerByID() {
    this.id = this.data.id;
    const params = {
      //action: 'getById',
      //module: 'customers',
      id: this.id,
    };
    const endpoint=  'customers/getById';
     this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        id: Number(answer.customer.id),
        name: answer.customer.name,
        street: answer.customer.street,
        city: answer.customer.city,
        state: answer.customer.state,
        postal: answer.customer.postal,
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  convertToJSON(customer: any) {
    return JSON.parse(customer);
  }

  Submit() {
    if (this.action.toLowerCase() === 'add') {
      this.myForm.removeControl('id');
    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.patchValue({
        id: this.data.id
      });
    }
    const params = {
      //action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'customers',
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'customers/put' : 'customers/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewCustomer(answer.customer) :
        this.AC.setUpdateCustomer(answer.customer);
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
