import { SitesComponent } from '../sites.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-site',
  templateUrl: './delete-site.component.html',
  styleUrls: ['./delete-site.component.scss']
})

export class DeleteSiteComponent implements OnInit {

  id: any;
  name: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SitesComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    let params = {
     // action: 'getById',
      //module: 'sites',
      id: this.id,
    };
    const endpoint= 'sites/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.name = answer.site.name;
    });
  }

  Submit() {
    let params = {
      //action: 'delete',
      //module: 'sites',
      id: this.id,
    };
    const endpoint= 'sites/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedSite(this.id);
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
