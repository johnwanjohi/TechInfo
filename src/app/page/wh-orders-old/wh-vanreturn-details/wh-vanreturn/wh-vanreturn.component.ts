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
// import { WhTransferDetailsComponent } from '../wh-transfer-details/wh-transfer-details.component';
import { Brands, Order_types, UsersData } from '../../../../shared/models/index';
import { AccountsService } from 'app/shared/services/accounts.service';
import { FormcontrolsService } from '../../../../shared/services/formcontrols.service';
import { WhVanReturnDetailsComponent } from '../wh-vanreturn-details/wh-vanreturn-details.component';

@Component({
  selector: 'app-wh-vanreturn',
  templateUrl: './wh-vanreturn.component.html',
  styleUrls: ['./wh-vanreturn.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WHVanReturnComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(WhVanReturnDetailsComponent, { static: false }) whVanReturnDetails;
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
  listOfUsers: UsersData[]
  ordertypes$: Observable<any>;
  users$: Observable<any>;
  products$: Observable<any>;
  branches$: Observable<any>;
  suppliers$: Observable<any>;
  dataSource: MatTableDataSource<WarehouseOrdersData>;
  selected_ordertype: any;
  selectedOrderTypeName: any;
  selected_branch: number;
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

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<WhVanReturnDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private changeRef: ChangeDetectorRef,
    private formService: FormcontrolsService
  ) {
    this.action = this.data.action;

    this.AC.loggedInUser.subscribe((userDetails) => {
      this.currentUserName = userDetails.username;
    });

    this.current_w_order_id = data?.id;
    this.selected_branch = data?.warehouse_id;
    this.getBranches().then(() => {
      this.getProducts();
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
      return_qty: new FormControl(0, [Validators.required]),
      notes: new FormControl(''),
      van: new FormControl(''),
      status_id: new FormControl(0),
      return_by: new FormControl(this.currentUserName),
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
    this.activateRoute.params.subscribe((keys) => {
      setTimeout(() => {
        ;
      }, 500);
    });
    this.AC.branchObserver().subscribe((warehouse_id) => {
      this.selected_branch = Number(warehouse_id);
    });
  }
  ngAfterViewInit() {
    // this.accordion.openAll();
    this.getProducts();
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
  async getProducts() {
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
     // action: 'getAll',
     // module: 'suppliers',
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

  async getBranches() {
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

  submit() {
    this.myForm.markAllAsTouched();
    if (!this.myForm.valid) {
      return;
    }
    if (this.action !== 'edit') {
      this.myForm.patchValue({ id: null });
    };
    const params = {
      //action: this.action === 'edit' ? 'post' : 'put',
      //module: 'wh_vanreturn_details',
      form: this.myForm.value,
    };
    const endpoint= this.action === 'edit' ? 'wh_vanreturn_details/post' : 'wh_vanreturn_details/put';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          return_date: answer.wh_vanreturn_details.return_date,
          id: Number(answer.wh_vanreturn_details.id)
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
      // action: 'getTotalsReceivedId',
      // module: 'wh_vanreturn_details',
      form: this.myForm.value,
    };

    const endpoint=  'wh_vanreturn_details/getTotalsReceivedId';
     this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {

      this.total_ordered_qty = Number(answer?.wh_vanreturn_details[0]?.total_received_qty);
      this.myForm.patchValue(
        {
          ordered_qty: Number(answer?.wh_vanreturn_details[0]?.ordered_qty)
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
      //action: 'getById',
      //module: 'wh_vanreturn_details',
      id: Number(this.data.id),
    };
    const endpoint=  'wh_vanreturn_details/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          w_order_id: Number(answer.wh_vanreturn_details.w_order_id),
          product_id: Number(answer.wh_vanreturn_details.product_id),
          return_qty: Number(answer.wh_vanreturn_details.return_qty),
          return_by: answer.wh_vanreturn_details.return_by,
          return_date: answer.wh_vanreturn_details.return_date,
          van: answer.wh_vanreturn_details.van,
          notes: answer.wh_vanreturn_details.notes,
          id: Number(answer.wh_vanreturn_details.id)
        });
      this.selected_product_id = Number(answer.wh_vanreturn_details.product_id);
      setTimeout(() => {
        this.onAdd.emit();
        this.getTotalsReceivedId();
        this.changeRef.detectChanges();
      }, 50);
    });
  }

}
