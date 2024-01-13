import { MatSort } from '@angular/material/sort';
import { WarehousesData } from 'app/shared/models';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteWarehouseComponent } from './delete-warehouse/delete-warehouse.component';
import { AddEditWarehouseComponent } from './add-edit-warehouse/add-edit-warehouse.component';
import { MtxGridComponent, MtxGridColumn, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehousesComponent implements OnInit, AfterViewInit {

  user: any = '';
  filter: string;
  warehouses: any[];
  isLoading = true;
  current_warehouse: number;

  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<WarehousesData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_warehouse) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('warehousesTable') warehousesTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Warehouse', sortable: true, field: 'name' },
    /*{ header: 'Items To Receive',sortable: true, field: 'incomingorders'},*/
    /*{ header: 'Address', sortable: true, field: 'addressTrimed',showExpand: true }*/
    { header: 'Address', sortable: true, field: 'address' }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService,
  ) {
    this.filter = '';
    this.warehouses = [];
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
    this.AC.newWarehouseObserver().pipe(
      distinctUntilChanged()
    ).subscribe((warehouse) => {
      this.warehouses.push(warehouse);
      this.makeAddress();
      this.dataSource.data = this.warehouses;
      this.warehousesTable.dataSource = this.dataSource;
      this.loadWarehouses();
    });

    this.AC.updatedWarehouseObserver().pipe(
      distinctUntilChanged()
    ).subscribe((warehouse: any) => {
      this.warehouses.forEach((current, index) => {
        if (current.id === warehouse.id) {
          this.warehouses[index] = warehouse;
        }
      });
      this.makeAddress();
      this.dataSource.data = this.warehouses;
      this.warehousesTable.dataSource = this.dataSource;
      this.loadWarehouses();
    });

    this.AC.deletedWarehouseObserver().pipe(
      distinctUntilChanged()
    ).subscribe((id) => {
      const index = this.warehouses.indexOf(
        this.warehouses.filter((warhouse) => warhouse.id === id)
      );
      this.warehouses.splice(index, 1);
      this.dataSource.data = this.warehouses;
      this.warehousesTable.dataSource = this.dataSource;
      this.loadWarehouses();
      this.AC.setWhOrder(0);
    });

    this.AC.warehouseObserver().subscribe((warehouse_id) => {
      this.current_warehouse = Number(warehouse_id);
      this.warehousesTable.detectChanges();
      this.changeRef.detectChanges();
      });
  }

  ngAfterViewInit(): void {
    const params = {
      //action: 'getAll',
      //module: 'warehouses',
    };
    const endpoint='warehouses/getAll';
    this.isLoading = true;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.warehouses = answer.warehouses;
      this.makeAddress();
      this.dataSource.data = this.warehouses;


      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  setWarehouse(warehouse_id) {
    this.current_warehouse = Number(warehouse_id);
    this.AC.setWarehouse(Number(warehouse_id));
    // this.AC.setWhOrder(0);
    this.changeRef.detectChanges();
  }

  loadWarehouses() {
    this.isLoading = true;
    const params = {
      //action: 'getAll',
      //module: 'warehouses',
      id: Number(this.current_warehouse)
    };
    const endpoint= 'warehouses/getAll';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.warehouses = answer.warehouses;
      this.dataSource.data = this.warehouses;
      this.warehousesTable.dataSource = this.dataSource;
      this.makeAddress();
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Address concatenation
  makeAddress() {
    this.warehouses.forEach((warehouse) => {
      warehouse.address =
        warehouse.street +
        ', ' +
        warehouse.city +
        ', ' +
        warehouse.state +
        ', ' +
        warehouse.postal;
      warehouse.addressTrimed = warehouse.address.substring(0,10);
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.warehousesTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.filter = '';
    this.current_warehouse = 0;
    this.dataSource.data = this.warehouses;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.warehousesTable.dataSource.paginator) {
      this.warehousesTable.dataSource?.paginator?.firstPage();
    }
    this.warehousesTable.dataSource.filter = '';
    this.warehousesTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.setWarehouse(0);
    this.AC.setWhOrder(0);
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
      dialogRef = this.dialog.open(AddEditWarehouseComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteWarehouseComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    }
  }

  closeMenu() {
    this.warehousesTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(e);
  }
}
