import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SysRemoteAccessComponent } from '../sys-remote-access.component';
import { FormcontrolsService } from 'app/shared/services/formcontrols.service';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-add-edit-sys-remote-access',
  templateUrl: './add-edit-sys-remote-access.component.html',
  styleUrls: ['./add-edit-sys-remote-access.component.scss']
})

export class AddEditSysRemoteAccessComponent implements OnInit {

  id: any;
  action: any;
  myForm: FormGroup;
  selected_system_type: string;
  current_system_type: any;
  current_r_access_id: any;
  currentUserName: string;
  current_system_site_id: any;
  listOfRemoteTypes: any[];

  constructor(
    private AC: AccountsService,
    public formService: FormcontrolsService,
    public dialogRef: MatDialogRef<SysRemoteAccessComponent>,
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
    this.AC.remoteAccessObserver().subscribe((r_access_id) => {
      this.current_r_access_id = r_access_id;
    });
    this.getSystemTypes();

    this.loadListOfRemoteTypes();
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
      this.loadRemoteAccessByID();
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
      remote_type: new FormControl('', Validators.required),
      remote_name: new FormControl(''),
      remote_id: new FormControl('', Validators.required),
      remote_login: new FormControl(''),
      remote_password: new FormControl(''),
      notes: new FormControl('')
    });
    this.myForm.markAllAsTouched();
  }

  async loadRemoteAccessByID() {
    this.id = this.data.id || this.current_r_access_id;
    const params = {
      action: 'getRemoteAccessByID',
      module: 'remote_access',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          id: Number(answer.remote_access.id),
          site_id: Number(answer.remote_access.site_id),
          remote_type: answer.remote_access.remote_type,
          remote_name: answer.remote_access.remote_name,
          remote_id: answer.remote_access.remote_id,
          remote_login: answer.remote_access.remote_login,
          remote_password: answer.remote_access.remote_password,
          notes: answer.remote_access.notes,
        });
      this.changeDetectorRef.detectChanges();
      this.selected_system_type = answer.remote_access.system_type;
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
      //action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'remote_access',
      form: this.myForm.value,

    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'remote_access/put' : 'remote_access/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewRemoteAccess(answer.remote_access) :
        this.AC.setUpdatedRemoteAccess(answer.remote_access);
      this.closeDialog();
    });
  }

  loadListOfRemoteTypes() {
    this.listOfRemoteTypes = [
      { Id: '1', remotetype: 'Any Desk' },
      { Id: '2', remotetype: 'Splashtop' },
      { Id: '3', remotetype: 'Team Viewer' },
      { Id: '4', remotetype: 'WRD' },
    ]
  }


  Cancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

