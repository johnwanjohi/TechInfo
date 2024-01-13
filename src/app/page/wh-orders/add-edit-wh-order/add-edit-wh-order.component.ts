import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { WhOrdersComponent } from '../wh-orders.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order_statuses, Order_types, WarehousesData } from 'app/shared/models';
import { Component, AfterViewInit, Inject, OnInit, Optional, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-edit-wh-order',
  templateUrl: './add-edit-wh-order.component.html',
  styleUrls: ['./add-edit-wh-order.component.scss']
})

export class AddEditWhOrderComponent implements OnInit, AfterViewInit {

  id: any;
  action: any;
  myForm: FormGroup;
  currentUserName: string;
  current_wh_order_id: any;
  current_warehouse_id: any;
  seleted_status: number;
  selected_ordertype: any;
  selected_warehouse: number;
  ordertypes: Order_types[] = [];
  listOfOrderStatus: Order_statuses[] = [];
  listOfWarehouses: WarehousesData[] = [];
  listOfOrderTypes: Order_types[] = [];
  ordertypes$: Observable<any>;
  warehouses$: Observable<any>;

  constructor(
    private AC: AccountsService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<WhOrdersComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.action = data.action;
    this.AC.loggedInUser.subscribe((userDetails) => {
      this.currentUserName = userDetails.username;
    });
    this.myForm = new FormGroup({
      warehouse_id: new FormControl(0, Validators.required),
      order_type_id: new FormControl(0, Validators.required),
      order_status_id: new FormControl(0),
      modify_by: new FormControl(this.currentUserName),
      create_by: new FormControl(this.currentUserName),
      modify_date: new FormControl(''),
      notes: new FormControl(''),
      id: new FormControl(0),
    });
  }

  ngOnInit(): void {
    this.id = this.data.id;
    this.AC.warehouseObserver().subscribe((warehouse_id) => {
      this.current_warehouse_id = warehouse_id;
      this.selected_warehouse = Number(warehouse_id);
      this.myForm.patchValue({
        warehouse_id: Number(this.current_warehouse_id)
      });
    })
    if (this.action === 'edit') {
      this.loadWHOrderByID();
    }
    this.getWarehouses();
    this.getOrderTypes();
    this.getOrderStatus();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  async loadWHOrderByID() {
    this.id = this.data.id;
    const params = {
      //action: 'getById',
      //module: 'wh_orders',
      id: this.id,
    };
    const endpoint= 'wh_orders/getById' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        warehouse_id: Number(answer.wh_order.warehouse_id),
        order_type_id: Number(answer.wh_order.order_type_id),
        order_status_id: Number(answer.wh_order.order_status_id),
        modify_date: answer.wh_order.modify_date,
        notes: answer.wh_order.notes,
        id: Number(answer.wh_order.id),
      });
      this.changeDetectorRef.detectChanges();
      this.selected_ordertype = Number(answer.wh_order.order_type_id);
      this.selected_warehouse = Number(answer.wh_order.warehouse_id)
    });
  }

  async getWarehouses() {
    const params = {
     // action: 'getAll',
     // module: 'warehouses',
    };
    const endpoint='warehouses/getAll';
    this.warehouses$ = await this.AC.post(params,endpoint);
    this.warehouses$.subscribe((answer) => {
      this.listOfWarehouses = answer.warehouses.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
    });
  }

  async getOrderTypes() {
    const params = {
      //action: 'getAll',
      //module: 'order_types',
    };
    const endpoint= 'order_types/getAll';
    this.ordertypes$ = await this.AC.post(params,endpoint);
    this.ordertypes$.subscribe((answer: any) => {
      this.listOfOrderTypes = answer.order_types.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
    });
  }

  async getOrderStatus() {
    const params = {
      action: 'getAll',
      module: 'statuses',
    };
    this.ordertypes$ = await this.AC.get(params);
    this.ordertypes$.subscribe((answer) => {
      this.listOfOrderStatus = answer.statuses.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
    });
  }

  Submit() {
    this.myForm.removeControl('modify_date');
    if (this.action.toLowerCase() === 'add') {
    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.removeControl('create_by');
      this.myForm.patchValue({
        id: this.data.id,
      });
    }
    const params = {
     // action: this.action.toLowerCase() === 'add' ? 'wh_orders/put' : 'wh_orders/post';
      //module: 'wh_orders',
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'wh_orders/put' : 'wh_orders/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewWhOrder(answer.wh_order) :
        this.AC.setUpdateWhOrder(answer.wh_order);
      this.myForm.patchValue({
        id: Number(answer.wh_order.id),
      });
      this.AC.whorder_id.next(answer.wh_order.id);
      this.closeDialog();
    });
  }

  Cancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
