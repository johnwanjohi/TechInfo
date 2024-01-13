import {Component, Inject, OnInit, Optional} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountsService} from '../../../../shared/services/accounts.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-vanstock',
  templateUrl: './delete-vanstock.component.html',
  styleUrls: ['./delete-vanstock.component.scss']
})
export class DeleteVanStockComponent implements OnInit {
  order_type: any;
  warehouse: any;
  order_status: string;
  id: any;
  warehouse_id: number;
  wh_order_id: number;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<DeleteVanStockComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = data.id;
  }
  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      action: 'getById',
      module: 'wh_vanstock',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.order_type = answer.wh_vanstock.order_type;
      this.warehouse = answer.wh_vanstock.warehouse;
      this.order_status = answer.wh_vanstock.order_status;
      this.warehouse_id = answer.wh_vanstock.warehouse_id;
      this.wh_order_id = answer.wh_vanstock.wh_order_id;
    });
  }
  submit() {
    const params = {
      action: 'delete',
      module: 'wh_vanstock',
      id: this.id,
    };
    console.dir(params);
    const endpoint=  'wh_vanstock/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      const params2 = {
        id:this.wh_order_id
      };
      const endpoint1=  'wh_orders/getById';
      this.AC.post(params2,endpoint1).subscribe(
        (updatedorder:any) => {
          console.dir(updatedorder)
          this.AC.updated_whorder.next(updatedorder.wh_order);
        }
      )
      this.Cancel();
    });
  }
  Cancel() {
    this.dialogRef.close();
  }
}
