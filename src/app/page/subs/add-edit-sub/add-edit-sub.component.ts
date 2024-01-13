import { SubsComponent } from "../subs.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-edit-sub',
  templateUrl: './add-edit-sub.component.html',
  styleUrls: ['./add-edit-sub.component.scss']
})

export class AddEditSubComponent implements OnInit {

  id: any;
  action: any;
  myForm: FormGroup;

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SubsComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
    this.action = data.action;
    this.myForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      postal: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.action.toLowerCase() === 'edit') {
      this.getSubByID();
    }
  }

  getSubByID() {
    const params = {
      //action: 'getById',
      //module: 'subs',
      id: this.id,
    };
    const endpoint= "subs/getById";
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        id: Number(answer.sub.id),
        name: answer.sub.name,
        street: answer.sub.street,
        city: answer.sub.city,
        state: answer.sub.state,
        postal: answer.sub.postal,
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  convertToJSON(product: any) {
    return JSON.parse(product);
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
      //action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'subs',
      form: this.myForm.value,
    };
    const endpoint=  this.action.toLowerCase() === 'add' ? 'subs/put' : 'subs/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewSub(answer.sub) :
        this.AC.setUpdateSub(answer.sub);
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
