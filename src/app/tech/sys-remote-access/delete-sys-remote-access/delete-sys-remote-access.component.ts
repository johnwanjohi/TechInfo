import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { SysRemoteAccessComponent } from '../sys-remote-access.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-sys-remote-access',
  templateUrl: './delete-sys-remote-access.component.html',
  styleUrls: ['./delete-sys-remote-access.component.scss']
})
export class DeleteSysRemoteAccessComponent implements OnInit {
  id: any;
  r_access: any;
  constructor(public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SysRemoteAccessComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      action: 'getRemoteAccessByID',
      module: 'remote_access',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.r_access = answer.remote_access.remote_id;
    });
  }

  Submit() {
    const params = {
     // action: 'delete',
     // module: 'remote_access',
      id: this.id,
    };
    const endpoint= 'remote_access/delete' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedRemoteAccess(this.id);
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
