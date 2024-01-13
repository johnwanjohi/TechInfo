import { distinctUntilChanged } from 'rxjs/operators';
import { ContactsComponent } from '../contacts.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Optional } from '@angular/core';

@Component({
  selector: 'app-add-edit-contact',
  templateUrl: './add-edit-contact.component.html',
  styleUrls: ['./add-edit-contact.component.scss']
})

export class AddEditContactComponent implements OnInit {

  id: any;
  sites: any;
  contact: any;
  action: string;
  myForm: FormGroup;
  current_site_id: number;
  current_customer_id: number;

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<ContactsComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
    this.action = this.data.action;
    this.myForm = new FormGroup({
      id: new FormControl(0),
      customer_id: new FormControl(0, [Validators.required]),
      site_id: new FormControl(0),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      workphone: new FormControl(''),
      cellphone: new FormControl(''),
      email: new FormControl('', [Validators.email]),
    });
  }

  ngOnInit(): void {

    this.AC.customerObserver().pipe(
      distinctUntilChanged()
    ).subscribe((customer_id) => {
      this.current_customer_id = customer_id;
      this.myForm.patchValue({
        customer_id: Number(this.current_customer_id)
      });
      this.myForm.patchValue({
        site_id: Number(0)
      });
      this.loadSites();
    });

    this.AC.siteObserver().pipe(
      distinctUntilChanged()
    ).subscribe((site_id) => {
      this.current_site_id = site_id;
      this.myForm.patchValue({
        site_id: Number(this.current_site_id)
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
      //module: 'contacts',
      id: this.id,
    };
    const endpoint= 'contacts/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        id: Number(answer.contact.id),
        customer_id: Number(answer.contact.customer_id),
        site_id: Number(answer.contact.site_id),
        firstname: answer.contact.firstname,
        lastname: answer.contact.lastname,
        title: answer.contact.title,
        workphone: answer.contact.workphone,
        cellphone: answer.contact.cellphone,
        email: answer.contact.email,
      });
      this.current_customer_id = Number(answer.contact.customer_id);
      this.loadSites();
    });
  }

  async loadSites() {
    this.id = this.data.id;
    const params = {
      //action: 'getAllSitesByCustomerId',
      //module: 'sites',
      customer_id: Number(this.current_customer_id)
    };
    const endpoint= 'sites/getAllSitesByCustomerId';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.sites = answer.sites.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
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
      this.myForm.removeControl('customer_id');
      this.myForm.patchValue({
        id: this.data.id
      });
    }
    const params = {
      //action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'contacts',
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'contacts/put' : 'contacts/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewContact(answer.contact) :
        this.AC.setUpdatedContact(answer.contact);
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
