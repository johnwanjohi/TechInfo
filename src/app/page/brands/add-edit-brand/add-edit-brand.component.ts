import { BrandsComponent } from '../brands.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService, urlRegex } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-edit-brand',
  templateUrl: './add-edit-brand.component.html',
  styleUrls: ['./add-edit-brand.component.scss']
})

export class AddEditBrandComponent implements OnInit {
  id: any;
  action: any;
  myForm: FormGroup;

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<BrandsComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.action = data.action;
    this.myForm = new FormGroup({
      id: new FormControl(0),
      brand: new FormControl('', Validators.required),
      link: new FormControl('', [Validators.pattern(urlRegex)]),
    });
  }

  ngOnInit(): void {
    if (this.action.toLowerCase() === 'edit') {
      this.getBrandByID();
    }
  }

  getBrandByID() {
    this.id = this.data.id;
    const params = {
      id: this.id,
    };
    const endpoint= 'brands/getById' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        id: Number(answer.brand.id),
        brand: answer.brand.brand,
        link: answer.brand.link,
      });
      this.changeDetectorRef.detectChanges();
    });
  }
  convertToJSON(brand: any) {
    return JSON.parse(brand);
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
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'brands/put' : 'brands/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
      this.AC.setNewBrand(answer.brand) :
      this.AC.setUpdateBrand(answer.brand);
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
