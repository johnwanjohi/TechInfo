import { SubscontactsComponent } from '../subscontacts.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-subcontact',
  templateUrl: './delete-subcontact.component.html',
  styleUrls: ['./delete-subcontact.component.scss']
})

export class DeleteSubcontactComponent implements OnInit {

  id: any;
  firstname: any;
  lastname: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SubscontactsComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      //action: 'getById',
      //module: 'subscontacts',
      id: this.id,
    };
    const endpoint='subscontacts/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.firstname = answer.subcontact.firstname;
      this.lastname = answer.subcontact.lastname;
    });
  }

  Submit() {
    const params = {
      //action: 'delete',
      //module: 'subscontacts',
      id: this.id,
    };
    const endpoint=  'subscontacts/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedSubsContact(this.id);
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
