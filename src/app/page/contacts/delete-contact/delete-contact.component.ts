import { ContactsComponent } from '../contacts.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-contact',
  templateUrl: './delete-contact.component.html',
  styleUrls: ['./delete-contact.component.scss']
})

export class DeleteContactComponent implements OnInit {

  id: any;
  lastname: any;
  firstname: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<ContactsComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      //action: 'getById',
      //module: 'contacts',
      id: this.id,
    };
    const endpoint=  'contacts/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.firstname = answer.contact.firstname;
      this.lastname = answer.contact.lastname;
    });
  }

  Submit() {
    const params = {
      //action: 'delete',
      //module: 'contacts',
      id: this.id,
    };
    const endpoint=  'contacts/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedContact(this.id);
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
