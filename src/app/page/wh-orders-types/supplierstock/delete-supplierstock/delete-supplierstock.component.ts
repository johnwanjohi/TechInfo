import { SupplierStockComponent } from '../supplierstock.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-supplierstock',
  templateUrl: './delete-supplierstock.component.html',
  styleUrls: ['./delete-supplierstock.component.scss']
})

export class DeleteSupplierStockComponent implements OnInit {

  id: any;
  partnumber: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SupplierStockComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      action: 'getById',
      module: 'wh_supplierstock',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.partnumber = answer.wh_supplierstock.partnumber;
    });
  }

  Submit() {
    const params = {
      //action: 'delete',
     // module: 'wh_supplierstock',
      id: this.id,
    };
    const endpoint=  'wh_supplierstock/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedWhSupplierStock(this.id);
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
