import { SysLicensesComponent } from '../sys-licenses.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-sys-license',
  templateUrl: './delete-sys-license.component.html',
  styleUrls: ['./delete-sys-license.component.scss']
})
export class DeleteSysLicenseComponent implements OnInit {
  id: any;
  license: any;
  constructor(public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SysLicensesComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      action: 'getLicenseByID',
      module: 'licenses',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.license = answer.licenses.license;
    });
  }

  Submit() {
    const params = {
      // action: 'delete',
      // module: 'licenses',
      id: this.id,
    };
    const endpoint= 'licenses/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedLicense(this.id);
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
