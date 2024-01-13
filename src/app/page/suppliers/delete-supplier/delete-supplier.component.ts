import { SuppliersComponent } from '../suppliers.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-supplier',
  templateUrl: './delete-supplier.component.html',
  styleUrls: ['./delete-supplier.component.scss']
})

export class DeleteSupplierComponent implements OnInit {

  id: any;
  name: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SuppliersComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    let params = {
    //  action: 'getById',
     // module: 'suppliers',
      id: this.id,
    };
    const endpoint= 'suppliers/getById' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.name = answer.supplier.name;
    });
  }

  Submit() {
    let params = {
      //action: 'delete',
      //module: 'suppliers',
      id: this.id,
    };
    const endpoint= 'suppliers/delete' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedSupplier(this.id);
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
