import { SitesComponent } from '../sites.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-edit-site',
  templateUrl: './add-edit-site.component.html',
  styleUrls: ['./add-edit-site.component.scss']
})

export class AddEditSiteComponent implements OnInit {

  id: any;
  site: any;
  action: string;
  myForm: FormGroup;
  current_customer_id: number;

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SitesComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
    this.action = this.data.action;
    this.myForm = new FormGroup({
      id: new FormControl(0),
      customer_id: new FormControl(0, Validators.required),
      name: new FormControl('', Validators.required),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      postal: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.id = this.data.id;
    this.AC.customerObserver().pipe(
      distinctUntilChanged()
    ).subscribe((customer_id) => {
      this.current_customer_id = customer_id;
      this.myForm.patchValue({
        customer_id: Number(this.current_customer_id)
      });
    });
    if (this.action.toLowerCase() === 'edit') {
      this.getSiteByID();
    }
  }

  getSiteByID(): void {
    const params = {
      //action: 'getById',
      //module: 'sites',
      id: this.id,
    };
    const endpoint= 'sites/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.setValue({
        id: Number(answer.site.id),
        customer_id: Number(answer.site.customer_id),
        name: answer.site.name,
        street: answer.site.street,
        city: answer.site.city,
        state: answer.site.state,
        postal: answer.site.postal,
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
      this.myForm.removeControl('customer_id');
      this.myForm.patchValue({
        id: this.data.id
      });
    }
    const params = {
     // action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'sites',
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'sites/put' : 'sites/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewSite(answer.site) :
        this.AC.setUpdateSite(answer.site);
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

