import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { whAdjustmentData } from 'app/shared/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteAdjustmentComponent } from './delete-adjustment/delete-adjustment.component';
import { AddEditAdjustmentComponent } from './add-edit-adjustment/add-edit-adjustment.component';
import { MtxGridRowClassFormatter, MtxGridColumn, MtxGridComponent } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import {SubscriptionsContainer} from '../../../shared/containers/subscriptions-container';

@Component({
  selector: 'app-adjustment',
  templateUrl: './adjustment.component.html',
  styleUrls: ['./adjustment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdjustmentComponent implements OnInit, OnDestroy {

  user: any = '';
  filter: string;
  isLoading = true;
  wh_adjustment: any[];
  total_line_items = 0;
  current_item_id: any;
  current_whorder_id: any;
  current_warehouse_id: number;

  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<whAdjustmentData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_item_id) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('adjustmentTable') adjustmentTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Warehouse', sortable: true, field: 'warehouse' },
    { header: 'Status', sortable: true, field: 'status' },
    { header: 'Part Number', sortable: true, field: 'partnumber' },
    { header: 'Old Qty', sortable: true, field: 'old_qty' },
    { header: 'New Qty', sortable: true, field: 'new_qty' },
    { header: 'Create Date', sortable: true, field: 'create_date' },
    { header: 'Create By', sortable: true, field: 'create_by', hide: true },
    { header: 'Modify Date', sortable: true, field: 'modify_date' },
    { header: 'Modify By', sortable: true, field: 'modify_by', hide: true },
    { header: 'Notes', sortable: true, field: 'notes' }
  ];
  subScriptions = new SubscriptionsContainer;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.wh_adjustment = [];
    this.total_line_items = 0;
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
      this.loadAdjustment(this.current_whorder_id, `childOnInit whOrderObserver`);
    });
    this.subScriptions.add=this.AC.updatedWhOrderObserver().pipe(
      distinctUntilChanged()
    ).subscribe((wh_det: any) => {
      this.current_whorder_id = wh_det.w_order_id;

    });
    this.subScriptions.add=this.AC.deletedWhOrderObserver().pipe(
      distinctUntilChanged()
    ).subscribe((_id) => {
      this.loadAdjustment(this.current_whorder_id);
    });
  }

  loadAdjustment(current_order_id = this.current_whorder_id, calledFrom?: any) {
    this.isLoading = true;
    const params = {
      action: Number(current_order_id) === 0 ? 'getAll' : 'getByWHOrderId',
      module: 'wh_adjustment',
      wh_order_id: !current_order_id ? 0 : current_order_id
    };
    // console.dir(params);
    if (current_order_id === 0) { return; }

    this.AC.get(params).subscribe((answer: any) => {
      this.wh_adjustment = answer.wh_adjustment;
      this.dataSource.data = this.wh_adjustment;
      this.adjustmentTable.dataSource = this.dataSource;
      this.total_line_items = this.dataSource.data.length;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.adjustmentTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.loadAdjustment(this.current_whorder_id);
    this.filter = '';
    this.dataSource.data = this.wh_adjustment;
    this.total_line_items = this.dataSource.data.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.adjustmentTable.dataSource.paginator) {
      this.adjustmentTable.dataSource?.paginator?.firstPage();
    }
    this.adjustmentTable.dataSource.filter = '';
    this.adjustmentTable.sort.sort({
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
      dialogRef = this.dialog.open(AddEditAdjustmentComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadAdjustment();
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteAdjustmentComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadAdjustment();
      });
    }
  }

  closeMenu() {
    this.adjustmentTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // console.log(e);
  }
  ngOnDestroy(){
    this.subScriptions.dispose();
  }
}
