import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { SuppliersContactsData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteSuppliercontactComponent } from './delete-suppliercontact/delete-suppliercontact.component';
import { AddEditSuppliercontactComponent } from './add-edit-suppliercontact/add-edit-suppliercontact.component';
import { MtxGridComponent, MtxGridColumn, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-supplierscontacts',
  templateUrl: './supplierscontacts.component.html',
  styleUrls: ['./supplierscontacts.component.scss']
})

export class SupplierscontactsComponent implements OnInit, AfterViewInit {

  user: any = '';
  filter: string;
  supplierscontacts: any[];
  isLoading = true;
  current_supplier_id = 0;
  total_supplierscontacts = 0;
  current_suppliercontact = 0;

  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<SuppliersContactsData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_supplier_id) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('supplierscontactsTable') supplierscontactsTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'First Name', sortable: true, field: 'firstname' },
    { header: 'Last Name', sortable: true, field: 'lastname' },
    { header: 'Title', sortable: true, field: 'title' },
    { header: 'Work Phone', sortable: true, field: 'workphone', type: 'number' },
    { header: 'Cell phone', sortable: true, field: 'cellphone', type: 'number' },
    { header: 'Email', sortable: true, field: 'email' },
    { header: 'Supplier Name', sortable: true, field: 'suppliername', hide: true }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private matTableService: MatTableService,
    private changeRef: ChangeDetectorRef
  ) {
    this.filter = '';
    this.supplierscontacts = [];
    this.current_supplier_id = 0;
    this.total_supplierscontacts = 0;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
    this.loadSuppliersContacts();
    this.AC.supplierObserver().pipe(
      distinctUntilChanged()
    ).subscribe((supplier_id) => {
      this.current_supplier_id = supplier_id;
      this.loadSuppliersContacts();
    });
  }

  ngAfterViewInit(): void {
    const params = {
      //action: 'getAll',
      //module: 'supplierscontacts',
    };
    this.isLoading = true;
     const endpoint=  'supplierscontacts/getAll';
     this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.supplierscontacts = answer.supplierscontacts;
      this.dataSource.data = this.supplierscontacts;
      this.total_supplierscontacts = this.dataSource.data.length;

      this.AC.newSuppliersContactObserver().pipe(
        distinctUntilChanged()
      ).subscribe((suppliercontact) => {
        this.supplierscontacts.push(suppliercontact);
        this.displaySuppliersContacts();
      });

      this.AC.updatedSuppliersContactObserver().pipe(
        distinctUntilChanged()
      ).subscribe((suppliercontact: any) => {
        this.supplierscontacts.forEach((current, index) => {
          if (current.id == suppliercontact.id) {
            this.supplierscontacts[index] = suppliercontact;
          }
        });
        this.displaySuppliersContacts();
      });

      this.AC.deletedSuppliersContactObserver().pipe(
        distinctUntilChanged()
      ).subscribe((id) => {
        let index = this.supplierscontacts.indexOf(
          this.supplierscontacts.filter((suppliercontact) => suppliercontact.id == id)
        );
        this.supplierscontacts.splice(index, 1);
        this.displaySuppliersContacts();
      });

      this.AC.deletedSupplierObserver().pipe(
        distinctUntilChanged()
      ).subscribe((data) => {
        if (data) {
          this.displaySuppliersContacts();
        }
      });
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  loadSuppliersContacts() {
    const params = {
      //action: 
      //module: 'supplierscontacts',
      supplier_id: Number(this.current_supplier_id),
    };
    const endpoint=  Number(this.current_supplier_id) === 0 ? 'supplierscontacts/getAll' : 'supplierscontacts/getByForeignId';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.supplierscontacts = answer.supplierscontacts;
      this.dataSource.data = this.supplierscontacts;
      this.total_supplierscontacts = this.dataSource.data.length;
      this.supplierscontactsTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  displaySuppliersContacts() {
    if (this.current_supplier_id === 0) {
      this.loadSuppliersContacts();
      return;
    } else if (this.current_supplier_id !== 0) {
      this.dataSource.data = this.supplierscontacts.filter(
        (contact) => contact.supplier_id === this.current_supplier_id
      );
    }
    this.total_supplierscontacts = this.dataSource.data.length;
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.supplierscontactsTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.filter = '';
    this.dataSource.data = this.supplierscontacts;
    this.total_supplierscontacts = this.supplierscontacts.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.supplierscontactsTable.dataSource.paginator) {
      this.supplierscontactsTable.dataSource?.paginator?.firstPage();
    }
    this.supplierscontactsTable.dataSource.filter = '';
    this.supplierscontactsTable.sort.sort({
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
      dialogRef = this.dialog.open(AddEditSuppliercontactComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSuppliersContacts();
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSuppliercontactComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSuppliersContacts();
      });
    }
  }

  closeMenu() {
    this.supplierscontactsTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(e);
  }
}
