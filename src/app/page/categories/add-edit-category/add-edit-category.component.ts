import { CategoriesComponent } from '../categories.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit {

  id: any;
  action: any;
  myForm: FormGroup;

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<CategoriesComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.action = data.action;
    this.myForm = new FormGroup({
      id: new FormControl(0),
      category: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.action.toLowerCase() === 'edit') {
      this.getCategoryByID();
    }
  }

  getCategoryByID() {
    this.id = this.data.id;
    const params = {
     // action: 'getById',
      //module: 'categories',
      id: this.id,
    };
    const endpoint=  'categories/getById';
     this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        id: Number(answer.category.id),
        category: answer.category.category,
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  convertToJSON(category: any) {
    return JSON.parse(category);
  }

  Submit() {
    if (this.action.toLowerCase() === 'add') {
      this.myForm.removeControl('id');
    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.patchValue({
        id: this.data.id
      });
    }
    const params = {
     // action: this.action.toLowerCase() === 'add' ? 'categories/put' : 'categories/post';
      //module: 'categories',
      form: this.myForm.value,
    };
    const endpoint=  this.action.toLowerCase() === 'add' ? 'categories/put' : 'categories/post';
     this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewCategory(answer.category) :
        this.AC.setUpdateCategory(answer.category);
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
