import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountsService } from '../../../../shared/services/accounts.service';

@Component({
  selector: 'app-adjustment-delete',
  templateUrl: './wh-adjustment-delete.component.html'

})
export class WHAdjustmentDeleteComponent implements OnInit {
  order_type: any;
  warehouse: any;
  order_status: string;
  id: any;
  warehouse_id: number;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<WHAdjustmentDeleteComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = data.id;
  }
  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      action: 'getById',
      module: 'wh_adjustment_details',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.order_type = answer.wh_adjustment_details.order_type;
      this.warehouse = answer.wh_adjustment_details.warehouse;
      this.order_status = answer.wh_adjustment_details.order_status;
      this.warehouse_id = answer.wh_adjustment_details.warehouse_id;
    });
  }
  submit() {
    const params = {
      //action: 'delete',
      //module: 'wh_adjustment_details',
      id: this.id,
    };
    //console.dir(params);
    const endpoint= 'wh_adjustment_details/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.Cancel();
    });
  }
  Cancel() {
    this.dialogRef.close();
  }
}
