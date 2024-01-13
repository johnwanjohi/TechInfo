import { WhOrdersComponent } from '../wh-orders.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-wh-order',
  templateUrl: './delete-wh-order.component.html',
  styleUrls: ['./delete-wh-order.component.scss']
})

export class DeleteWhOrderComponent implements OnInit {

  id: any;
  order_type: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<WhOrdersComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
     // action: 'getById',
     // module: 'wh_orders',
      id: this.id,
    };
    const endpoint=  'wh_orders/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.order_type = answer.wh_order.order_type;
    });

  }

  Submit() {
    const params = {
      //action: 'delete',
      //module: 'wh_orders',
      id: this.id,
    };
    const endpoint=  'wh_orders/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedWhOrder(this.id);
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
