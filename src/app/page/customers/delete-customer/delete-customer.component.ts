import { CustomersComponent } from '../customers.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-customer',
  templateUrl: './delete-customer.component.html',
  styleUrls: ['./delete-customer.component.scss']
})

export class DeleteCustomerComponent implements OnInit {

  id: any;
  name: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<CustomersComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    let params = {
      //action: 'getById',
      //module: 'customers',
      id: this.id,
    };
    const endpoint=  'customers/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.name = answer.customer.name;
    });
  }

  Submit() {
    let params = {
      //action: 'delete',
      //module: 'customers',
      id: this.id,
    };
    const endpoint=  'customers/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedCustomer(this.id);
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
