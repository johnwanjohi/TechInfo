import { Observable } from 'rxjs';
import { System_types } from 'app/shared/models';
import { distinctUntilChanged } from 'rxjs/operators';
import { SitenotesComponent } from '../sitenotes.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormcontrolsService } from 'app/shared/services/formcontrols.service';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-sitenote',
  templateUrl: './add-edit-sitenote.component.html',
  styleUrls: ['./add-edit-sitenote.component.scss']
})
export class AddEditSitenoteComponent implements OnInit {

  id: any;
  action: any;
  myForm: FormGroup;
  current_sitenote_id: any;
  current_system_type: any;
  current_system_site_id: any;
  selected_systemtype: any;
  currentUserName: string;
  systemtypes: System_types[] = [];
  listOfSystemTypes: any[];
  systemtypes$: Observable<any>;

  model: NgbDateStruct;

  constructor(
    private AC: AccountsService,
    private cdr: ChangeDetectorRef,
    public formService: FormcontrolsService,
    public dialogRef: MatDialogRef<SitenotesComponent>,
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
    this.id = this.data.id;
    this.initializeForm();
    this.getSystemTypes();
    this.AC.siteNoteObserver().subscribe((sitenote_id) => {
      this.current_sitenote_id = sitenote_id;
    });

    this.AC.systeminfoSiteObserver().subscribe((system_site_id) => {
      this.current_system_site_id = Number(system_site_id);
      this.myForm.patchValue({
        site_id: Number(this.current_system_site_id)
      });
    });
    if (this.action === 'edit') {
      this.loadSiteNoteByID();
    }
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  initializeForm() {
    this.myForm = new FormGroup({
      id: new FormControl(0),
      site_id: new FormControl(0, Validators.required),
      system_type: new FormControl('', Validators.required),
      note: new FormControl('', Validators.required),
      modify_by: new FormControl(this.currentUserName),
      create_by: new FormControl(this.currentUserName),
      modify_date: new FormControl(''),
      description: new FormControl('')
    });
    this.myForm.markAllAsTouched();
  }

  async loadSiteNoteByID() {
    this.id = this.data.id || this.current_sitenote_id;
    const params = {
      action: 'getSiteNoteById',
      module: 'site_notes',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          id: Number(answer.site_notes.id),
          site_id: Number(answer.site_notes.site_id),
          system_type: Number(answer.site_notes.system_type),
          note: answer.site_notes.note,
          modify_date: answer.site_notes.modify_date,
          description: answer.site_notes.description,
        });
      this.changeDetectorRef.detectChanges();
      this.selected_systemtype = Number(answer.site_notes.system_type);
    });
  }

  async getSystemTypes() {
    const params = {
      action: 'getAll',
      module: 'system_types',
    };
    this.systemtypes$ = await this.AC.get(params);
    this.systemtypes$.subscribe((answer: any) => {
      this.listOfSystemTypes = answer.system_types.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
    });
  }

  convertToJSON(product: any) {
    return JSON.parse(product);
  }

  Submit() {
    this.myForm.markAllAsTouched();
    this.myForm.removeControl('modify_date');
    if (this.action.toLowerCase() === 'add') {
    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.removeControl('create_by');
      this.myForm.patchValue({
        id: this.data.id,
      });
    }
    const params = {
      //action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'site_notes',
      form: this.myForm.value,
    };
    const endpoint=  this.action.toLowerCase() === 'add' ? 'site_notes/put' : 'site_notes/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewSiteNote(answer.site_notes) :
        this.AC.setUpdatedSiteNote(answer.site_notes);
      this.myForm.patchValue({
        id: Number(answer.site_notes.id),
      });
      this.AC.sitenote_id.next(answer.site_notes.id);
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
