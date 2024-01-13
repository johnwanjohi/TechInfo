import { SupplierscontactsComponent } from '../supplierscontacts.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-suppliercontact',
  templateUrl: './delete-suppliercontact.component.html',
  styleUrls: ['./delete-suppliercontact.component.scss']
})

export class DeleteSuppliercontactComponent implements OnInit {

  id: any;
  firstname: any;
  lastname: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SupplierscontactsComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    let params = {
      //action: 'getById',
      //module: 'supplierscontacts',
      id: this.id,
    };
    const endpoint= 'supplierscontacts/getById' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.firstname = answer.suppliercontact.firstname;
      this.lastname = answer.suppliercontact.lastname;
    });
  }

  Submit() {
    const params = {
      //action: 'delete',
      //module: 'supplierscontacts',
      id: this.id,
    };
    const endpoint= 'supplierscontacts/delete' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedSuppliersContact(this.id);
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
