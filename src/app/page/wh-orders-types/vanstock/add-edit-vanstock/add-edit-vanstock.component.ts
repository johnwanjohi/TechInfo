
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
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-add-edit-vanstock',
  templateUrl: './add-edit-vanstock.component.html',
  styleUrls: ['./add-edit-vanstock.component.scss']
})
export class AddEditVanStockComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(AddEditVanStockComponent, { static: false }) whVanStockDetails;
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
  selected_warehouse_id: number;
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
  current_warehouse_id: number;
  maxToTransfer: number;
  qtyBeingEdited: number;
  @ViewChild('product_id') product_id: NgSelectComponent;
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<AddEditVanStockComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private changeRef: ChangeDetectorRef,
    private formService: FormcontrolsService
  ) {
    this.action = this.data.action;

    this.AC.loggedInUser.subscribe((userDetails) => {
      this.currentUserName = userDetails.username;
    });

    this.current_w_order_id = this.data?.current_wh_order_id;
    this.current_warehouse_id  = data?.warehouse_id;

    this.selected_warehouse_id = data?.warehouse_id;
    this.initializeForm();

  }
  initializeForm() {
    this.myForm = new FormGroup({
      wh_order_id: new FormControl(Number(this.current_w_order_id), Validators.required),
      product_id: new FormControl(0, Validators.required),
      issue_qty: new FormControl(0, [Validators.required]),
      notes: new FormControl(''),
      status_id: new FormControl(0),
      create_by: new FormControl(this.currentUserName),
      id: new FormControl(0)
    });
    this.myForm.markAllAsTouched();
  }
  validateReceivedQty() {
    const issue_qty = this.myForm.get('issue_qty');
     issue_qty.setValidators([
      Validators.required,
      Validators.min(0.001),
      // Validators.max(maxQtyRecently),
      Validators.max(0),
    ]);
    issue_qty.updateValueAndValidity();
  }
  ngOnInit(): void {
    this.showOK = false;
    this.initializeForm();

    this.AC.warehouseObserver().subscribe((warehouse_id) => {
      this.selected_warehouse_id = Number(warehouse_id);
      this.current_warehouse_id  = Number(warehouse_id);
      this.getWarehouseStockProducts();
    });
    this.current_w_order_id = this.data?.current_wh_order_id;
    this.getBranches().then(() => {
      // this.getProducts();
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
  ngAfterViewInit() {

  }
  addItems() {
    // alert(`adding items`);
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
    /*const params = {
      action: 'getAll',
      module: 'products'
    };
    this.products$ = await this.AC.get(params);
    this.products$.subscribe((answer) => {
      this.listOfProducts = answer.products.map((arr) => {
        arr.id = Number(arr.id);
        this.changeRef.detectChanges();
        return arr;
      });
    });*/
    this.getWarehouseStockProducts();
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
    this.validateReceivedQty();
    this.validateTransferQty();
    if (!this.myForm.valid) {
      return;
    }
    if (this.action !== 'edit') {
      this.myForm.patchValue({ id: null });
    };
    const params = {
      //action: this.action === 'edit' ? 'post' : 'put',
      //module: 'wh_vanstock',
      form: this.myForm.value,
    };
    const endpoint= this.action === 'edit' ? 'wh_vanstock/post' : 'wh_vanstock/put';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          create_date: answer.wh_vanstock.create_date,
          id: Number(answer.wh_vanstock.id)
        });
        const params={
          id:this.myForm.value.wh_order_id
        };
        const endpoint=  'wh_orders/getById';
        this.AC.post(params,endpoint).subscribe(
        (updatedorder:any) => {
          console.dir(updatedorder)
          this.AC.updated_whorder.next(updatedorder.wh_order);
        }
      )
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
     // module: 'wh_vanstock',
      id: Number(this.data.id),
    };
    const endpoint= 'wh_vanstock/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          wh_order_id: Number(answer.wh_vanstock.wh_order_id),
          product_id: Number(answer.wh_vanstock.product_id),
          issue_qty: Number(answer.wh_vanstock.issue_qty),
          create_by: answer.wh_vanstock.create_by,
          create_date: answer.wh_vanstock.create_date,
          notes: answer.wh_vanstock.notes,
          id: Number(answer.wh_vanstock.id)
        });
        const params={
          id:this.myForm.value.wh_order_id
        };
        const endpoint=  'wh_orders/getById';
        this.AC.post(params,endpoint).subscribe(
        (updatedorder:any) => {
          console.dir(updatedorder)
          this.AC.updated_whorder.next(updatedorder.wh_order);
        }
      )
      this.selected_product_id = Number(answer.wh_vanstock.product_id);
      let changeData = [] = this.product_id?.selectedValues; // = {product_id: 0,available};
      // changeData["product_id"] = this.product_id.selectedValues.product_id;
      changeData["available"] = Number(answer.wh_vanstock.issue_qty);
      changeData["product_id"] = Number(answer.wh_vanstock.product_id)
      // this.product_id.changeEvent.emit();
      // this.product_id.c
      this.qtyBeingEdited =  Number(answer.wh_vanstock.issue_qty);
      this.getAvailableQty(changeData);
      this.validateReceivedQty();
      this.validateTransferQty();
      setTimeout(() => {
        this.onAdd.emit();

        this.changeRef.detectChanges();
      }, 50);
    });
  }
 cancel(){
    this.onClose();
 }
  async getAvailableQty($event: any) {
    this.available_qty = Number($event?.available);
    this.current_product_id = Number($event?.product_id);
    const params = {
      action: Number(this.current_product_id) === 0 ? 'getAll' : 'getByWHIdAndProductID',
      module: 'stock_status',
      warehouse_id: !this.current_warehouse_id ? 0 : this.current_warehouse_id,
      product_id: !this.current_product_id ? 0 : this.current_product_id,
    };
    if (this.current_warehouse_id === 0) {
      return;
    }
    this.AC.get(params).subscribe((answer: any) => {
      this.available_qty = answer.stock_status.available;
      this.validateReceivedQty();
      this.validateTransferQty();
      this.changeRef.detectChanges();
    });
    // alert(`change event emitted ${ JSON.stringify( $event )}`)

    await this.getmaxToTransfer(this.current_warehouse_id, Number($event?.product_id)).then((maxToTransfer) => {
      // alert(maxToTransfer);

    });
    /*this.validateReceivedQty();
    this.validateTransferQty();*/
  }
  async getmaxToTransfer(warehouse_id ,product_id: number) {
    let maxToTransfer: number;
    const params = {
      action: 'getByWHIdAndProductID',
      module: 'stock_status',
      warehouse_id: warehouse_id,
      product_id: product_id
    };
    //console.log(params);
    await this.AC.get(params).subscribe((answer: any) => {
      //console.dir(answer);

      this.maxToTransfer =   answer.stock_status.available;
      this.available_qty = this.maxToTransfer;
      //if (this.action.toLowerCase().includes('edit')){
      this.available_qty = +this.maxToTransfer + +this.qtyBeingEdited ;
      this.validateTransferQty();
      //}
      maxToTransfer = answer.stock_status.available;

      return answer.stock_status.available;
      this.changeRef.detectChanges();
    });
    return maxToTransfer;
  }

  async getWarehouseStockProducts(current_warehouse_id = this.current_warehouse_id) {
    const params = {
      action: Number(current_warehouse_id) === 0 ? 'getAll' : 'getStockByWarehouseId',
      module: 'stock_status',
      warehouse_id: !this.current_warehouse_id ? 0 : this.current_warehouse_id
    };
    //console.log(params);
    if (this.current_warehouse_id === 0) {
      return;
    }
    this.AC.get(params).subscribe((answer: any) => {
      //console.dir(answer);
      if (this.action === 'edit') {
        this.listOfProducts = answer.stock_status.map((arr) => {
          arr.id = Number(arr.product_id);
          // this.changeRef.detectChanges();
          return arr;
        });
      }else{
        this.listOfProducts = answer.stock_status.map((arr) => {
          arr.id = Number(arr.product_id);
          // this.changeRef.detectChanges();
          return arr;
        }).filter((arr) => {
            return Number(arr.available) > 0;
          }
        );
      }
      this.changeRef.detectChanges();
    });
  }
  validateTransferQty() {
    //console.log(this.listOfProducts);
    const issue_qty = this.myForm.get('issue_qty');
    let maxQtyTransfer = this.listOfProducts.filter((arr)=>{
      return arr.id === this.current_product_id
    }).map((arr)=>{
      return arr.available;
    })[0] as number;
    if(this.action==='edit'){
      maxQtyTransfer = (Number(maxQtyTransfer) - Number(this.qtyBeingEdited)) <= 0 ?( Number(maxQtyTransfer) + Number(this.qtyBeingEdited))
        : (Number(maxQtyTransfer) - Number(this.qtyBeingEdited)) ;
    }
    this.available_qty = maxQtyTransfer;
    // this.available_qty ;
    //console.log(`maxQtyTransfer ${maxQtyTransfer}`)
    issue_qty.setValidators([
      Validators.required,
      Validators.min(0.000),
      Validators.max(maxQtyTransfer)
    ]);
    issue_qty.updateValueAndValidity();
  }




}
