import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountsService } from '../../../../shared/services/accounts.service';

@Component({
  selector: 'app-delete-transfer',
  templateUrl: './delete-transfer.component.html',
  styleUrls: ['./delete-transfer.component.scss']
})
export class DeleteTransferComponent implements OnInit {
  order_type: any;
  warehouse: any;
  order_status: string;
  id: any;
  warehouse_id: number;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<DeleteTransferComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = data.id;
  }
  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      action: 'getById',
      module: 'wh_transfer',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.order_type = answer.wh_transfer.order_type;
      this.warehouse = answer.wh_transfer.warehouse;
      this.order_status = answer.wh_transfer.order_status;
      this.warehouse_id = answer.wh_transfer.warehouse_id;
    });
  }
  submit() {
    const params = {
      //action: 'delete',
      //module: 'wh_transfer',
      id: this.id,
    };
    const endpoint= 'wh_transfer/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.Cancel();
    });
  }
  Cancel() {
    this.dialogRef.close();
  }
}
