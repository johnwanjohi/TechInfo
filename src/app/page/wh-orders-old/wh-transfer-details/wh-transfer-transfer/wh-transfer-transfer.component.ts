import {
  Component, Inject, OnInit, Optional, ViewEncapsulation,
  ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, EventEmitter, AfterViewInit
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
// import { Order_types, Brands, Types,UsersData } from 'src/app/models/interfaces';
import { WhTransferDetailsComponent } from '../wh-transfer-details/wh-transfer-details.component';
import { Brands, Order_types, UsersData } from '../../../../shared/models/index';
import { AccountsService } from 'app/shared/services/accounts.service';
import { FormcontrolsService } from '../../../../shared/services/formcontrols.service';

@Component({
  selector: 'app-wh-transfer-transfer',
  templateUrl: './wh-transfer-transfer.component.html',
  styleUrls: ['./wh-transfer-transfer.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WHTransferTransferComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(WhTransferDetailsComponent, { static: false }) whTransferDetails;
  myForm: FormGroup;
  id: any;
  order_type_id: any;
  brand_id: any;
  type_id: any;
  showOK: boolean;
  ordertypes: Order_types[];
  listOfProducts: any[];
  listOfOrderTypes: Order_types[];
  listOfWareHouses: WarehouseOrdersData[]
  listOfSuppliers: any[]
  listOfUsers: UsersData[]
  ordertypes$: Observable<any>;
  users$: Observable<any>;
  products$: Observable<any>;
  warehouses$: Observable<any>;
  suppliers$: Observable<any>;
  dataSource: MatTableDataSource<WarehouseOrdersData>;
  selected_ordertype: any;
  selectedOrderTypeName: any;
  current_warehouse_id: number;
  selected_new_warehouse_id: number;
  seleted_status: number;
  currentUserName: string;
  panelOpenState = true;
  current_w_order_id: any;
  selected_product_id: any;
  current_supplier_order_number: any;
  selected_supplier: any;
  onAdd = new EventEmitter();
  total_ordered_qty: any = 0;
  action: any;
  available_qty: number;
  current_product_id: number;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<WhTransferDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private changeRef: ChangeDetectorRef,
    private formService: FormcontrolsService
  ) {
    this.action = this.data.action;

    this.AC.loggedInUser.subscribe((userDetails) => {
      this.currentUserName = userDetails.username;
    });

    this.current_w_order_id = data?.id;
    this.current_warehouse_id = data?.warehouse_id;
    this.getWarehouses().then(() => {
      // this.getProducts();
      this.getWarehouseStockProducts();
    }).then(() => {
      // this.getProducts();
    }).then(() => {
      this.getListOfUsers();
    })
      .then(() => {
        this.initializeForm();
      }).then(() => {
        if (this.action === 'edit') {
          this.getItemByID();
        }
      });
  }
  initializeForm() {
    this.myForm = new FormGroup({
      w_order_id: new FormControl(Number(this.current_w_order_id), Validators.required),
      product_id: new FormControl(0, Validators.required),
      transfer_qty: new FormControl(0, [Validators.required]),
      receive_qty: new FormControl(0, [Validators.required]),
      new_warehouse_id: new FormControl(0, Validators.required),
      transfer_date: new FormControl('', Validators.required),
      transfer_by: new FormControl('', Validators.required),
      receive_date: new FormControl('', Validators.required),
      receive_by: new FormControl('', Validators.required),
      notes: new FormControl(''),
      status_id: new FormControl(0),
      id: new FormControl(0)
    });
    this.myForm.markAllAsTouched();
  }
  validateReceivedQty() {
    const received_qty = this.myForm.get('return_qty');
    // const maxQtyRecently =  this.myForm.get('ordered_qty').value;
    received_qty.setValidators([
      Validators.required,
      Validators.min(0.001),
      // Validators.max(maxQtyRecently),
      Validators.max(0),
    ]);
    received_qty.updateValueAndValidity();
  }
  ngOnInit(): void {
    this.showOK = false;
    this.AC.warehouseObserver().subscribe((warehouse_id) => {
      // this.current_warehouse_id = Number( warehouse_id);
    });
  }
  ngAfterViewInit() {
    // this.accordion.openAll();
    this.getWarehouseStockProducts();
  }
  addItems() {

    // this.whSupplierStockDetails.loadWHOrdersSupplierStock();
    this.submit();
  }
  async getListOfUsers() {
    const params = {
      action: 'getAll',
      module: 'users'
    };
    this.users$ = await this.AC.get(params);
    this.users$.subscribe((answer) => {
      this.listOfUsers = answer.users.map((arr) => {
        this.changeRef.detectChanges();
        return arr;
      });
    });
  }
  getAvailableQty($event: any) {
    this.available_qty = Number($event?.available);
    this.current_product_id = Number($event?.product_id);
    const params = {
      action: Number(this.current_warehouse_id) === 0 ? 'getAll' : 'AndProductID',
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
      //action: 'getAll',
      //module: 'warehouses',
      id: Number(this.id),
    };
    const endpoint= 'warehouses/getAll';
    this.warehouses$ = await this.AC.post(params,endpoint);
    this.warehouses$.subscribe((answer: any) => {
      // this.listOfWareHouses = answer.warehouses.map((arr) => {
      //   arr.id = Number(arr.id);
      //   this.changeRef.detectChanges();
      //   return arr;
      // });
      this.listOfWareHouses = answer.warehouses.filter((arr) => {
        //console.log(arr.id + this.current_warehouse_id);
        arr.id = Number(arr.id);
        return Number(arr.id) !== Number(this.current_warehouse_id);
      }
      )

        // .map((arr) => {
        //   arr.id = Number(arr.id);
        //   return arr;
        // })
        ;
      console.dir(this.listOfWareHouses);
      this.changeRef.detectChanges();
    });
  }
  async getOrderTypes() {
    const params = {
      //action: 'getAll',
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
  validateTransferQty() {
    const return_qty = this.myForm.get('transfer_qty');
    const maxQtyReturn = this.available_qty; //  this.myForm.get('ordered_qty').value;
    return_qty.setValidators([
      Validators.required,
      Validators.min(0.000),
      Validators.max(maxQtyReturn)
    ]);
    return_qty.updateValueAndValidity();
  }


  submit() {
    this.validateTransferQty();
    this.myForm.markAllAsTouched();
    // console.log(this.myForm.value);
    if (Number(this.myForm.value.new_warehouse_id) === 0) {
      alert('Please select new warehouse');
      return;
    };
    if (this.current_warehouse_id === this.myForm.value.new_warehouse_id) { // }.get('new_w_id').value) {
      this.myForm.patchValue({ new_warehouse_id: 0 });
      this.myForm.markAllAsTouched();
      alert('Please select new warehouse')
      return false;
    }
    this.myForm.markAllAsTouched();
    if (!this.myForm.valid) {
      return;
    }
    if (this.action !== 'edit') {
      this.myForm.patchValue({ id: null });
    };
    const params = {
      //action: this.action === 'edit' ? 'post' : 'put',
     // module: 'wh_transfer_details',
      form: this.myForm.value,
    };
    const endpoint= this.action === 'edit' ? 'wh_transfer_details/post' : 'wh_transfer_details/put';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          create_date: answer.wh_transfer_details.create_date,
          id: Number(answer.wh_transfer_details.id)
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
    // this.router.navigate(['/warehouses']);
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
      //action: 'getTotalsReceivedId',
      //module: 'wh_supplierstock_details',
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
      //module: 'wh_transfer_details',
      id: Number(this.data.id),
    };
    const endpoint= 'wh_transfer_details/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          w_order_id: Number(answer.wh_transfer_details.w_order_id),
          product_id: Number(answer.wh_transfer_details.product_id),
          transfer_qty: Number(answer.wh_transfer_details.transfer_qty),
          receive_qty: Number(answer.wh_transfer_details.receive_qty),
          new_warehouse_id: Number(answer.wh_transfer_details.new_warehouse_id),
          transfer_date: answer.wh_transfer_details.transfer_date,
          transfer_by: answer.wh_transfer_details.transfer_by,
          receive_date: answer.wh_transfer_details.receive_date,
          receive_by: answer.wh_transfer_details.receive_by,
          notes: answer.wh_transfer_details.notes,
          id: Number(answer.wh_transfer_details.id)
        });
      this.selected_product_id = Number(answer.wh_transfer_details.product_id);
      setTimeout(() => {
        this.onAdd.emit();
        this.getTotalsReceivedId();
        this.changeRef.detectChanges();
      }, 50);
    });
  }

}
