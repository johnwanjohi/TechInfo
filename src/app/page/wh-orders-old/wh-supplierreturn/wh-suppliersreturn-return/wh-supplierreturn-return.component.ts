import {
  Component, Inject, OnInit, Optional, ViewEncapsulation, ChangeDetectionStrategy,
  ChangeDetectorRef, ViewChild, EventEmitter, AfterViewInit
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { AccountsService } from 'src/app/services/accounts.service';
import { MatTableDataSource } from '@angular/material/table';
import { WarehouseOrdersData } from 'app/shared/models/index';
import { Observable } from 'rxjs';
// import { PopUpService } from 'src/app/services/pop-up.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
// import { WhSupplierStockDetails } from '../../wh-supplierstock-details/wh-supplierstock-details.component';
// import { Order_types, Brands, Types } from 'src/app/shared/models';
import { WhSupplierReturnDetailsComponent } from '../wh-supplierreturn-details/wh-supplierreturn-details.component';
import { Order_types, Brands, Types } from 'app/shared/models';
import { AccountsService } from 'app/shared/services/accounts.service';
import { FormcontrolsService } from '../../../../shared/services/formcontrols.service';


@Component({
  selector: 'app-wh-supplierreturn-return',
  templateUrl: './wh-supplierreturn-return.component.html',
  styleUrls: ['./wh-supplierreturn-return.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WHSupplierReturnComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(WhSupplierReturnDetailsComponent, { static: false }) whSupplierReturnDetails;
  myForm: FormGroup;
  id: any;
  order_type_id: any;
  brand_id: any;
  type_id: any;
  showOK: boolean;
  ordertypes: Order_types[];
  listOfProducts: any[];
  listOfOrderTypes: Order_types[];
  listOfWareHouses: Brands[]
  listOfSuppliers: any[]
  listOfOrderStatus: Types[]
  ordertypes$: Observable<any>;
  products$: Observable<any>;
  branches$: Observable<any>;
  suppliers$: Observable<any>;
  dataSource: MatTableDataSource<WarehouseOrdersData>;
  selected_ordertype: any;
  selectedOrderTypeName: any;
  selected_warehouse: number;
  seleted_status: number;
  currentUserName: string;
  panelOpenState = true;
  current_w_order_id: any;
  current_warehouse_id: number;
  selected_product_id: any;
  current_supplier_order_number: any;
  selected_supplier: any;
  onAdd = new EventEmitter();
  total_ordered_qty: any = 0;
  action: string;
  available_qty: number;
  typeOfAvailableQty: string;
  current_product_id: number;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<WhSupplierReturnDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private changeRef: ChangeDetectorRef,
    private formService: FormcontrolsService
  ) {
    this.AC.loggedInUser.subscribe((userDetails) => {
      this.currentUserName = userDetails.username;
    });

    this.action = data.action;
    this.current_w_order_id = data?.id;
    this.selected_warehouse = data?.warehouse_id;
    this.current_warehouse_id = this.selected_warehouse;
    this.available_qty = 0;
    this.current_product_id = 0;

    this.getWarehouses().then(() => {
      this.getOrderTypes();
    }).then(() => {
      this.getWarehouseStockProducts();
    }).then(() => {
      this.getSuppliers();
    })
      .then(() => {
        this.initializeForm();
      });
  }
  initializeForm() {
    this.myForm = new FormGroup({
      w_order_id: new FormControl(Number(this.current_w_order_id), Validators.required),
      supplier_id: new FormControl(0, Validators.required),
      product_id: new FormControl(0, Validators.required),
      return_qty: new FormControl(0, Validators.required),
      supplier_order_number: new FormControl('', Validators.required),
      notes: new FormControl(''),
      status_id: new FormControl(2),
      modify_by: new FormControl(this.currentUserName, Validators.required),
      create_by: new FormControl(this.currentUserName, Validators.required),
      id: new FormControl(0)
    });
    this.myForm.markAllAsTouched();
  }

  ngOnInit(): void {
    this.showOK = false;
    this.typeOfAvailableQty = `${typeof this.typeOfAvailableQty}`;
    this.AC.branchObserver().subscribe((warehouse_id) => {
      this.selected_warehouse = Number(warehouse_id);
    });
    if (this.action === 'edit') {
      this.getItemByID();
    }
    this.getWarehouseStockProducts();
  }

  addItems() {
    this.submit();
  }
  async getOrderStatus() {
    const params = {
      action: 'getAll',
      module: 'statuses'
    };

    this.ordertypes$ = await this.AC.get(params);
    this.ordertypes$.subscribe((answer) => {
      this.listOfOrderStatus = answer.statuses.map((arr) => {
        arr.id = Number(arr.id);
        this.changeRef.detectChanges();
        return arr;
      });
    });
  }
  getWarehouseStockProducts(current_warehouse_id = this.current_warehouse_id) {
    const params = {
      action: Number(current_warehouse_id) === 0 ? 'getAll' : 'getByWHId',
      module: 'stock_status',
      warehouse_id: !this.current_warehouse_id ? 0 : this.current_warehouse_id
    };
    if (this.current_warehouse_id === 0) {
      // this.isLoading = false;
      return;
    }

    this.AC.get(params).subscribe((answer: any) => {
      console.dir(answer);
      // this.stock_status = answer.stock_status;
      // this.listOfProducts = answer.products.map((arr) => {
      this.listOfProducts = answer.stock_status.map((arr) => {
        arr.id = Number(arr.product_id);
        this.changeRef.detectChanges();
        return arr;
      });
      this.changeRef.detectChanges();
    });
  }
  getAvailableQty($event: any) {
    this.available_qty = Number($event?.available);
    this.current_product_id = Number($event?.product_id);
    const params = {
      action: Number(this.current_warehouse_id) === 0 ? 'getAll' : 'getByWHIdAndProductID',
      module: 'stock_status',
      warehouse_id: !this.current_warehouse_id ? 0 : this.current_warehouse_id,
      product_id: !this.current_product_id ? 0 : this.current_product_id,
    };
    if (this.current_warehouse_id === 0) {
      // this.isLoading = false;
      return;
    }
    this.AC.get(params).subscribe((answer: any) => {
      // console.dir(answer);
      this.available_qty = answer.stock_status.available;
      this.changeRef.detectChanges();
    });
  }
  validateReturnQty() {
    const return_qty = this.myForm.get('return_qty');
    const maxQtyReturn = this.available_qty; //  this.myForm.get('ordered_qty').value;
    return_qty.setValidators([
      Validators.required,
      Validators.min(0.000),
      Validators.max(maxQtyReturn)
    ]);
    return_qty.updateValueAndValidity();
  }
  async getProductsxx() {
    const params = {
      //action: 'getAll',
      //module: 'products'
    };
    const endpoint=  'products/getAll';
    this.products$ = await this.AC.post(params,endpoint);
    this.products$.subscribe((answer) => {
      this.listOfProducts = answer.products.map((arr) => {
        arr.id = Number(arr.id);
        this.changeRef.detectChanges();
        return arr;
      });
    });
  }
  async getSuppliers() {
    const params = {
      //action: 'getAll',
      //module: 'suppliers',
      id: Number(this.id),
    };

    const endpoint= 'suppliers/getAll' ;
    this.suppliers$ = await this.AC.post(params,endpoint);
    this.suppliers$.subscribe((answer) => {
      this.listOfSuppliers = answer.suppliers.map((arr) => {
        arr.id = Number(arr.id);
        this.changeRef.detectChanges();
        return arr;
      });
    });
  }

  async getWarehouses() {
    const params = {
      action: 'getAll',
      module: 'branches',
      id: Number(this.id),
    };
    this.branches$ = await this.AC.get(params);
    this.branches$.subscribe((answer) => {
      this.listOfWareHouses = answer.branches.map((arr) => {
        arr.id = Number(arr.id);
        this.changeRef.detectChanges();
        return arr;
      });
    });
  }
  async getOrderTypes() {
    const params = {
     // action: 'getAll',
     //module: 'order_types',
      id: Number(this.id),
    };
    const endpoint= 'order_types/getAll';
    this.ordertypes$ = await this.AC.post(params,endpoint);
    this.ordertypes$.subscribe((answer: any) => {
      this.listOfOrderTypes = answer.order_types.map((arr) => {
        arr.id = Number(arr.id);
        this.changeRef.detectChanges();
        return arr;
      })
    });
  }
  convertToJSON(product: any) {
    return JSON.parse(product);
  }
  submit() {
    this.validateReturnQty();
    this.myForm.markAllAsTouched();
    if (!this.myForm.valid) {
      return;
    }
    if (this.action !== 'edit') {
      this.myForm.patchValue({ id: null });
    };
    const params = {
      //action: this.action === 'edit' ? 'post' : 'put',
      //module: 'wh_supplierreturn_details',
      form: this.myForm.value,
    };
    const endpoint= this.action === 'edit' ? 'wh_supplierreturn_details/post' : 'wh_supplierreturn_details/put';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          create_date: answer.wh_supplierreturn_details.create_date,
          id: Number(answer.wh_supplierreturn_details.id)
        });
      setTimeout(() => {
        this.onAdd.emit();
        this.changeRef.detectChanges();
        this.Cancel();
      }, 50);
    });
  }
  Cancel() {
    this.closeDialog();
  }
  getSelectedOrderTypeName() {
    if (this.listOfOrderTypes?.length !== 0) {

      this.selectedOrderTypeName = this.listOfOrderTypes.find(items => items.id === Number(this.selected_ordertype))?.order_type;
    }
    this.changeRef.detectChanges();
    return this.selectedOrderTypeName;
  }
  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onClose() {
    this.closeDialog();
  }

  getTotalsReceivedId() {
    const params = {
     // action: 'getTotalsReceivedId',
     // module: 'wh_supplierstock_details',
      form: this.myForm.value,
    };

    const endpoint= 'wh_supplierstock_details/getTotalsReceivedId';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.total_ordered_qty = Number(answer?.wh_supplierstock_details[0]?.total_received_qty);
      this.myForm.patchValue(
        {
          ordered_qty: Number(answer?.wh_supplierstock_details[0]?.ordered_qty)
        });
    });
  }
  get TotalOrderedQty() {
    return this.total_ordered_qty || 0;
  }
  get invalidControls() {
    return this.formService.findInvalidControlsRecursive(this.myForm);
  }
  async getItemByID() {
    this.myForm.patchValue({ id: null })
    const params = {
      // action: 'getById',
      // module: 'wh_supplierreturn_details',
      id: Number(this.data.id),
    };
    const endpoint= 'wh_supplierstock_details/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          create_date: answer.wh_supplierreturn_details.create_date,
          w_order_id: Number(answer.wh_supplierreturn_details.w_order_id),
          supplier_id: Number(answer.wh_supplierreturn_details.supplier_id),
          product_id: Number(answer.wh_supplierreturn_details.product_id),
          return_qty: answer.wh_supplierreturn_details.return_qty,
          supplier_order_number: answer.wh_supplierreturn_details.supplier_order_number,
          notes: answer.wh_supplierreturn_details.notes,
          status_id: answer.wh_supplierreturn_details.status_id,
          modify_by: this.currentUserName,
          create_by: answer.wh_supplierreturn_details.create_by,
          id: Number(answer.wh_supplierreturn_details.id),
        });
      this.selected_supplier = Number(answer.wh_supplierreturn_details.supplier_id);
      this.selected_product_id = Number(answer.wh_supplierreturn_details.product_id);
      this.current_supplier_order_number = answer.wh_supplierreturn_details.supplier_order_number;
      this.current_warehouse_id = Number(answer.wh_supplierreturn_details.warehouse_id);
      this.current_product_id = this.selected_product_id;
      this.getAvailableQty(answer.wh_supplierreturn_details);
      this.getWarehouseStockProducts();
      setTimeout(() => {
        this.onAdd.emit();
        this.getTotalsReceivedId();
        this.changeRef.detectChanges();
      }, 50);

    });
  }
}
