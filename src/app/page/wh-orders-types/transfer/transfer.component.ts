import {Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Input} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import {AddEditTransferComponent} from './add-edit-transfer/add-edit-transfer.component';
import {DeleteTransferComponent} from './delete-transfer/delete-transfer.component';
import {AccountsService} from '../../../shared/services/accounts.service';
import {MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter} from '@ng-matero/extensions/grid';
import {whSupplierReturnData} from '../../../shared/models';
// import {WarehousesComponent} from '../../warehouses/warehouses.component';

export interface UserData {
  id: string;
  name: string;
  address: string;
}

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})

export class TransferComponent implements OnInit, AfterViewInit {
  user: any = '';
  filter: string;
  isLoading = true;
  tr_line_items: any[];
  total_tr_line_items = 0;
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
  @ViewChild('transferTable') transferTable!: MtxGridComponent;
  buttons_height: number;
  @ViewChild('edit_button') edit_button: ElementRef;
  // @ViewChild('warehousesComponent') warehousesComponent : WarehousesComponent;

  wh_transfer: any[];

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'From Warehouse', sortable: true, field: 'warehouse', hide: true },
    { header: 'Recv. Warehouse', sortable: true, field: 'newwarehouse', hide: true },
    { header: 'Status', sortable: true, field: 'status' },
    { header: 'Part Number', sortable: true, field: 'productname' },
    { header: 'Transfer Qty', sortable: true, field: 'transfer_qty' },
    { header: 'Received Qty', sortable: true, field: 'receive_qty' },
    { header: 'Transfer Date', sortable: true, field: 'transfer_date' },
    { header: 'Received Date', sortable: true, field: 'receive_date', hide: true },
    { header: 'Received By', sortable: true, field: 'receive_by' },
    { header: 'Notes', sortable: true, field: 'notes' }
  ];
  current_category_id: number;
  current_order_id: any;
  @Input('new_wh_id') new_wh_id;
  @Input('warehouseHasIncomingProducts') readonly warehouseHasIncomingProducts
  @Input('isTransfer') readonly isTransfer;
  @Input('isReceive') readonly isReceive;

  constructor(
    private router: Router,
    private AC: AccountsService,
    public dialog: MatDialog,
    private changeRef: ChangeDetectorRef
  ) {
    this.wh_transfer = [];
    this.dataSource = new MatTableDataSource();
    this.filter = '';
  }
  ngOnInit(): void {
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
    });
    this.AC.warehouseObserver().subscribe((warehouse_id) => {
      this.current_warehouse_id = warehouse_id;
      this.new_wh_id = warehouse_id;
      this.loadWHOrdersTransfer(this.current_order_id, `childOnInit whOrderObserver`);
      //console.log(`load receipt orders ${warehouse_id}`)
      this.changeRef.detectChanges();
    });
    this.AC.whOrderObserver().subscribe((order_id) => {
      this.current_order_id = order_id;
      this.current_wh_order_id = order_id;
      // alert();
      this.loadWHOrdersTransfer(this.current_order_id, `childOnInit whOrderObserver`);
    });
    this.AC.deletedWhOrderObserver().subscribe((id) => {
    });
    this.AC.updatedWhOrderObserver().subscribe((wh_det: any) => {
      this.current_order_id = wh_det.id;
    });
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      var width = this.edit_button?.nativeElement?.offsetWidth;
      var height = this.edit_button?.nativeElement?.offsetHeight;
      //console.log('Width:' + width);
      //console.log('Height: ' + height);
      // alert(`100 ms excecuted`);
    },0);

  }

  loadWHOrdersTransfer(current_order_id = this.current_order_id, calledFrom) {
    this.isLoading = true;
    let actionStr = '';
    if (this.isReceive) {
      actionStr = 'getIncomingByWHId';
    } else{
      actionStr = Number(current_order_id) === 0 ? 'getAll' : 'getByWHOrderId';
    }
      // getIncomingByWHId
    const params = {
      action: actionStr,
      module: 'wh_transfer',
      w_order_id: !current_order_id ? 0 : current_order_id,
      new_wh_id: this.new_wh_id
    };
    if (current_order_id === 0 && this.isReceive !== true) {
      // return;
    }

    this.AC.get(params).subscribe((answer: any) => {
      this.isLoading = false;
      this.wh_transfer = answer.wh_transfer;
      this.dataSource.data = this.wh_transfer;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.changeRef.detectChanges();
    });
  }
  reset() {
    this.filter = '';
    this.dataSource.data = this.wh_transfer;
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
    // this.current_warehouse_id = order_id;
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
    obj.current_warehouse_id = this.current_warehouse_id;
    matDialogConfig.data = obj;
    let dialogRef: any;
    if (action.toLowerCase() === 'add' || action.toLowerCase() === 'edit') {
      if (!this.current_warehouse_id){
        alert(`Please select current warehouse first before proceeding`);
        return;
      };
      dialogRef = this.dialog.open(AddEditTransferComponent, matDialogConfig);
      dialogRef.componentInstance.onAdd.subscribe(() => {
        this.loadWHOrdersTransfer(this.current_order_id, `additems function`);
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.loadWHOrdersTransfer(this.current_order_id, `additems function`);
        dialogRef.componentInstance.onAdd.unsubscribe();
        this.AC.updated_warehouse.next({reload:true});
      });
    }else{
        dialogRef = this.dialog.open(DeleteTransferComponent, matDialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
          this.loadWHOrdersTransfer(this.current_order_id, `additems function`);
          this.AC.updated_warehouse.next({reload:true});
        });
    }
  }
  setCurrentItemID(id) {
    this.current_item_id = id;
  }
  log($event){
    //console.log($event);
  }
}

