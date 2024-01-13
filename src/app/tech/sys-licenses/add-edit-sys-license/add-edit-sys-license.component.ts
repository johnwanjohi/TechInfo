import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SysLicensesComponent } from '../sys-licenses.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormcontrolsService } from 'app/shared/services/formcontrols.service';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef, } from '@angular/core';

@Component({
  selector: 'app-add-edit-sys-license',
  templateUrl: './add-edit-sys-license.component.html',
  styleUrls: ['./add-edit-sys-license.component.scss']
})

export class AddEditSysLicenseComponent implements OnInit {

  id: any;
  action: any;
  myForm: FormGroup;
  brand_id: any;
  listOfBrands: any[];
  brands$: Observable<any>;
  selected_brand: number;
  selected_system_type: string;
  current_system_type: any;
  current_brand_id: number;
  current_license_id: any;
  currentUserName: string;
  current_system_site_id: any;

  model: NgbDateStruct;

  constructor(
    private AC: AccountsService,
    public formService: FormcontrolsService,
    public dialogRef: MatDialogRef<SysLicensesComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
    this.action = data.action;
    this.AC.loggedInUser.subscribe((userDetails) => {
      this.currentUserName = userDetails.username;
    });
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.AC.licenseObserver().subscribe((license_id) => {
      this.current_license_id = license_id;
    });
    this.getBrands();
    this.getSystemTypes();
    this.id = this.data.id;
    this.myForm.patchValue({
      system_type: this.current_system_type,
    });
    this.AC.systeminfoSiteObserver().subscribe((system_site_id) => {
      this.current_system_site_id = Number(system_site_id);
      this.myForm.patchValue({
        site_id: Number(this.current_system_site_id)
      });
    });
    if (this.action === 'edit') {
      this.loadLicenseByID();
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  initializeForm() {
    this.myForm = new FormGroup({
      id: new FormControl(0),
      site_id: new FormControl(0, Validators.required),
      system_type: new FormControl('', Validators.required),
      brand_id: new FormControl(0, Validators.required),
      type: new FormControl('', Validators.required),
      license: new FormControl('', Validators.required),
      devices_qty: new FormControl(0),
      activation_date: new FormControl(''),
      notes: new FormControl('')
    });
    this.myForm.markAllAsTouched();
  }

  async loadLicenseByID() {
    this.id = this.data.id || this.current_license_id;
    const params = {
      action: 'getLicenseByID',
      module: 'licenses',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          id: Number(answer.licenses.id),
          site_id: Number(answer.licenses.site_id),
          brand_id: Number(answer.licenses.brand_id),
          type: answer.licenses.type,
          license: answer.licenses.license,
          devices_qty: Number(answer.licenses.devices_qty),
          activation_date: answer.licenses.activation_date,
          notes: answer.licenses.notes,
        });
      this.changeDetectorRef.detectChanges();
      this.selected_brand = Number(answer.licenses.brand_id);
      this.selected_system_type = answer.licenses.system_type;
    });
  }

  async getBrands() {
    const params = {
      id: this.id,
    };
    const endpoint= 'brands/getAll' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.listOfBrands = answer.brands.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
    });
    this.brands$ = await this.AC.get(params);
    this.brands$.subscribe((answer) => {
    });
  }

  async getSystemTypes() {
    this.AC.systemType.pipe(
      distinctUntilChanged()
    ).subscribe(system_type => {
      this.current_system_type = system_type;
    });
  }

  convertToJSON(product: any) {
    return JSON.parse(product);
  }

  Submit() {
    this.myForm.markAllAsTouched();
    if (this.action.toLowerCase() === 'add') {
    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.removeControl('site_id');
      this.myForm.patchValue({
        id: this.data.id,
      });
    }
    const params = {
     // action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
     // module: 'licenses',
      form: this.myForm.value,

    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'licenses/put' : 'licenses/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewLicense(answer.licenses) :
        this.AC.setUpdatedLicense(answer.licenses);
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

