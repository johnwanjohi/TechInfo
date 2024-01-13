import { distinctUntilChanged } from 'rxjs/operators';
import { SubscontactsComponent } from '../subscontacts.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Optional } from '@angular/core';

@Component({
  selector: 'app-add-edit-subcontact',
  templateUrl: './add-edit-subcontact.component.html',
  styleUrls: ['./add-edit-subcontact.component.scss']
})

export class AddEditSubcontactComponent implements OnInit {

  id: any;
  subcontact: any;
  action: string;
  myForm: FormGroup;
  current_sub_id: number;

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SubscontactsComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
    this.action = this.data.action;
    this.myForm = new FormGroup({
      id: new FormControl(0),
      sub_id: new FormControl(0, [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      workphone: new FormControl(''),
      cellphone: new FormControl(''),
      email: new FormControl('', [Validators.email]),
    });
  }

  ngOnInit(): void {

    this.AC.subObserver().pipe(
      distinctUntilChanged()
    ).subscribe((sub_id) => {
      this.current_sub_id = sub_id;
      this.myForm.patchValue({
        sub_id: Number(this.current_sub_id)
      });
    });
    if (this.action === 'edit') {
      this.getContactByID();
    }
  }

  getContactByID() {
    this.id = this.data.id;
    const params = {
      //action: 'getById',
      //module: 'subscontacts',
      id: this.id,
    };
    const endpoint= 'subscontacts/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        id: Number(answer.subcontact.id),
        sub_id: Number(answer.subcontact.sub_id),
        firstname: answer.subcontact.firstname,
        lastname: answer.subcontact.lastname,
        title: answer.subcontact.title,
        workphone: answer.subcontact.workphone,
        cellphone: answer.subcontact.cellphone,
        email: answer.subcontact.email,
      });
      this.current_sub_id = Number(answer.subcontact.sub_id);
    });
  }

  convertToJSON(contact: any) {
    return JSON.parse(contact);
  }

  Submit() {
    if (this.action.toLowerCase() === 'add') {
      this.myForm.removeControl('id');
    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.removeControl('sub_id');
      this.myForm.patchValue({
        id: this.data.id
      });
    }
    const params = {
      //action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'subscontacts',
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'subscontacts/put' : 'subscontacts/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewSubsContact(answer.subcontact) :
        this.AC.setUpdatedSubsContact(answer.subcontact);
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
