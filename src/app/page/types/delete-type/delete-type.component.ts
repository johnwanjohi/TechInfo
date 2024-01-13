import { TypesComponent } from '../types.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-type',
  templateUrl: './delete-type.component.html',
  styleUrls: ['./delete-type.component.scss']
})

export class DeleteTypeComponent implements OnInit {

  id: any;
  type: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<TypesComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      //action: 'getById',
      //module: 'types',
      id: this.id,
    };
    const endpoint=  'types/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.type = answer.type.type;
    });
  }

  Submit() {
    const params = {
      //action: 'delete',
      //module: 'types',
      id: this.id,
    };
    const endpoint=  'types/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedType(this.id);
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
