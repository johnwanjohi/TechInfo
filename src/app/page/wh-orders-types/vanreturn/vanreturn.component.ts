import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {whSupplierReturnData} from '../../../shared/models';
import {MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter} from '@ng-matero/extensions/grid';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AccountsService} from '../../../shared/services/accounts.service';
import {MatTableService} from '../../../shared/services/mat-table.service';
import {distinctUntilChanged} from 'rxjs/operators';
import {AddEditVanReturnComponent} from './add-edit-vanreturn/add-edit-vanreturn.component';
import {DeleteVanReturnComponent} from './delete-vanreturn/delete-vanreturn.component';
import {SubscriptionsContainer} from '../../../shared/containers/subscriptions-container';

@Component({
  selector: 'app-vanreturn',
  templateUrl: './vanreturn.component.html',
  styleUrls: ['./vanreturn.component.scss']
})


export class VanReturnComponent implements OnInit,OnDestroy {

  user: any = '';
  filter: string;
  isLoading = true;
  sr_line_items: any[];
  total_vr_line_items = 0;
  current_item_id: any;
  current_whorder_id: any;
  current_wh_order_id: any;
  current_warehouse_id: number;

  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<whSupplierReturnData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_item_id) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('vanReturnTable') vanReturnTable!: MtxGridComponent;


  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Warehouse', sortable: true, field: 'warehouse', hide: true },
    { header: 'Status', sortable: true, field: 'status' },
    { header: 'Part Number', sortable: true, field: 'partnumber' },
    { header: 'Returned Qty', sortable: true, field: 'return_qty' },
    { header: 'Return Date', sortable: true, field: 'return_date' },
    { header: 'Return By', sortable: true, field: 'return_by', hide: true },
    { header: 'Notes', sortable: true, field: 'notes' }
  ];
  private subScriptions = new SubscriptionsContainer();


  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.sr_line_items = [];
    this.total_vr_line_items = 0;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });

    this.subScriptions.add = this.AC.whOrderObserver().subscribe((order_id) => {
      this.current_whorder_id = order_id;
      this.current_wh_order_id = order_id;
      this.loadWHOrdersVanReturn(this.current_whorder_id, `childOnInit whOrderObserver`);
    });
    this.subScriptions.add =this.AC.deletedWhOrderObserver().subscribe((_id) => {
      this.loadWHOrdersVanReturn(this.current_whorder_id);
    });
  }

  loadWHOrdersVanReturn(current_order_id = this.current_whorder_id, calledFrom?: any) {
    this.isLoading = true;
    const params = {
      action: Number(current_order_id) === 0 ? 'getAll' : 'getByWHOrderId',
      module: 'wh_vanreturn',
      wh_order_id: !current_order_id ? 0 : current_order_id
    };
    console.log(params);
    if (Number(current_order_id) === 0) {
      this.isLoading = false;
      return;
    }

    this.AC.get(params).subscribe((answer: any) => {
      console.log(answer.wh_vanreturn);
      this.sr_line_items = answer.wh_vanreturn;
      this.dataSource.data = this.sr_line_items;
      this.vanReturnTable.dataSource = this.dataSource;
      this.total_vr_line_items = this.dataSource.data.length;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.vanReturnTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.loadWHOrdersVanReturn(this.current_whorder_id);
    this.filter = '';
    this.dataSource.data = this.sr_line_items;
    this.total_vr_line_items = this.dataSource.data.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.vanReturnTable.dataSource.paginator) {
      this.vanReturnTable.dataSource?.paginator?.firstPage();
    }
    this.vanReturnTable.dataSource.filter = '';
    this.vanReturnTable.sort.sort({
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
      dialogRef = this.dialog.open(AddEditVanReturnComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe((event: any) => {
        console.log(event);
        if (event.event === 'Refresh' ){
          this.loadWHOrdersVanReturn(obj.wh_order_id);
        }
      });
    }
    if (action.toLowerCase() === 'delete') {
      dialogRef = this.dialog.open(DeleteVanReturnComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadWHOrdersVanReturn(obj.wh_order_id);
      });
    }
  }

  closeMenu() {
    this.vanReturnTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // console.log(e);
  }
  ngOnDestroy(){
    this.subScriptions.dispose();
    console.log(`ondestroy`)
  }
}


