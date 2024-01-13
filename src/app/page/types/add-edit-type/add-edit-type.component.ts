import { Observable } from 'rxjs';
import { Categories } from 'app/shared/models';
import { TypesComponent } from '../types.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-edit-type',
  templateUrl: './add-edit-type.component.html',
  styleUrls: ['./add-edit-type.component.scss']
})

export class AddEditTypeComponent implements OnInit {

  id: any;
  type: any;
  action: string;
  category_id: any;
  myForm: FormGroup;
  selected_category: number;
  current_category_id: number;
  categories$: Observable<any>;
  listOfCategories: Categories[];

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<TypesComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.action = data.action;
    this.myForm = new FormGroup({
      id: new FormControl(0),
      type: new FormControl('', Validators.required),
      category_id: new FormControl(0, Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.action === 'edit') {
      this.getTypeByID();
    }
    this.getCategories();
  }

  ngAfterViewInit() {
    this.AC.categoryObserver().pipe(
      distinctUntilChanged()
    ).subscribe((category_id) => {
      this.current_category_id = category_id;
      this.selected_category = Number(category_id);
      this.myForm.patchValue({
        category_id: Number(this.current_category_id)
      })
    })
    this.changeDetectorRef.detectChanges();
  }

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }
  getTypeByID() {
    this.id = this.data.id;
    const params = {
      //action: 'getById',
      //module: 'types',
      id: this.id,
    };
    const endpoint=  'types/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        id: Number(answer.type.id),
        type: answer.type.type,
        category_id: Number(answer.type.category_id),
      });
      this.changeDetectorRef.detectChanges();
      this.selected_category = Number(answer.type.category_id);

    });
  }

  async getCategories() {
    const params = {
      //action: 'getAll',
      //module: 'categories',
    };
    const endpoint=  'categories/getAll';
    await this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.listOfCategories = answer.categories.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
    });
    this.categories$ = await this.AC.get(params);
    this.categories$.subscribe((answer) => {
    });
  }

  convertToJSON(type: any) {
    return JSON.parse(type);
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
     // action: this.action.toLowerCase() === 'add' ? 'types/put' : 'types/post';
     // module: 'types',
      form: this.myForm.value,
    };
    console.dir(params);
    const endpoint= this.action.toLowerCase() === 'add' ? 'types/put' : 'types/post';
      this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewType(answer.type) :
        this.AC.setUpdateType(answer.type);
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



