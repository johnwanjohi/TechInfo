import { Component, OnInit, Optional, Inject, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { AccountsService } from '../../services/accounts.service';
import { AccountsService } from '../../../shared/services/accounts.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-whorder-delete',
  templateUrl: './wh-order-delete.component.html',
  styleUrls: ['./wh-order-delete.component.less'],
})
export class WHOrderDeleteComponent implements OnInit {
  onDelete = new EventEmitter();
  order_type: any;
  warehouse: any;
  order_status: string;
  id: any;
  warehouse_id: number;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<WHOrderDeleteComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = data.id;
  }

  ngOnInit(): void {
    // this.activateRoute.params.subscribe((keys) => {

    // });
    this.id = this.data.id;
    const params = {
     // action: 'getById',
      //module: 'wh_orders',
      id: this.id,
    };
    const endpoint=  'wh_orders/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      // if (answer.wh_order == false) this.router.navigate(['/warehouses']);
      this.order_type = answer.wh_order.order_type;
      this.warehouse = answer.wh_order.warehouse;
      this.order_status = answer.wh_order.order_status;
      this.warehouse_id = answer.wh_order.warehouse_id;
    });
  }
  submit() {
    const params = {
     //action: 'delete',
     // module: 'wh_orders',
      id: this.id,
    };

    const endpoint=  'wh_orders/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedWhOrder(this.id);
      this.AC.setBranch(Number(this.warehouse_id));
      this.onDelete.emit();
      // this.router.navigate(['/warehouses']);
      this.Cancel();
    });
  }
  Cancel() {
    this.dialogRef.close();
    // this.router.navigate(['/warehouses']);
  }
}
