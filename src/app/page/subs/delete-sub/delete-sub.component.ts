import { SubsComponent } from '../subs.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-sub',
  templateUrl: './delete-sub.component.html',
  styleUrls: ['./delete-sub.component.scss']
})

export class DeleteSubComponent implements OnInit {

  id: any;
  name: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SubsComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    let params = {
      //action: 'getById',
     // module: 'subs',
      id: this.id,
    };
    const endpoint= 'subs/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.name = answer.sub.name;
    });
  }

  Submit() {
    let params = {
      //action: 'delete',
      //module: 'subs',
      id: this.id,
    };
    const endpoint= 'subs/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedSub(this.id);
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
