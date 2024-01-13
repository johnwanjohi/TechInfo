import { Observable } from 'rxjs';
import { Order_types, Order_statuses, Warehouses } from 'app/shared/models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdjustmentComponent } from '../adjustment.component';
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
  AfterContentChecked, ElementRef, ViewChild
} from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-add-edit-adjustment',
  templateUrl: './add-edit-adjustment.component.html',
  styleUrls: ['./add-edit-adjustment.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AddEditAdjustmentComponent implements OnInit {

  id: any;
  action: string;
  myForm: FormGroup;
  current_qty: number;
  total_ordered_qty: any = 0;
  ordertypes: Order_types[];
  listOfProducts: any[];
  // listOfSuppliers: any[];
  listOfWarehouses: Warehouses[];
  listOfOrderTypes: Order_types[];
  listOfOrderStatus: Order_statuses[];
  products$: Observable<any>;
  warehouses$: Observable<any>;
  // suppliers$: Observable<any>;
  ordertypes$: Observable<any>;
  orderstatuses$: Observable<any>;
  // selected_supplier: any;
  selected_ordertype: any;
  selected_product_id: any;
  selectedOrderTypeName: any;
  selected_warehouse: number;
  current_whorder_id: any;
  currentUserName: string;
  current_product_id: number;
  current_warehouse_id: number;
  current_adjustment_id: any;
  current_adjustment_order_number: any;
  @ViewChild('product_dropdownlist') private product_dropdownlist: NgSelectComponent;


  constructor(
    private AC: AccountsService,
    public formService: FormcontrolsService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AdjustmentComponent>,

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
    this.AC.whAdjustmentObserver().subscribe((whadjustment_id) => {
      this.current_adjustment_id = whadjustment_id;
    });
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
      this.loadAdjustmentByID();

    }
  }

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();

  }

  initializeForm() {
    this.myForm = new FormGroup({
      id: new FormControl(0),
      notes: new FormControl(''),
      modify_date: new FormControl(''),
      old_qty: new FormControl(0, Validators.required),
      new_qty: new FormControl(0, Validators.required),
      status_id: new FormControl(0, Validators.required),
      product_id: new FormControl(0, Validators.required),
      wh_order_id: new FormControl(0, Validators.required),
      create_by: new FormControl(this.currentUserName, Validators.required),
      modify_by: new FormControl(this.currentUserName, Validators.required),
    });
    this.myForm.markAllAsTouched();
  }

  async loadAdjustmentByID() {
    this.id = this.data.id || this.current_adjustment_id;
    const params = {
     // action: 'getById',
     // module: 'wh_adjustment',
      id: Number(this.data.id),
    };
    const endpoint=  'wh_adjustment/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          modify_by: this.currentUserName,
          notes: answer.wh_adjustment.notes,
          id: Number(answer.wh_adjustment.id),
          status_id: answer.wh_adjustment.status_id,
          old_qty: Number(answer.wh_adjustment.old_qty),
          new_qty: Number(answer.wh_adjustment.new_qty),
          product_id: Number(answer.wh_adjustment.product_id),
          wh_order_id: Number(answer.wh_adjustment.wh_order_id),
          create_by: answer.wh_adjustment.create_by,
          create_date: answer.wh_adjustment.create_date,
          modify_date: answer.wh_adjustment.modify_date,
        });
      this.current_warehouse_id = Number(answer.wh_adjustment.warehouse_id);
      this.selected_product_id = Number(answer.wh_adjustment.product_id);
      this.current_product_id = this.selected_product_id;
      this.getWarehouseStock();

      //console.log( this.product_dropdownlist);
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

  getCurrentQty($event: any) {
    this.current_qty = Number($event?.available);
    this.current_product_id = Number($event?.product_id);
    this.current_warehouse_id = Number($event.warehouse_id);
    const params = {
      action: Number(this.current_warehouse_id) === 0 ? 'getAll' : 'getByWHIdAndProductID',
      module: 'stock_status',
      warehouse_id: !this.current_warehouse_id ? 0 : this.current_warehouse_id,
      product_id: !this.current_product_id ? 0 : this.current_product_id,
    };
    //console.log(params);
    if (this.current_warehouse_id === 0) {
      return;
    }
    this.AC.get(params).subscribe((answer: any) => {
      this.current_qty = answer.stock_status.available;
      this.changeDetectorRef.detectChanges();
    });
  }

  async getWarehouses() {
    const params = {
     // action: 'getAll',
      //module: 'warehouses',
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
    this.myForm.removeControl('modify_date');
    if (this.action.toLowerCase() === 'add') {
      this.myForm.removeControl('id');
      this.myForm.patchValue({
        create_by: this.currentUserName,
        old_qty: this.current_qty
      });
    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.removeControl('wh_order_id');
      this.myForm.removeControl('create_by');
      this.myForm.patchValue({
        id: this.data.id,
        old_qty: this.current_qty
      });
    };
    const params = {
      //action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'wh_adjustment',
      form: this.myForm.value,
    };
    const endpoint=  this.action.toLowerCase() === 'add' ? 'wh_adjustment/put' : 'wh_adjustment/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      //console.log(JSON.stringify(answer.wh_adjustment));
      this.action.toLowerCase() === 'add' ? this.AC.setNewWhAdjustment(answer.wh_adjustment) :
        this.AC.setUpdateWhAdjustment(answer.wh_adjustment);
      this.myForm.patchValue(
        {
          id: Number(answer.wh_adjustment.id)
        });
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

  Cancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}


