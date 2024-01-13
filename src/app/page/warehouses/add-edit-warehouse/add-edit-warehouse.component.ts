import { WarehousesComponent } from '../warehouses.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-edit-warehouse',
  templateUrl: './add-edit-warehouse.component.html',
  styleUrls: ['./add-edit-warehouse.component.scss']
})

export class AddEditWarehouseComponent implements OnInit {

  id: any;
  action: any;
  myForm: FormGroup;

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<WarehousesComponent>,
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
      this.getWarehouse();
    }
  }

  getWarehouse() {
    this.id = this.data.id;
    const params = {
      //action: 'getById',
      //module: 'warehouses',
      id: this.id,
    };
    const endpoint='warehouses/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        id: Number(answer.warehouse.id),
        name: answer.warehouse.name,
        street: answer.warehouse.street,
        city: answer.warehouse.city,
        state: answer.warehouse.state,
        postal: answer.warehouse.postal,
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  convertToJSON(warehouse: any) {
    return JSON.parse(warehouse);
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
     // module: 'warehouses',
      form: this.myForm.value,
    };
    const endpoint=this.action.toLowerCase() === 'add' ? 'warehouses/put' : 'warehouses/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewWarehouse(answer.warehouse) :
        this.AC.setUpdateWarehouse(answer.warehouse);
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
