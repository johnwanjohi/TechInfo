import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { SuppliersData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteSupplierComponent } from './delete-supplier/delete-supplier.component';
import { AddEditSupplierComponent } from './add-edit-supplier/add-edit-supplier.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, } from '@angular/core';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})

export class SuppliersComponent implements OnInit, AfterViewInit {

  suppliers: any[];
  user: any = '';
  filter: string;
  isLoading = true;
  total_suppliers: number;
  current_supplier: number;

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<SuppliersData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_supplier) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('suppliersTable') suppliersTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Supplier', sortable: true, field: 'name' },
    { header: 'Address', sortable: true, field: 'address' }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService,
  ) {
    this.filter = '';
    this.suppliers = [];
    this.total_suppliers = 0;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
  }

  ngAfterViewInit(): void {
    const params = {
      //action: 'getAll',
      //module: 'suppliers',
    };
    this.isLoading = true;
    const endpoint= 'suppliers/getAll' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.suppliers = answer.suppliers;
      this.makeAddress();
      this.dataSource.data = this.suppliers;
      this.total_suppliers = this.suppliers.length;

      this.AC.newSupplierObserver().pipe(
        distinctUntilChanged()
      ).subscribe((supplier) => {
        this.suppliers.push(supplier);
        this.makeAddress();
        this.dataSource.data = this.suppliers;
        this.total_suppliers = this.dataSource.data.length;
        this.suppliersTable.dataSource = this.dataSource;
        this.loadSuppliers();
      });

      this.AC.updatedSupplierObserver().pipe(
        distinctUntilChanged()
      ).subscribe((supplier: any) => {
        this.suppliers.forEach((current, index) => {
          if (current.id == supplier.id) {
            this.suppliers[index] = supplier;
          }
        });
        this.makeAddress();
        this.dataSource.data = this.suppliers;
        this.total_suppliers = this.dataSource.data.length;
        this.suppliersTable.dataSource = this.dataSource;
        this.loadSuppliers();
      });

      this.AC.deletedSupplierObserver().pipe(
        distinctUntilChanged()
      ).subscribe((id) => {
        let index = this.suppliers.indexOf(
          this.suppliers.filter((supplier) => supplier.id == id)
        );
        this.suppliers.splice(index, 1);
        this.dataSource.data = this.suppliers;
        this.total_suppliers = this.dataSource.data.length;
        this.suppliersTable.dataSource = this.dataSource;
        this.loadSuppliers();
      });
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  setSupplier(supplier_id) {
    this.current_supplier = supplier_id;
    this.AC.setSupplier(Number(supplier_id));
  }
  loadSuppliers() {
    this.isLoading = true;
    const params = {
      //action: 'getAll',
      //module: 'suppliers',
      id: Number(this.current_supplier)
    };
    const endpoint= 'suppliers/getAll' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.suppliers = answer.suppliers;
      this.dataSource.data = this.suppliers;
      this.total_suppliers = this.dataSource.data.length;
      this.suppliersTable.dataSource = this.dataSource;
      this.makeAddress();
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Address concatenation
  makeAddress() {
    this.suppliers.forEach((supplier) => {
      supplier.address =
        supplier.street +
        ', ' +
        supplier.city +
        ', ' +
        supplier.state +
        ', ' +
        supplier.postal;
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.suppliersTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.filter = '';
    this.current_supplier = 0;
    this.dataSource.data = this.suppliers;
    this.total_suppliers = this.suppliers.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.suppliersTable.dataSource.paginator) {
      this.suppliersTable.dataSource?.paginator?.firstPage();
    }
    this.suppliersTable.dataSource.filter = '';
    this.suppliersTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.setSupplier(0);
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
      dialogRef = this.dialog.open(AddEditSupplierComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSupplierComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    }
  }

  closeMenu() {
    this.suppliersTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(e);
  }
}

