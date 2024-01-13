import { MatSort } from '@angular/material/sort';
import { StocksData } from 'app/shared/models/index';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { MtxGridComponent, MtxGridColumn, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-wh-stock',
  templateUrl: './wh-stock.component.html',
  styleUrls: ['./wh-stock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WhStockComponent implements OnInit {

  user: any = '';
  filter: string;
  isLoading = true;
  total_stock_items = 0;
  stock_status: any[];
  current_item_id = 0;
  current_whorder_id: any;
  current_warehouse_id: number;

  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<StocksData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_whorder_id) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('stockTable') stockTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'ID', sortable: true, field: 'product_id', hide: true },
    { header: 'Warehouse', sortable: true, field: 'warehouse', hide: true },
    { header: 'Brand', sortable: true, field: 'brand' },
    { header: 'Category', sortable: true, field: 'category' },
    { header: 'Type', sortable: true, field: 'type' },
    { header: 'Part Number', sortable: true, field: 'partnumber' },
    { header: 'Ordered', sortable: true, field: 'ordered_qty' },
    { header: 'Received', sortable: true, field: 'received_qty' },
    { header: 'Returned', sortable: true, field: 'return_qty' },
    { header: 'Transfered', sortable: true, field: 'transfer_qty' },
    { header: 'Trans. Received', sortable: true, field: 'received_from_transfer_qty' },
    { header: 'Adjusted', sortable: true, field: 'adjusted_qty' },
    { header: 'Van Out', sortable: true, field: 'van_stock_qty' },
    { header: 'Van In', sortable: true, field: 'van_return_qty' },
    { header: 'Available', sortable: true, field: 'available' }
  ];

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.stock_status = [];
    this.total_stock_items = 0;
    this.current_whorder_id = 0;
    this.current_warehouse_id = 0;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    })

    this.AC.warehouseObserver().subscribe(
      (warehouse_id) => {
        // if ( Number(warehouse_id) !== Number(this.current_warehouse_id)) {
          this.current_warehouse_id = Number(warehouse_id) ;
          this.loadWHStock(this.current_warehouse_id);
        // }
      }
    );

    this.AC.whOrderObserver().pipe(
      distinctUntilChanged()
    ).subscribe((order_id) => {
      this.current_whorder_id = order_id;
    })

    this.AC.deletedWhOrderObserver().pipe(
      distinctUntilChanged()
    ).subscribe((data) => {
      if (data) {
        this.loadWHStock();
      }
    });

    this.AC.updatedWhOrderObserver().pipe(
      distinctUntilChanged()
    ).subscribe((wh_det: any) => {
      this.current_whorder_id = wh_det.w_order_id;
    });
    this.isLoading = false;
    this.changeRef.detectChanges();
  }

  loadWHStock(current_warehouse_id = this.current_warehouse_id) {
    this.isLoading = true;
    const params = {
      // action: Number(current_warehouse_id) === 0 ? 'getAll' : 'getStockByWarehouseId',
      action: 'getStockByWarehouseId',
      module: 'stock_status',
      warehouse_id: !this.current_warehouse_id ? 0 : this.current_warehouse_id
    };
    if (this.current_warehouse_id === 0) {
      this.stock_status = [];
      this.dataSource.data = this.stock_status;
      this.changeRef.detectChanges();
      this.isLoading = false;
      return;
    }
    this.AC.get(params).subscribe((answer: any) => {
      this.stock_status = answer.stock_status;
      this.dataSource.data = this.stock_status;
      this.total_stock_items = this.dataSource.data.length;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.stockTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.stockTable.paginator) {
      this.stockTable.paginator.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.loadWHStock();
    this.filter = '';
    this.dataSource.data = this.stock_status;
    this.total_stock_items = this.dataSource.data.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.stockTable.dataSource.paginator) {
      this.stockTable.dataSource?.paginator?.firstPage();
    }
    this.stockTable.dataSource.filter = '';
    this.stockTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.changeRef.detectChanges();
  }

  closeMenu() {
    this.stockTable.columnMenu.menuTrigger.closeMenu();
  }

  log(e: any) {
    // console.log(e);
  }
}
