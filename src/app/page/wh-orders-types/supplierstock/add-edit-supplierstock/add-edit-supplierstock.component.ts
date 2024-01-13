import { Observable } from 'rxjs';
import { Order_statuses } from 'app/shared/models/index';
import { SupplierStockComponent } from '../supplierstock.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormcontrolsService } from 'app/shared/services/formcontrols.service';
import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';


@Component({
  selector: 'app-add-edit-supplierstock',
  templateUrl: './add-edit-supplierstock.component.html',
  styleUrls: ['./add-edit-supplierstock.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class AddEditSupplierStockComponent implements OnInit, AfterViewChecked {

  id: any;
  action: string;
  myForm: FormGroup;
  listOfProducts: any[];
  listOfSuppliers: any[];
  listOfOrderStatus: Order_statuses[];
  products$: Observable<any>;
  suppliers$: Observable<any>;
  orderstatuses$: Observable<any>;
  selected_supplier: any;
  selected_ordertype: any;
  selected_product_id: any;
  selectedOrderTypeName: any;
  selected_whorder: number;
  currentUserName: string;
  current_whorder_id: any;
  current_supplierstock_id: any;
  total_ordered_qty: any = 0;

  constructor(
    private AC: AccountsService,
    public formService: FormcontrolsService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<SupplierStockComponent>,
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
    this.AC.whSupplierStockObserver().subscribe((whsupplierstock_id) => {
      this.current_supplierstock_id = whsupplierstock_id;
    });
    this.getProducts();
    this.getSuppliers();
    this.id = this.data.id;
    this.AC.whOrderObserver().subscribe((whorder_id) => {
      this.current_whorder_id = Number(whorder_id);
      this.myForm.patchValue({
        wh_order_id: Number(this.current_whorder_id)
      });
    });
    if (this.action === 'edit') {
      this.loadSupplierStockByID();
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  initializeForm() {
    this.myForm = new FormGroup({
      id: new FormControl(0),
      notes: new FormControl(''),
      ordered_qty: new FormControl(0),
      received_qty: new FormControl(0),
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

  async loadSupplierStockByID() {
    this.id = this.data.id || this.current_supplierstock_id;
    const params = {
     // action: 'getById',
      //module: 'wh_supplierstock',
      id: Number(this.data.id),
    };
    const endpoint=  'wh_supplierstock/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          modify_by: this.currentUserName,
          notes: answer.wh_supplierstock.notes,
          id: Number(answer.wh_supplierstock.id),
          status_id: answer.wh_supplierstock.status_id,
          ordered_qty: answer.wh_supplierstock.ordered_qty,
          received_qty: answer.wh_supplierstock.received_qty,
          product_id: Number(answer.wh_supplierstock.product_id),
          wh_order_id: Number(answer.wh_supplierstock.wh_order_id),
          supplier_id: Number(answer.wh_supplierstock.supplier_id),
          supplier_order_number: answer.wh_supplierstock.supplier_order_number,
          create_by: answer.wh_supplierstock.create_by,
          create_date: answer.wh_supplierstock.create_date,
          modify_date: answer.wh_supplierstock.modify_date,
        });
      this.changeDetectorRef.detectChanges();
      this.selected_supplier = Number(answer.wh_supplierstock.supplier_id);
      this.selected_product_id = Number(answer.wh_supplierstock.product_id);
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

  async getProducts() {
    const params = {
      //action: 'getAll',
      //module: 'products'
    };
    const endpoint=  'products/getAll';
    this.products$ = await this.AC.post(params,endpoint);
    this.products$.subscribe((answer) => {
      this.listOfProducts = answer?.products?.map((arr) => {
        arr.id = Number(arr.id);
        arr.partnumber = String(arr.partnumber);
        return arr;
      });
    });
  }

  async getSuppliers() {
    const params = {
      //action: 'getAll',
      //module: 'suppliers'
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

  convertToJSON(product: any) {
    return JSON.parse(product);
  }

  validateReceivedQty() {
    const received_qty = this.myForm.get('received_qty');
    const maxQtyRecently = this.myForm.get('ordered_qty').value;
    received_qty.setValidators([
      Validators.required,
      Validators.min(0.000),
      Validators.max(maxQtyRecently),
    ]);
    received_qty.updateValueAndValidity();
  }

  Submit() {
    this.validateReceivedQty();
    this.myForm.removeControl('modify_date');
    if (this.action.toLowerCase() === 'add') {

    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.removeControl('wh_order_id');
      this.myForm.removeControl('create_by');
      this.myForm.patchValue({
        id: this.data.id
      });
    }
    const params = {
      //action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'wh_supplierstock',
      form: this.myForm.value,
    };
    const endpoint=  this.action.toLowerCase() === 'add' ? 'wh_supplierstock/put' : 'wh_supplierstock/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.AC.setUpdateWhSupplierStock(answer.wh_supplierstock);
      this.myForm.patchValue(
        {
          id: Number(answer.wh_supplierstock.id)
        });
    });
    setTimeout(() => {
      const params= {
        //action: 'getById',
       // module: 'wh_orders',
        id: this.current_whorder_id
      };
      const endpoint=  'wh_orders/getById';
      this.AC.post(params,endpoint).subscribe((rew_order_Answer: any) => {
        const wh_order_Answer = rew_order_Answer;
        wh_order_Answer.wh_order.id = Number(wh_order_Answer.wh_order.id);
        // console.log(wh_order_Answer.wh_order);
        // alert(JSON.stringify(wh_order_Answer.wh_order));
        // this.AC.updated_whorder.next(wh_order_Answer.wh_order);
        this.AC.setUpdateWhOrder(wh_order_Answer.wh_order);
        this.AC.setWhOrder(wh_order_Answer.wh_order.id);

        // alert(`setUpdateWhOrder(wh_order_Answer.wh_order)`);
      });
      this.changeDetectorRef.detectChanges();
      this.closeDialog();
    }, 1);
  }

  Cancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
