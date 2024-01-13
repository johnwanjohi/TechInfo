import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { whSupplierReturnData } from 'app/shared/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { AddEditSupplierReturnComponent } from './add-edit-supplierreturn/add-edit-supplierreturn.component';
import { DeleteSupplierReturnComponent } from './delete-supplierreturn/delete-supplierreturn.component';
import { MtxGridRowClassFormatter, MtxGridColumn, MtxGridComponent } from '@ng-matero/extensions/grid';
import {Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {SubscriptionsContainer} from '../../../shared/containers/subscriptions-container';

@Component({
  selector: 'app-supplierreturn',
  templateUrl: './supplierreturn.component.html',
  styleUrls: ['./supplierreturn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SupplierReturnComponent implements OnInit, OnDestroy {

  user: any = '';
  filter: string;
  isLoading = true;
  sr_line_items: any[];
  total_sr_line_items = 0;
  current_item_id: any;
  current_whorder_id: any;
  current_warehouse_id: number;

  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<whSupplierReturnData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_item_id) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('supplierReturnTable') supplierReturnTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Warehouse', sortable: true, field: 'warehouse', hide: true },
    { header: 'Status', sortable: true, field: 'status' },
    { header: 'Part Number', sortable: true, field: 'partnumber' },
    { header: 'Returned Qty', sortable: true, field: 'return_qty' },
    { header: 'Supplier', sortable: true, field: 'supplier' },
    { header: 'Supplier Order #', sortable: true, field: 'supplier_order_number' },
    { header: 'Create Date', sortable: true, field: 'create_date' },
    { header: 'Create By', sortable: true, field: 'create_by', hide: true },
    { header: 'Modify Date', sortable: true, field: 'modify_date' },
    { header: 'Modify By', sortable: true, field: 'modify_by', hide: true },
    { header: 'Notes', sortable: true, field: 'notes' }
  ];
  subScriptions = new SubscriptionsContainer();


  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.sr_line_items = [];
    this.total_sr_line_items = 0;
    // this.current_whorder_id = 0;
    // this.current_warehouse_id = 0;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });

    this.subScriptions.add=this.AC.whOrderObserver().pipe(
      distinctUntilChanged()
    ).subscribe((order_id) => {
      this.current_whorder_id = order_id;
      this.loadWHOrdersSupplierReturn(this.current_whorder_id, `childOnInit whOrderObserver`);
    });

    this.subScriptions.add=this.AC.updatedWhOrderObserver().pipe(
      distinctUntilChanged()
    ).subscribe((wh_det: any) => {
      this.current_whorder_id = wh_det.wh_order_id;
    });

    this.subScriptions.add=this.AC.deletedWhOrderObserver().pipe(
      distinctUntilChanged()
    ).subscribe((_id) => {
      this.loadWHOrdersSupplierReturn(this.current_whorder_id);
    });
  }
  ngOnDestroy() {
    this.subScriptions.dispose();
  }

  loadWHOrdersSupplierReturn(current_order_id = this.current_whorder_id, calledFrom?: any) {
    this.isLoading = true;
    const params = {
      action: Number(current_order_id) === 0 ? 'getAll' : 'getByWHOrderId',
      module: 'wh_supplierreturn',
      wh_order_id: !current_order_id ? 0 : current_order_id
    };
    if (Number(current_order_id) === 0) { return; }

    this.AC.get(params).subscribe((answer: any) => {
      this.sr_line_items = answer.wh_supplierreturn;
      this.dataSource.data = this.sr_line_items;
      this.supplierReturnTable.dataSource = this.dataSource;
      this.total_sr_line_items = this.dataSource.data.length;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.supplierReturnTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.loadWHOrdersSupplierReturn(this.current_whorder_id);
    this.filter = '';
    this.dataSource.data = this.sr_line_items;
    this.total_sr_line_items = this.dataSource.data.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.supplierReturnTable.dataSource.paginator) {
      this.supplierReturnTable.dataSource?.paginator?.firstPage();
    }
    this.supplierReturnTable.dataSource.filter = '';
    this.supplierReturnTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.changeRef.detectChanges();
  }
  // Add Edit Delete Dialog Window
  openDialog(action?: any, obj?: any) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = true;
    matDialogConfig.autoFocus = true;
    obj.action = action;
    matDialogConfig.data = obj;
    let dialogRef: any;
    if (action.toLowerCase() === 'add' || action.toLowerCase() === 'edit') {
      dialogRef = this.dialog.open(AddEditSupplierReturnComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadWHOrdersSupplierReturn();
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSupplierReturnComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadWHOrdersSupplierReturn();
      });
    }
  }

  closeMenu() {
    this.supplierReturnTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // console.log(e);
  }
}

