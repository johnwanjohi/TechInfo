import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { CustomersData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteCustomerComponent } from './delete-customer/delete-customer.component';
import { AddEditCustomerComponent } from './add-edit-customer/add-edit-customer.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export class CustomersComponent implements OnInit, AfterViewInit {

  user: any = '';
  filter: string;
  customers: any[];
  isLoading = true;
  total_customers: number;
  current_customer: number;

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<CustomersData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_customer) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('customersTable') customersTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Customer', sortable: true, field: 'name' },
    { header: 'Address', sortable: true, field: 'address' }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.customers = [];
    this.total_customers = 0;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      console.log(this.user?.roles[0]?.name);
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
  }

  ngAfterViewInit(): void {
    const params = {
      //action: 'getAll',
      //module: 'customers',
    };
    this.isLoading = true;
    const endpoint= "customers/getAll";
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.customers = answer.customers;
      this.makeAddress();
      this.dataSource.data = this.customers;
      this.total_customers = this.customers.length;

      this.AC.newCustomerObserver().pipe(
        distinctUntilChanged()
      ).subscribe((customer) => {
        this.customers.push(customer);
        this.makeAddress();
        this.dataSource.data = this.customers;
        this.total_customers = this.dataSource.data.length;
        this.customersTable.dataSource = this.dataSource;
        this.loadCustomers();
      });

      this.AC.updatedCustomerObserver().pipe(
        distinctUntilChanged()
      ).subscribe((customer: any) => {
        this.customers.forEach((current, index) => {
          if (current.id === customer.id) {
            this.customers[index] = customer;
          }
        });
        this.makeAddress();
        this.dataSource.data = this.customers;
        this.total_customers = this.customers.length;
        this.customersTable.dataSource = this.dataSource;
        this.loadCustomers();
      });

      this.AC.deletedCustomerObserver().pipe(
        distinctUntilChanged()
      ).subscribe((id) => {
        const index = this.customers.indexOf(
          this.customers.filter((customer) => customer.id === id)
        );
        this.customers.splice(index, 1);
        this.dataSource.data = this.customers;
        this.total_customers = this.dataSource.data.length;
        this.customersTable.dataSource = this.dataSource;
        this.loadCustomers();
        this.AC.setSite(0);
      });

      this.AC.siteCustomerObserver().pipe(
        distinctUntilChanged()
      ).subscribe((customer_id) => {
        if (customer_id == 0) this.dataSource.data = this.customers;
        else
          this.dataSource.data = this.customers.filter(
            (customer) => customer.id == customer_id
          );
        this.total_customers = this.dataSource.data.length;
      });
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  setCustomer(customer_id) {
    this.current_customer = Number(customer_id);
    this.AC.setCustomer(Number(customer_id));
    this.AC.setSite(0);
  }

  loadCustomers() {
    this.isLoading = true;
    const params = {
     // action: 'getAll',
     // module: 'customers',
      id: Number(this.current_customer)
    };
    const endPoint= "customers/getAll";
    this.AC.post(params,endPoint).subscribe((answer: any) => {
      this.customers = answer.customers;
      this.dataSource.data = this.customers;
      this.customersTable.dataSource = this.dataSource;
      this.total_customers = this.dataSource.data.length;
      this.makeAddress();
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Address concatenation
  makeAddress() {
    this.customers.forEach((customer) => {
      customer.address =
        customer.street +
        ', ' +
        customer.city +
        ', ' +
        customer.state +
        ', ' +
        customer.postal;
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.customersTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.filter = '';
    this.current_customer = 0;
    this.dataSource.data = this.customers;
    this.total_customers = this.customers.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.customersTable.dataSource.paginator) {
      this.customersTable.dataSource?.paginator?.firstPage();
    }
    this.customersTable.dataSource.filter = '';
    this.customersTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.setCustomer(0);
    this.AC.setSite(0);
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
      dialogRef = this.dialog.open(AddEditCustomerComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteCustomerComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    }
  }

  closeMenu() {
    this.customersTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(_e);
  }
}
