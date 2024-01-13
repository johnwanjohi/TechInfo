import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { whSupplierStockData } from 'app/shared/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteSupplierStockComponent } from './delete-supplierstock/delete-supplierstock.component';
import { AddEditSupplierStockComponent } from './add-edit-supplierstock/add-edit-supplierstock.component';
import { MtxGridRowClassFormatter, MtxGridColumn, MtxGridComponent } from '@ng-matero/extensions/grid';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {SubscriptionsContainer} from '../../../shared/containers/subscriptions-container';

@Component({
  selector: 'app-supplierstock',
  templateUrl: './supplierstock.component.html',
  styleUrls: ['./supplierstock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SupplierStockComponent implements OnInit, AfterViewInit, OnDestroy {

  user: any = '';
  filter: string;
  isLoading = true;
  ss_line_items: any[];
  total_ss_line_items = 0;
  current_item_id: any;
  current_wh_order_id: number;
  current_warehouse_id: number;

  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<whSupplierStockData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_item_id) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('supplierStockTable') supplierStockTable!: MtxGridComponent;
  @ViewChild('deleteButton') deleteButton : ElementRef;
  buttonHeight: number;
  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    // { header: 'Warehouse', sortable: true, field: 'warehouse' },
    { header: 'Status', sortable: true, field: 'status' },
    { header: 'Part Number', sortable: true, field: 'partnumber' },
    { header: 'Ordered Qty', sortable: true, field: 'ordered_qty' },
    { header: 'Received Qty', sortable: true, field: 'received_qty' },
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
    this.ss_line_items = [];
    this.total_ss_line_items = 0;
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
  ngAfterViewInit() {
    this.buttonHeight = this.deleteButton?.nativeElement?.offsetHeight;
    this.subScriptions.add = this.AC.whOrderObserver().subscribe((order_id) => {
      this.current_wh_order_id = Number(order_id);
      this.loadWhOrdersSupplierStock(this.current_wh_order_id, `childOnInit whOrderObserver`);
    })
    this.subScriptions.add = this.AC.whorder_id.subscribe((order_id)=>{
      this.current_wh_order_id = Number( order_id);
      this.loadWhOrdersSupplierStock(this.current_wh_order_id, `childOnInit whOrderObserver`);
    })
    this.subScriptions.add = this.AC.deletedWhOrderObserver().subscribe((_id) => {
      this.loadWhOrdersSupplierStock(this.current_wh_order_id);
    });
  }
  loadWhOrdersSupplierStock(current_order_id = this.current_wh_order_id, calledFrom?: any) {
    this.isLoading = true;
    const params = {
      action: Number(current_order_id) === 0 ? 'getAll' : 'getByWHOrderId',
      module: 'wh_supplierstock',
      wh_order_id: !current_order_id ? 0 : current_order_id
    };
    console.log(`loadWhOrdersSupplierStock`);
    if (current_order_id === 0) {
      // alert()
      this.ss_line_items = [];
      this.dataSource.data = this.ss_line_items;
      this.supplierStockTable.dataSource = this.dataSource;

      this.total_ss_line_items = this.dataSource.data.length;
      this.isLoading = false;
      this.changeRef.detectChanges();
      return;
    }

    this.AC.get(params).subscribe((answer: any) => {
      this.ss_line_items = answer.wh_supplierstock;

      this.dataSource.data = this.ss_line_items;
      this.supplierStockTable.dataSource = this.dataSource;

      this.total_ss_line_items = this.dataSource.data.length;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.supplierStockTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function (Customer Reset doesn't work)
  reset() {
    this.loadWhOrdersSupplierStock(this.current_wh_order_id);
    this.filter = '';
    this.dataSource.data = this.ss_line_items;
    this.total_ss_line_items = this.dataSource.data.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.supplierStockTable.dataSource.paginator) {
      this.supplierStockTable.dataSource?.paginator?.firstPage();
    }
    this.supplierStockTable.dataSource.filter = '';
    this.supplierStockTable.sort.sort({
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
      dialogRef = this.dialog.open(AddEditSupplierStockComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadWhOrdersSupplierStock();
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSupplierStockComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadWhOrdersSupplierStock();
      });
    }
  }

  closeMenu() {
    this.supplierStockTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // console.log(e);
  }
  ngOnDestroy() {
    this.subScriptions.dispose();
  }
}
