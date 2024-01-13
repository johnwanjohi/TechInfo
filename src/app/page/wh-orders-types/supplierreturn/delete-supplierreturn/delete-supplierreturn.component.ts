import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountsService } from '../../../../shared/services/accounts.service';

@Component({
  selector: 'app-delete-supplierreturn',
  templateUrl: './delete-supplierreturn.component.html'

})
export class DeleteSupplierReturnComponent implements OnInit {
  order_type: any;
  warehouse: any;
  order_status: string;
  id: any;
  warehouse_id: number;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<DeleteSupplierReturnComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = data.id;
  }
  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      action: 'getById',
      module: 'wh_supplierreturn',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.order_type = answer.wh_supplierreturn.order_type;
      this.warehouse = answer.wh_supplierreturn.warehouse;
      this.order_status = answer.wh_supplierreturn.order_status;
      this.warehouse_id = answer.wh_supplierreturn.warehouse_id;
    });
  }
  submit() {
    const params = {
     // action: 'delete',
     // module: 'wh_supplierreturn',
      id: this.id,
    };
    const endpoint=  'wh_supplierstock/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.Cancel();
    });
  }
  Cancel() {
    this.dialogRef.close();
  }
}
