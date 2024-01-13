import { WarehousesComponent } from '../warehouses.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-warehouse',
  templateUrl: './delete-warehouse.component.html',
  styleUrls: ['./delete-warehouse.component.scss']
})

export class DeleteWarehouseComponent implements OnInit {

  id: any;
  name: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<WarehousesComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    let params = {
      //action: 'getById',
      //module: 'warehouses',
      id: this.id,
    };
    const endpoint='warehouses/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.name = answer.warehouse.name;
    });
  }

  Submit() {
    let params = {
      //action: 'delete',
      //module: 'warehouses',
      id: this.id,
    };
    const endpoint= 'warehouses/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedWarehouse(this.id);
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
