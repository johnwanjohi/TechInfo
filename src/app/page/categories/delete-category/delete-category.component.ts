import { CategoriesComponent } from '../categories.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.scss']
})

export class DeleteCategoryComponent implements OnInit {

  id: any;
  category: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<CategoriesComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    let params = {
      //action: 'getById',
      //module: 'categories',
      id: this.id,
    };
    const endpoint=  'categories/getById';
     this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.category = answer.category.category;
    });
  }

  Submit() {
    let params = {
      //action: 'delete',
      //module: 'categories',
      id: this.id,
    };
    const endpoint=  'categories/delete';
     this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedCategory(this.id);
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