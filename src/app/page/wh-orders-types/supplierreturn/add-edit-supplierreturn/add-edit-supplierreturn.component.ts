
import { Observable } from 'rxjs';
import { Order_types, Order_statuses, Warehouses } from 'app/shared/models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupplierReturnComponent } from '../supplierreturn.component';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormcontrolsService } from 'app/shared/services/formcontrols.service';
import {
  Component,
  Inject,
  OnInit,
  Optional,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  AfterContentChecked
} from '@angular/core';

@Component({
  selector: 'app-add-edit-supplierreturn',
  templateUrl: './add-edit-supplierreturn.component.html',
  styleUrls: ['./add-edit-supplierreturn.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class AddEditSupplierReturnComponent implements OnInit, AfterContentChecked {

  id: any;
  action: string;
  myForm: FormGroup;
  available_qty: number;
  total_ordered_qty: any = 0;
  ordertypes: Order_types[];
  listOfProducts: any[];
  listOfSuppliers: any[];
  listOfWarehouses: Warehouses[];
  listOfOrderTypes: Order_types[];
  listOfOrderStatus: Order_statuses[];
  products$: Observable<any>;
  warehouses$: Observable<any>;
  suppliers$: Observable<any>;
  ordertypes$: Observable<any>;
  orderstatuses$: Observable<any>;
  selected_supplier: any;
  selected_ordertype: any;
  selected_product_id: any;
  selectedOrderTypeName: any;
  selected_warehouse: number;
  current_whorder_id: any;
  currentUserName: string;
  current_product_id: number;
  current_warehouse_id: number;
  current_supplierreturn_id: any;
  current_supplier_order_number: any;


  constructor(
    private AC: AccountsService,
    public formService: FormcontrolsService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<SupplierReturnComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
    this.action = data.action;
    this.AC.loggedInUser.subscribe((userDetails) => {
      this.currentUserName = userDetails.username;
    });
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.AC.whSupplierReturnObserver().subscribe((whsupplierreturn_id) => {
      this.current_supplierreturn_id = whsupplierreturn_id;
    });
    this.getSuppliers();
    this.id = this.data.id;
    this.AC.whOrderObserver().subscribe((whorder_id) => {
      this.current_whorder_id = Number(whorder_id);
      this.myForm.patchValue({
        wh_order_id: Number(this.current_whorder_id)
      });
    });
    this.getWarehouseStockByWhOrderId(this.current_whorder_id);
    //console.log(this.current_whorder_id)
    if (this.action === 'edit') {
      this.loadSupplierReturnByID();

    }
  }

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();

  }


  initializeForm() {
    this.myForm = new FormGroup({
      id: new FormControl(0),
      notes: new FormControl(''),
      return_qty: new FormControl(0),
      modify_date: new FormControl(''),
      supplier_order_number: new FormControl('N/A'),
      status_id: new FormControl(0, Validators.required),
      product_id: new FormControl(0, Validators.required),
      supplier_id: new FormControl(0, Validators.required),
      wh_order_id: new FormControl(0, Validators.required),
      create_by: new FormControl(this.currentUserName, Validators.required),
      modify_by: new FormControl(this.currentUserName, Validators.required),
    });
    this.myForm.markAllAsTouched();
  }

  async loadSupplierReturnByID() {
    this.id = this.data.id || this.current_supplierreturn_id;
    const params = {
     // action: 'getById',
      //module: 'wh_supplierreturn',
      id: Number(this.data.id),
    };
    const endpoint= 'wh_supplierreturn/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          modify_by: this.currentUserName,
          notes: answer.wh_supplierreturn.notes,
          id: Number(answer.wh_supplierreturn.id),
          status_id: answer.wh_supplierreturn.status_id,
          return_qty: answer.wh_supplierreturn.return_qty,
          product_id: Number(answer.wh_supplierreturn.product_id),
          wh_order_id: Number(answer.wh_supplierreturn.wh_order_id),
          supplier_id: Number(answer.wh_supplierreturn.supplier_id),
          supplier_order_number: answer.wh_supplierreturn.supplier_order_number,
          create_by: answer.wh_supplierreturn.create_by,
          create_date: answer.wh_supplierreturn.create_date,
          modify_date: answer.wh_supplierreturn.modify_date,
        });
      this.current_warehouse_id = Number(answer.wh_supplierreturn.warehouse_id);
      this.selected_product_id = Number(answer.wh_supplierreturn.product_id);
      this.selected_supplier = Number(answer.wh_supplierreturn.supplier_id);
      this.current_product_id = this.selected_product_id;
      this.getAvailableQty(answer.wh_supplierreturn);
      this.getWarehouseStock();
      setTimeout(() => {
        this.getTotalsReceivedId();
        this.changeDetectorRef.detectChanges();
      }, 50);
    });
  }

  async getOrderStatus() {
    const params = {
      action: 'getAll',
      module: 'statuses'
    };
    this.orderstatuses$ = await this.AC.get(params);
    this.orderstatuses$.subscribe((answer) => {
      this.listOfOrderStatus = answer.statuses.map((arr) => {
        arr.id = Number(arr.id);
        this.changeDetectorRef.detectChanges();
        return arr;
      });
    });
  }

  async getWarehouseStock(warehouse_id = this.current_warehouse_id) {

    const params = {
      action: Number(warehouse_id) === 0 ? 'getAll' : 'getStockByWarehouseId',
      module: 'stock_status',
      warehouse_id: !this.current_warehouse_id ? 0 : this.current_warehouse_id
    };
    if (this.current_warehouse_id === 0) {
      return;
    }
    this.products$ = await this.AC.get(params);
    this.products$.subscribe((answer) => {
      this.listOfProducts = answer.stock_status.map((arr) => {
        arr.id = Number(arr.product_id);
        arr.partnumber = String(arr.partnumber);
        return arr;
      });
    });
  }

  async getWarehouseStockByWhOrderId(whorder_id = this.current_whorder_id) {

    const params = {
      action: Number(whorder_id) === 0 ? 'getAll' : 'getStockByWhOrderId',
      module: 'stock_status',
      whorder_id: !this.current_whorder_id ? 0 : this.current_whorder_id
    };
    if (this.current_whorder_id === 0) {
      return;
    }
    this.products$ = await this.AC.get(params);
    this.products$.subscribe((answer) => {
      this.listOfProducts = answer.stock_status.map((arr) => {
        arr.id = Number(arr.product_id);
        arr.partnumber = String(arr.partnumber);
        return arr;
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  getAvailableQty($event: any) {
    this.available_qty = Number($event?.available);
    this.current_product_id = Number($event?.product_id);
    this.current_warehouse_id = Number($event.warehouse_id);
    const params = {
      action: Number(this.current_warehouse_id) === 0 ? 'getAll' : 'getByWHIdAndProductID',
      module: 'stock_status',
      warehouse_id: !this.current_warehouse_id ? 0 : this.current_warehouse_id,
      product_id: !this.current_product_id ? 0 : this.current_product_id,
    };
    if (this.current_warehouse_id === 0) {
      return;
    }
    this.AC.get(params).subscribe((answer: any) => {
      this.available_qty = answer.stock_status.available;
      this.changeDetectorRef.detectChanges();
    });
  }

  validateReturnQty() {
    const return_qty = this.myForm.get('return_qty');
    const maxQtyReturn = this.available_qty;
    return_qty.setValidators([
      Validators.required,
      Validators.min(0.000),
      Validators.max(maxQtyReturn)
    ]);
    return_qty.updateValueAndValidity();
  }

  async getSuppliers() {
    const params = {
     // action: 'getAll',
     // module: 'suppliers',
      // id: Number(this.id),
    };

    const endpoint= 'suppliers/getAll' ;
    this.suppliers$ = await this.AC.post(params,endpoint);
    this.suppliers$.subscribe((answer) => {
      this.listOfSuppliers = answer.suppliers.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  async getWarehouses() {
    const params = {
     // action: 'getAll',
      //module: 'warehouses',
      // id: Number(this.id),
    };
    const endpoint= 'warehouses/getAll';
    this.warehouses$ = await this.AC.post(params,endpoint);
    this.warehouses$.subscribe((answer) => {
      this.listOfWarehouses = answer.warehouses.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  convertToJSON(product: any) {
    return JSON.parse(product);
  }

  Submit() {
    this.validateReturnQty();
    this.myForm.removeControl('modify_date');
    if (this.action.toLowerCase() === 'add') {

    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.removeControl('wh_order_id');
      this.myForm.removeControl('create_by');
      this.myForm.patchValue({
        id: this.data.id
      });
    };
    const params = {
      //action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'wh_supplierreturn',
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'wh_supplierreturn/put' : 'wh_supplierreturn/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {

      this.myForm.patchValue(
        {
          id: Number(answer.wh_supplierreturn.id)
        });
      this.AC.whorder_id.next(answer.wh_supplierreturn.wh_order_id);
      this.changeDetectorRef.detectChanges();
      this.closeDialog();
    });
  }

  getSelectedOrderTypeName() {
    if (this.listOfOrderTypes?.length !== 0) {
      this.selectedOrderTypeName = this.listOfOrderTypes.find(items => items.id === Number(this.selected_ordertype))?.order_type;
    }
    this.changeDetectorRef.detectChanges();
    return this.selectedOrderTypeName;
  }

  getTotalsReceivedId() {
    const params = {
     // action: 'getTotalsReceivedId',
      //module: 'wh_supplierstock',
      form: this.myForm.value,
    };
    const endpoint=  'wh_supplierstock/getTotalsReceivedId';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.total_ordered_qty = Number(answer?.wh_supplierstock[0]?.total_received_qty);
      this.myForm.patchValue(
        {
          ordered_qty: Number(answer?.wh_supplierstock[0]?.ordered_qty)
        });
    });
  }

  get TotalOrderedQty() {
    return this.total_ordered_qty || 0;
  }

  Cancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}


