import { SysServersComponent } from '../sys-servers.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-sys-server',
  templateUrl: './delete-sys-server.component.html',
  styleUrls: ['./delete-sys-server.component.scss']
})

export class DeleteSysServerComponent implements OnInit {

  id: any;
  name: any;
  constructor(public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SysServersComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      //action: 'getSysServerByID',
      //module: 'system_servers',
      id: this.id,
    };
    const endpoint='system_servers/getSysServerByID';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.name = answer.system_servers.name;
    });
  }

  Submit() {
    const params = {
      //action: 'delete',
      //module: 'system_servers',
      id: this.id,
    };
    const endpoint='system_servers/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedSystemServer(this.id);
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
