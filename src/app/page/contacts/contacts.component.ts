import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { ContactsData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteContactComponent } from './delete-contact/delete-contact.component';
import { AddEditContactComponent } from './add-edit-contact/add-edit-contact.component';
import { MtxGridComponent, MtxGridColumn, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})

export class ContactsComponent implements OnInit, AfterViewInit {

  user: any = '';
  filter: string;
  contacts: any[];
  isLoading = true;
  total_contacts = 0;
  current_site_id = 0;
  current_customer_id = 0;

  columnHideable = true;
  columnMovable = true;
  dataSource: MatTableDataSource<ContactsData>;
  columnHideableChecked: 'show' | 'hide' = 'show';

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_customer_id) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('contactsTable') contactsTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'First Name', sortable: true, field: 'firstname' },
    { header: 'Last Name', sortable: true, field: 'lastname' },
    { header: 'Title', sortable: true, field: 'title' },
    { header: 'Work Phone', sortable: true, field: 'workphone', type: 'number' },
    { header: 'Cell phone', sortable: true, field: 'cellphone', type: 'number' },
    { header: 'Email', sortable: true, field: 'email' },
    { header: 'Site Name', sortable: true, field: 'sitename', hide: true },
    { header: 'Customer Name', sortable: true, field: 'customername', hide: true }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.contacts = [];
    this.total_contacts = 0;
    this.current_site_id = 0;
    this.current_customer_id = 0;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
    this.loadContacts();
    this.AC.customerObserver().pipe(
      distinctUntilChanged()
    ).subscribe((customer_id) => {
      this.current_customer_id = customer_id;
      this.loadContacts();
    });
    this.AC.siteObserver().pipe(
      distinctUntilChanged()
    ).subscribe((site_id) => {
      this.current_site_id = site_id;
      this.loadContacts();
    });
  }

  ngAfterViewInit(): void {
    const params = {
     // action: '',
      //module: 'contacts',
    };
    const baseUrl="contacts/getAll";
    this.isLoading = true;
    this.AC.post(params,baseUrl).subscribe((answer: any) => {
      this.contacts = answer.contacts;
      this.dataSource.data = this.contacts;
      this.total_contacts = this.dataSource.data.length;

      this.AC.newContactObserver().pipe(
        distinctUntilChanged()
      ).subscribe((contact) => {
        this.contacts.push(contact);
        this.displayContacts();
      });

      this.AC.updatedContactObserver().pipe(
        distinctUntilChanged()
      ).subscribe((contact: any) => {
        this.contacts.forEach((current, index) => {
          if (current.id === contact.id) {
            this.contacts[index] = contact;
          }
        });
        this.displayContacts();
      });

      this.AC.deletedContactObserver().pipe(
        distinctUntilChanged()
      ).subscribe((id) => {
        const index = this.contacts.indexOf(
          this.contacts.filter((contact) => contact.id === id)
        );
        this.contacts.splice(index, 1);
        this.displayContacts();
      });

      this.AC.deletedSiteObserver().pipe(
        distinctUntilChanged()
      ).subscribe((data) => {
        if (data) {
          this.displayContacts();
        }
      });
      this.AC.deletedCustomerObserver().pipe(
        distinctUntilChanged()
      ).subscribe((data) => {
        if (data) {
          this.displayContacts();
        }
      });
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  loadContacts() {
    this.isLoading = true;
    const params = {
     // action: Number(this.current_customer_id) === 0 && Number(this.current_site_id) === 0 ? 'getAll' : 'getByForeignIds',
     // module: 'contacts',
      customer_id: Number(this.current_customer_id),
      site_id: Number(this.current_site_id)
    };
    //const endPoint="contact/getAll";
    const endPoint= Number(this.current_customer_id) === 0 && Number(this.current_site_id) === 0 ? 'contacts/getAll' : 'contacts/getByForeignIds';
    this.AC.post(params,endPoint).subscribe((answer: any) => {
      this.contacts = answer.contacts;
      this.dataSource.data = this.contacts;
      this.contactsTable.dataSource = this.dataSource;
      this.total_contacts = this.dataSource.data.length;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  displayContacts() {
    if (this.current_customer_id === 0 && this.current_site_id === 0) {
      this.loadContacts();
      return;
    } else if (this.current_customer_id !== 0 && this.current_site_id === 0) {
      this.dataSource.data = this.contacts.filter(
        (contact) => contact.customer_id === this.current_customer_id
      );
    } else if (this.current_customer_id === 0 && this.current_site_id !== 0) {
      this.dataSource.data = this.contacts.filter(
        (contact) => contact.site_id === this.current_site_id
      );
    } else {
      this.dataSource.data = this.contacts.filter(
        (contact) =>
          contact.site_id === this.current_site_id &&
          contact.customer_id === this.current_customer_id
      );
    }
    this.total_contacts = this.dataSource.data.length;
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.contactsTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function (Customer Reset doesn't work)
  reset() {
    this.filter = '';
    this.dataSource.data = this.contacts;
    this.total_contacts = this.contacts.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.contactsTable.dataSource.paginator) {
      this.contactsTable.dataSource?.paginator?.firstPage();
    }
    this.contactsTable.dataSource.filter = '';
    this.contactsTable.sort.sort({
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
      dialogRef = this.dialog.open(AddEditContactComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadContacts();
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteContactComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadContacts();
      });
    }
  }

  closeMenu() {
    this.contactsTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(e);
  }
}
