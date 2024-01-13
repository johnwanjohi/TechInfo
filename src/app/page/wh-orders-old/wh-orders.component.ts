
import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { WarehouseOrdersData } from 'app/shared/models/index';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteWhOrderComponent } from './delete-wh-order/delete-wh-order.component';
import { AddEditWhOrderComponent } from './add-edit-wh-order/add-edit-wh-order.component';
import {
  MtxGridRowClassFormatter,
  MtxGridComponent,
  MtxGridColumn,
  MtxGridCellComponent,
  MtxGridCellTemplate, MtxGridService
} from '@ng-matero/extensions/grid';
import {Component, OnInit, ViewChild, AfterContentChecked, AfterViewInit, ChangeDetectorRef, Input} from '@angular/core';

@Component({
  selector: 'app-wh-orders',
  templateUrl: './wh-orders.component.html',
  styleUrls: ['./wh-orders.component.scss'],
})

export class WhOrdersComponent implements OnInit, AfterViewInit {

  user: any = '';
  filter: string;
  status: string;
  isLoading = true;
  wh_orders: any[];
  current_wh_order: any;
  current_warehouse_id: number;

  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<WarehouseOrdersData>;

  rowClassFormatter: MtxGridRowClassFormatter = {
    // 'bg-light-danger': (data ) => data.order_status === 'Created',
    // 'bg-light-warning': (data ) => data.order_status === 'In Progress',
    // 'bg-light-success': (data ) => data.order_status === 'Complete',
    'table-active': (data) => Number(data?.id) === Number(this.current_wh_order)
  };
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('warehouseOrdersTable') warehouseOrdersTable!: MtxGridComponent;
  @Input() order_status_div: HTMLElement;
  query = {
    order: "desc",
    page: 0,
  };
  currentPage: number;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Warehouse', sortable: true, field: 'warehouse' },
    { header: 'Order Type', sortable: true, field: 'order_type' },
    { header: 'Order Status', sortable: true,
      field: 'order_status'
    },
    { header: 'Create Date', sortable: true, field: 'create_date' },
    { header: 'Create By', sortable: true, field: 'create_by', hide: true },
    { header: 'Modify Date', sortable: true, field: 'modify_date' },
    { header: 'Modify By', sortable: true, field: 'modify_by', hide: true },
    { header: 'Notes', sortable: true, field: 'trimmedNotes',
    showExpand : true }
  ];

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.currentPage = 0;
    this.filter = '';
    this.wh_orders = [];
    this.current_warehouse_id = 0;
    this.dataSource = new MatTableDataSource();

  }

  ngOnInit(): void {
    this.currentPage = 0;
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });

  }

  get parentHeight() {
    return this.order_status_div?.parentElement?.getAttribute(this.parentHeight);
  }
  setCurrentPage(e: PageEvent) {
    ////console.log(e);
    this.currentPage = e.pageIndex;
    this.query.page = e.pageIndex;

  }



  ngAfterViewInit(): void {
    //console.log(this.order_status_div);
    //console.log(this.order_status_div?.clientHeight);
    this.currentPage = 0;
    const params = {
      //action: 'getAll',
      //module: 'wh_orders',
    };
    this.isLoading = true;
    const endpoint=  'wh_orders/getAll';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.wh_orders = answer.wh_orders;
      this.dataSource.data = this.wh_orders.map((data) => {
        data.trimmedNotes = data.notes.substring(0, 10);
        return data;
      });
      this.setWhOrder(0, 0);

      this.AC.newWhOrderObserver().pipe(
        distinctUntilChanged()
      ).subscribe((wh_order) => {
        this.wh_orders.push(wh_order);
        if (this.current_warehouse_id) {
          this.dataSource.data = this.wh_orders.filter(
           (wh_order_tofilter) => wh_order_tofilter.warehouse_id === this.current_warehouse_id
          );
        } else {
          this.dataSource.data = this.wh_orders;
        }
        this.loadWHOrders();
      });

      this.AC.updatedWhOrderObserver().subscribe((wh_order: any) => {
        // return;
        this.wh_orders.forEach((current, index) => {
          if (Number(current.id) === Number(wh_order.id)) {
            this.current_wh_order = current.id;
            // console.log(this.warehouseOrdersTable.pageIndex);
            // this.loadWHOrders();
            // this.wh_orders[index] = wh_order;
            // alert(JSON.stringify(wh_order.warehouse));
            // this.dataSource.data[index] = wh_order;
            // this.warehouseOrdersTable.data = [];
            // this.warehouseOrdersTable.data = this.dataSource.data;
            // this.warehouseOrdersTable.data[index] = wh_order;
            // alert(JSON.stringify(this.warehouseOrdersTable.data[index]));
            // this.warehouseOrdersTable.table.renderRows();
            // this.warehouseOrdersTable.detectChanges();
            this.loadWHOrders();

            this.changeRef.detectChanges();

          }
        });
      });

      this.AC.deletedWhOrderObserver().pipe(
        distinctUntilChanged()
      ).subscribe((id) => {
        const index = this.wh_orders.indexOf(
          this.wh_orders.filter((wh_order) => wh_order.id === id)
        );
        this.wh_orders.splice(index, 1);
        this.dataSource.data = this.wh_orders;
        this.warehouseOrdersTable.dataSource = this.dataSource;
        this.loadWHOrders();
      });

      this.AC.warehouseObserver().pipe(
        distinctUntilChanged()
      ).subscribe((warehouse_id) => {
        this.current_warehouse_id = warehouse_id;
        this.current_wh_order = 0;
        this.loadWHOrders();
        return;
      });
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  setWhOrder(wh_order_id, warehouse_id) {
    // if (Number(this.current_wh_order) !== Number(wh_order_id)) {
      this.current_wh_order = Number(wh_order_id);
      this.AC.setWhOrder(wh_order_id);
    //}
    // this.AC.setWhOrderWarehouse(warehouse_id);
  }

  loadWHOrders() {
    if (Number(this.current_warehouse_id) === 0) {
      // this.current_wh_order = 0;
      this.wh_orders = [];
      this.dataSource.data = this.wh_orders;
    }
    this.isLoading = true;
    const params = {
      //action: Number(this.current_warehouse_id) === 0 ? 'wh_orders/getAll' : 'wh_orders/getAllWhOrdersByWarehouseId';
     // module: 'wh_orders',
      warehouse_id: Number(this.current_warehouse_id)
    };
    const endpoint=  Number(this.current_warehouse_id) === 0 ? 'wh_orders/getAll' : 'wh_orders/getAllWhOrdersByWarehouseId';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.wh_orders = answer.wh_orders;
      this.dataSource.data = this.wh_orders;
      this.warehouseOrdersTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.query.page = this.currentPage;
      this.warehouseOrdersTable.paginator.pageIndex = Number(this.currentPage);
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.warehouseOrdersTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.filter = '';
    this.current_wh_order = 0;
    this.current_warehouse_id = 0;
    this.dataSource.data = this.wh_orders;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.warehouseOrdersTable.dataSource.paginator) {
      this.warehouseOrdersTable.dataSource?.paginator?.firstPage();
    }
    this.warehouseOrdersTable.dataSource.filter = '';
    this.warehouseOrdersTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.AC.setWarehouse(0);
    this.setWhOrder(0, 0);
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
      dialogRef = this.dialog.open(AddEditWhOrderComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteWhOrderComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    }
  }

  closeMenu() {
    this.warehouseOrdersTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // console.log(e);
  }
}
