import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { SubsContactsData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteSubcontactComponent } from './delete-subcontact/delete-subcontact.component';
import { AddEditSubcontactComponent } from './add-edit-subcontact/add-edit-subcontact.component';
import { MtxGridComponent, MtxGridColumn, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-subscontacts',
  templateUrl: './subscontacts.component.html',
  styleUrls: ['./subscontacts.component.scss']
})

export class SubscontactsComponent implements OnInit, AfterViewInit {

  user: any = '';
  filter: string;
  subscontacts: any[];
  isLoading = true;
  current_sub_id = 0;
  total_subscontacts = 0;
  current_subcontact = 0;

  columnHideable = true;
  columnMovable = true;
  dataSource: MatTableDataSource<SubsContactsData>;
  columnHideableChecked: 'show' | 'hide' = 'show';

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_sub_id) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('subscontactsTable') subscontactsTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'First Name', sortable: true, field: 'firstname' },
    { header: 'Last Name', sortable: true, field: 'lastname' },
    { header: 'Title', sortable: true, field: 'title' },
    { header: 'Work Phone', sortable: true, field: 'workphone', type: 'number' },
    { header: 'Cell phone', sortable: true, field: 'cellphone', type: 'number' },
    { header: 'Email', sortable: true, field: 'email' },
    { header: 'Sub Name', sortable: true, field: 'subname', hide: true }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private matTableService: MatTableService,
    private changeRef: ChangeDetectorRef
  ) {
    this.filter = '';
    this.subscontacts = [];
    this.current_sub_id = 0;
    this.total_subscontacts = 0;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
    this.loadSubsContacts();
    this.AC.subObserver().pipe(
      distinctUntilChanged()
    ).subscribe((sub_id) => {
      this.current_sub_id = sub_id;
      this.loadSubsContacts();
    });
  }

  ngAfterViewInit(): void {
    const params = {
     // action: 'getAll',
     // module: 'subscontacts',
    };
    this.isLoading = true;
    const endpoint= 'subscontacts/getAll';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.subscontacts = answer.subscontacts;
      this.dataSource.data = this.subscontacts;
      this.total_subscontacts = this.dataSource.data.length;

      this.AC.newSubsContactObserver().pipe(
        distinctUntilChanged()
      ).subscribe((subcontact) => {
        this.subscontacts.push(subcontact);
        this.displaySubsContacts();
      });

      this.AC.updatedSubsContactObserver().pipe(
        distinctUntilChanged()
      ).subscribe((subcontact: any) => {
        this.subscontacts.forEach((current, index) => {
          if (current.id == subcontact.id) {
            this.subscontacts[index] = subcontact;
          }
        });
        this.displaySubsContacts();
      });

      this.AC.deletedSubsContactObserver().pipe(
        distinctUntilChanged()
      ).subscribe((id) => {
        let index = this.subscontacts.indexOf(
          this.subscontacts.filter((subcontact) => subcontact.id == id)
        );
        this.subscontacts.splice(index, 1);
        this.displaySubsContacts();
      });

      this.AC.deletedSubObserver().pipe(
        distinctUntilChanged()
      ).subscribe((data) => {
        if (data) {
          this.displaySubsContacts();
        }
      });
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  loadSubsContacts() {
    const params = {
      //action: Number(this.current_sub_id) === 0 ? 'getAll' : 'getByForeignId',
      //module: 'subscontacts',
      sub_id: Number(this.current_sub_id),
    };
    const endpoint= Number(this.current_sub_id) === 0 ? 'subscontacts/getAll' : 'subscontacts/getByForeignId';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.subscontacts = answer.subscontacts;
      this.dataSource.data = this.subscontacts;
      this.total_subscontacts = this.dataSource.data.length;
      this.subscontactsTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  displaySubsContacts() {
    if (this.current_sub_id === 0) {
      this.loadSubsContacts();
      return;
    } else if (this.current_sub_id !== 0) {
      this.dataSource.data = this.subscontacts.filter(
        (contact) => contact.sub_id === this.current_sub_id
      );
    }
    this.total_subscontacts = this.dataSource.data.length;
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.subscontactsTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.filter = '';
    this.dataSource.data = this.subscontacts;
    this.total_subscontacts = this.subscontacts.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.subscontactsTable.dataSource.paginator) {
      this.subscontactsTable.dataSource?.paginator?.firstPage();
    }
    this.subscontactsTable.dataSource.filter = '';
    this.subscontactsTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.changeRef.detectChanges();
  }
  // Add Edit Delete Dialog Window
  openDialog(action: any, obj: any) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = true;
    matDialogConfig.autoFocus = true;
    obj.action = action;
    matDialogConfig.data = obj;
    let dialogRef: any;
    if (action.toLowerCase() === 'add' || action.toLowerCase() === 'edit') {
      dialogRef = this.dialog.open(AddEditSubcontactComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSubsContacts();
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSubcontactComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSubsContacts();
      });
    }
  }

  closeMenu() {
    this.subscontactsTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(e);
  }
}
