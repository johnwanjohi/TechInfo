
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import {DeleteVanStockComponent} from './delete-vanstock/delete-vanstock.component';
import {AddEditVanStockComponent} from './add-edit-vanstock/add-edit-vanstock.component';

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

export class VanStockComponent implements OnInit {
  wh_vanstock: any[];
  dataSource: MatTableDataSource<UserData>;
  displayedColumns: string[] = ['edit', 'delete', 'id',
    'warehouse', 'status',
    'productname', 'issue_qty',
    'create_date', 'create_by', 'notes'];
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
    this.wh_vanstock = [];
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
      this.loadVanStock(this.current_order_id, `childOnInit whOrderObserver`);
    })
    this.AC.deletedWhOrderObserver().subscribe((id) => {

    });
    this.AC.updatedWhOrderObserver().subscribe((wh_det: any) => {
      this.current_order_id = wh_det.w_order_id;

    });
  }

  loadVanStock(current_order_id = this.current_order_id, calledFrom) {

    const params = {
      action: Number(current_order_id) === 0 ? 'getAll' : 'getByWHOrderId',
      module: 'wh_vanstock',
      wh_order_id: !current_order_id ? 0 : current_order_id
    };
    console.dir(params);
    if (current_order_id === 0) { return; }

    this.AC.get(params).subscribe((answer: any) => {
      this.wh_vanstock = answer.wh_vanstock;
      this.dataSource.data = this.wh_vanstock;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.changeRef.detectChanges();
    });
  }
  reset() {
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
        dialogRef = this.dialog.open(AddEditVanStockComponent, matDialogConfig);
        dialogRef.componentInstance.onAdd.subscribe(() => {
          this.loadVanStock(this.current_order_id, `additems function`);
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.loadVanStock(this.current_order_id, `additems function`);
          dialogRef.componentInstance.onAdd.unsubscribe();
        });
        break;
      case 'delete':
        dialogRef = this.dialog.open(DeleteVanStockComponent, matDialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
          this.loadVanStock(this.current_order_id, `additems function`);
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

