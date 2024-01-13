import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SysDoorsComponent } from '../sys-doors.component';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormcontrolsService } from 'app/shared/services/formcontrols.service';
import { AccountsService } from 'app/shared/services/accounts.service';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-add-edit-sys-door',
  templateUrl: './add-edit-sys-door.component.html',
  styleUrls: ['./add-edit-sys-door.component.scss']
})
export class AddEditSysDoorComponent implements OnInit, AfterViewChecked {
  id: any;
  action: any;
  myForm: FormGroup;
  current_system_site_id: any;
  current_system_door_id: any;
  currentUserName: string;

  constructor(
    private AC: AccountsService,
    public formService: FormcontrolsService,
    public dialogRef: MatDialogRef<SysDoorsComponent>,
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
    this.AC.systemDoorObserver().subscribe((systemdoor_id) => {
      this.current_system_door_id = systemdoor_id;
    });
    this.id = this.data.id;
    this.AC.systeminfoSiteObserver().subscribe((system_site_id) => {
      this.current_system_site_id = Number(system_site_id);
      this.myForm.patchValue({
        site_id: Number(this.current_system_site_id)
      });
    });
    if (this.action === 'edit') {
      this.loadSysDoorByID();
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  initializeForm() {
    this.myForm = new FormGroup({
      id: new FormControl(0),
      site_id: new FormControl(0, Validators.required),
      name: new FormControl('', Validators.required),
      panel: new FormControl('', Validators.required),
      label: new FormControl(''),
      notes: new FormControl('')
    });
    this.myForm.markAllAsTouched();
  }

  async loadSysDoorByID() {
    this.id = this.data.id || this.current_system_door_id;
    const params = {
      action: 'getSysDoorByID',
      module: 'system_doors',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          id: Number(answer.system_doors.id),
          site_id: Number(answer.system_doors.site_id),
          name: answer.system_doors.name,
          panel: answer.system_doors.panel,
          label: answer.sys_doors.label,
          notes: answer.system_doors.notes,
        });
      this.changeDetectorRef.detectChanges();
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
        id: this.data.id
      });
    }
    const params = {
      // action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //  module: 'system_doors',
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'system_doors/put' : 'system_doors/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewSystemDoor(answer.system_doors) :
        this.AC.setUpdatedSystemDoor(answer.system_doors);
      this.closeDialog();
    });
  }

  get displayFormErrors() {
    return this.formService.findInvalidControls(this.myForm);
  }

  Cancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

