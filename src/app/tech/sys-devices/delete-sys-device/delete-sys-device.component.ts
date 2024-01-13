import { SysDevicesComponent } from '../sys-devices.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-sys-device',
  templateUrl: './delete-sys-device.component.html',
  styleUrls: ['./delete-sys-device.component.scss']
})
export class DeleteSysDeviceComponent implements OnInit {
  id: any;
  name: any;
  constructor(public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SysDevicesComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      action: 'getSysDeviceByID',
      module: 'system_devices',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.name = answer.system_devices.name;
    });
  }

  Submit() {
    const params = {
     // action: 'delete',
      // module: 'system_devices',
      id: this.id,
    };
    const endpoint= 'system_devices/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedSystemDevice(this.id);
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
