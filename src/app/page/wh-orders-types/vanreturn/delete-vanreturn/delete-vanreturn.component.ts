import {Component, Inject, OnInit, Optional} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountsService} from '../../../../shared/services/accounts.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-vanreturn',
  templateUrl: './delete-vanreturn.component.html',
  styleUrls: ['./delete-vanreturn.component.scss']
})
export class DeleteVanReturnComponent implements OnInit {
  order_type: any;
  warehouse: any;
  order_status: string;
  id: any;
  warehouse_id: number;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<DeleteVanReturnComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = data.id;
  }
  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      action: 'getById',
      module: 'wh_vanreturn',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.order_type = answer.wh_vanreturn.order_type;
      this.warehouse = answer.wh_vanreturn.warehouse;
      this.order_status = answer.wh_vanreturn.order_status;
      this.warehouse_id = answer.wh_vanreturn.warehouse_id;
    });
  }
  submit() {
    const params = {
      //action: 'delete',
     // module: 'wh_vanreturn',
      id: this.id,
    };
    const endpoint= 'wh_vanreturn/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.Cancel();
    });
  }
  Cancel() {
    this.dialogRef.close();
  }
}
