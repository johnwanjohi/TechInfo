import { SuppliersComponent } from "../suppliers.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-edit-supplier',
  templateUrl: './add-edit-supplier.component.html',
  styleUrls: ['./add-edit-supplier.component.scss']
})

export class AddEditSupplierComponent implements OnInit {
  id: any;
  action: any;
  myForm: FormGroup;

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SuppliersComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
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
      this.getSupplierByID();
    }
  }

  getSupplierByID() {
    this.id = this.data.id;
    const params = {
     // action: 'getById',
      //module: 'suppliers',
      id: this.id,
    };
    const endpoint= 'suppliers/getById' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        id: Number(answer.supplier.id),
        name: answer.supplier.name,
        street: answer.supplier.street,
        city: answer.supplier.city,
        state: answer.supplier.state,
        postal: answer.supplier.postal,
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  convertToJSON(product: any) {
    return JSON.parse(product);
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
      //action: this.action.toLowerCase() === 'add' ? 'suppliers/put' : 'suppliers/post';
     // module: 'suppliers',
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'suppliers/put' : 'suppliers/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewSupplier(answer.supplier) :
        this.AC.setUpdateSupplier(answer.supplier);
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

