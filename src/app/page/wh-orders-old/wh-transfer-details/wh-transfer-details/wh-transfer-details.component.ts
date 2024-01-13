import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
// import { AccountsService } from '../../../services/accounts.service';
import { WHTransferTransferComponent } from '../wh-transfer-transfer/wh-transfer-transfer.component';
import { WHTransferDeleteComponent } from '../wh-transfer-delete/wh-transfer-delete.component';

export interface UserData {
  id: string;
  name: string;
  address: string;
}

@Component({
  selector: 'app-wh-transfer-details',
  templateUrl: './wh-transfer-details.component.html',
  styleUrls: ['./wh-transfer-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WhTransferDetailsComponent implements OnInit {
  wh_transfer_details: any[];
  dataSource: MatTableDataSource<UserData>;
  displayedColumns: string[] = ['edit', 'delete', 'id',
    'warehouse', 'newwarehouse', 'status',
    'productname', 'transfer_qty', 'receive_qty',
    'transfer_date', 'transfer_by'
    , 'receive_date', 'receive_by', 'notes'];
  user: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  current_category_id: number;
  filter: string;
  current_warehouse_id: number;
  current_order_id: any;
  current_item_id: any;

  constructor(
    private router: Router,
    private AC: AccountsService,
    public dialog: MatDialog,
    private changeRef: ChangeDetectorRef
  ) {
    this.wh_transfer_details = [];
    this.dataSource = new MatTableDataSource();
    this.filter = '';
  }
  ngOnInit(): void {
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
    })
    this.AC.branchObserver().subscribe((warehouse_id) => {
      this.current_warehouse_id = warehouse_id;

    });
    this.AC.whOrderObserver().subscribe((order_id) => {
      this.current_order_id = order_id;
      this.loadWHOrdersTransfer(this.current_order_id, `childOnInit whOrderObserver`);
    })
    this.AC.deletedWhOrderObserver().subscribe((id) => {

    });
    this.AC.updatedWhOrderObserver().subscribe((wh_det: any) => {
      this.current_order_id = wh_det.w_order_id;

    });
  }

  loadWHOrdersTransfer(current_order_id = this.current_order_id, calledFrom) {

    const params = {
      action: Number(current_order_id) === 0 ? 'getAll' : 'getByWHOrderId',
      module: 'wh_transfer',
      w_order_id: !current_order_id ? 0 : current_order_id
    };
    if (current_order_id === 0) { return; }

    this.AC.get(params).subscribe((answer: any) => {
      this.wh_transfer_details = answer.wh_transfer_details;
      this.dataSource.data = this.wh_transfer_details;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.changeRef.detectChanges();
    });
  }
  reset() {
    this.filter = '';
    this.dataSource.data = this.wh_transfer_details;
    this.dataSource?.paginator?.firstPage();
    this.dataSource.sort = this.sort;
    this.dataSource.filter = '';
    this.dataSource?.sort?.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });

  }

  setWhOrder(order_id) {
    this.AC.setWhOrder(order_id);
    this.current_warehouse_id = order_id;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  openDialog(action?: any, obj?: any) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = true;
    matDialogConfig.autoFocus = true;
    obj.action = action;
    matDialogConfig.data = obj;
    let dialogRef: any;
    switch (action) {
      case 'edit':
        dialogRef = this.dialog.open(WHTransferTransferComponent, matDialogConfig);
        dialogRef.componentInstance.onAdd.subscribe(() => {
          this.loadWHOrdersTransfer(this.current_order_id, `additems function`);
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.loadWHOrdersTransfer(this.current_order_id, `additems function`);
          dialogRef.componentInstance.onAdd.unsubscribe();
        });
        break;
      case 'delete':
        dialogRef = this.dialog.open(WHTransferDeleteComponent, matDialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
          this.loadWHOrdersTransfer(this.current_order_id, `additems function`);
        });
        break;
      default:
        return;
    }
  }
  setCurrentItemID(id) {
    this.current_item_id = id;
  }
}
