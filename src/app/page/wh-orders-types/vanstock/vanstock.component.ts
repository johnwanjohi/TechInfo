
import {Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import {DeleteVanStockComponent} from './delete-vanstock/delete-vanstock.component';
import {AddEditVanStockComponent} from './add-edit-vanstock/add-edit-vanstock.component';
import {MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter} from '@ng-matero/extensions/grid';
import {SubscriptionsContainer} from '../../../shared/containers/subscriptions-container';

export interface UserData {
  id: string;
  name: string;
  address: string;
}

@Component({
  selector: 'app-vanstock',
  templateUrl: './vanstock.component.html',
  styleUrls: ['./vanstock.component.scss']
})

export class VanStockComponent implements OnInit, OnDestroy {
  isLoading = true;
  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  wh_vanstock: any[];
  dataSource: MatTableDataSource<UserData>;
  // displayedColumns: string[] = ['edit', 'delete', 'id',
  //   'warehouse', 'status',
  //   'productname', 'issue_qty',
  //   'create_date', 'create_by', 'notes'];
  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Status', sortable: true, field: 'status' },
    { header: 'Warehouse', sortable: true, field: 'warehouse', hide: true },
    { header: 'Part Number', sortable: true, field: 'partnumber' },
    { header: 'Issue Qty', sortable: true, field: 'issue_qty' },
    { header: 'Issue Date', sortable: true, field: 'create_date' },
    { header: 'Notes', sortable: true, field: 'notes' }
  ];
  user: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_item_id) };

  @ViewChild('vanstockTable') vanstockTable!: MtxGridComponent;


  current_category_id: number;
  filter: string;
  current_warehouse_id: number;
  current_order_id: any;
  current_wh_order_id: any;
  current_item_id: any;
  total_vanstock_line_items: number;

  private subScriptions = new SubscriptionsContainer();

  constructor(
    private router: Router,
    private AC: AccountsService,
    public dialog: MatDialog,
    private changeRef: ChangeDetectorRef
  ) {
    this.wh_vanstock = [];
    this.dataSource = new MatTableDataSource();
    this.filter = '';
  }
  ngOnInit(): void {
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
    })

    this.subScriptions.add = this.AC.whOrderObserver().subscribe((order_id) => {
      this.current_order_id = order_id;
      this.current_wh_order_id = order_id;
      this.loadVanStock(this.current_order_id, `childOnInit whOrderObserver`);
    })
    this.subScriptions.add = this.AC.updatedWhOrderObserver().subscribe((wh_det: any) => {
      this.current_order_id = wh_det.w_order_id;

    });
  }

  loadVanStock(current_order_id = this.current_order_id, calledFrom? : any) {
    this.isLoading=true;

    const params = {
      action: Number(current_order_id) === 0 ? 'getAll' : 'getByWHOrderId',
      module: 'wh_vanstock',
      wh_order_id: !current_order_id ? 0 : current_order_id
    };
    // console.dir(params);
    // if (current_order_id === 0) { return; }

    this.AC.get(params).subscribe((answer: any) => {
      this.wh_vanstock = answer.wh_vanstock;
      this.dataSource.data = this.wh_vanstock;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.changeRef.detectChanges();
      this.vanstockTable = answer.wh_vanstock;
      this.isLoading = false;
    });
  }
  resetxx() {
    this.filter = '';
    this.dataSource.data = this.wh_vanstock;
    this.dataSource?.paginator?.firstPage();
    this.dataSource.sort = this.sort;
    this.dataSource.filter = '';
    this.dataSource?.sort?.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });

  }
  reset() {
    this.filter = '';
    this.current_item_id=0;
    this.current_order_id = 0;
    this.current_warehouse_id = 0;
    this.dataSource.data = this.wh_vanstock;
    // this.loadVanStock(this.current_order_id );
    // return;

    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    this.vanstockTable.dataSource = this.dataSource;
    if (this.vanstockTable.dataSource.paginator) {
      this.vanstockTable.dataSource?.paginator?.firstPage();
    }
    this.vanstockTable.dataSource.filter = '';
    this.vanstockTable.dataSource?.sort?.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.changeRef.detectChanges();
  }

  setWhOrder(order_id) {
    this.AC.setWhOrder(order_id);
    // this.current_warehouse_id = order_id;
  }
  applyFilterxx(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.vanstockTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  openDialog(action?: any, obj?: any) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = true;
    matDialogConfig.autoFocus = true;
    obj.action = action;
    obj.warehouse_id = this.current_warehouse_id;
    matDialogConfig.data = obj;
    let dialogRef: any;
    // alert(action);
    if (action.toLowerCase() === 'add' || action.toLowerCase() === 'edit') {
      dialogRef = this.dialog.open(AddEditVanStockComponent, matDialogConfig);
      // dialogRef.componentInstance.onAdd.subscribe(() => {
      //   this.loadVanStock(this.current_wh_order_id, `additems function`);
      // });
      dialogRef.afterClosed().subscribe((result) => {
        this.loadVanStock(this.current_wh_order_id, `add/edit items function`);
        dialogRef.componentInstance.onAdd.unsubscribe();
      });
    }
    if (action.toLowerCase() === 'delete') {
        dialogRef = this.dialog.open(DeleteVanStockComponent, matDialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
          this.loadVanStock(this.current_wh_order_id, `additems function`);
        });
    }
  }
  setCurrentItemID(id) {
    this.current_item_id = id;
  }
  ngOnDestroy(){
    this.subScriptions.dispose();
    console.log(`ondestroy vanstock`)
  }
}

