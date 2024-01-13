import {
  Component, Inject, OnInit, Optional, ViewEncapsulation,
  ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, EventEmitter, AfterViewInit
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { WarehouseOrdersData } from 'app/shared/models/index';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Brands, Order_types, UsersData } from '../../../../shared/models/index';
import { AccountsService } from 'app/shared/services/accounts.service';
import { FormcontrolsService } from '../../../../shared/services/formcontrols.service';
import {NgSelectComponent} from '@ng-select/ng-select';
import {isEmpty} from 'rxjs/operators';


@Component({
  selector: 'app-add-edit-transfer',
  templateUrl: './add-edit-transfer.component.html',
  styleUrls: ['./add-edit-transfer.component.scss']
})
export class AddEditTransferComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(AddEditTransferComponent, { static: false }) whTransferDetails;
  myForm: FormGroup;
  id: any;
  order_type_id: any;
  brand_id: any;
  type_id: any;
  showOK: boolean;
  ordertypes: Order_types[];
  listOfProducts: any[] = [];
  listOfOrderTypes: Order_types[];
  listOfWareHouses: WarehouseOrdersData[] = [];
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
  selected_new_wh_id: number;
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
  isTransfer:boolean;
  isReceive:boolean;
  maxToTransfer: number;
  qtyBeingEdited: number;
  @ViewChild('product_id') product_id: NgSelectComponent;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<AddEditTransferComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private changeRef: ChangeDetectorRef,
    private formService: FormcontrolsService
  ) {
    this.action = this.data.action;
    this.current_warehouse_id = this.data.current_warehouse_id
    this.isTransfer = this.data.isTransfer;
    this.isReceive = this.data.isReceive;

    this.AC.loggedInUser.subscribe((userDetails) => {
      this.currentUserName = userDetails.username;
    });

    this.current_w_order_id = data?.wh_order_id | data?.current_wh_order_id;
    this.current_warehouse_id = data?.warehouse_id;
    this.getWarehouses().then(() => {
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
  trasferRequired(){
    let required = [];
    if (this.isTransfer){
      required = [Validators.required]
    }
    return required;
  }
  receiveRequired(){
    let required = [];
    if (this.isReceive){
      required = [Validators.required]
    }
    return required;
  }
  initializeForm() {
    this.myForm = new FormGroup({
      wh_order_id: new FormControl(Number(this.current_w_order_id), Validators.required),
      product_id: new FormControl( '',Validators.required),
      new_wh_id: new FormControl(0, Validators.required),
      transfer_qty: new FormControl(0, this.trasferRequired()),
      transfer_date: new FormControl('', this.trasferRequired()),
      transfer_by: new FormControl(
        this.action.toLowerCase().includes('add') ?
          this.currentUserName : ''
        , this.trasferRequired()),
      receive_date: new FormControl('', this.receiveRequired()),
      receive_by: new FormControl(this.isTransfer? this.currentUserName : '', this.receiveRequired()),
      receive_qty: new FormControl(0, this.receiveRequired()),
      notes: new FormControl(''),
      status_id: new FormControl(0),
      id: new FormControl(0)
    });
    this.validateTransferQty();
    this.validateReceivedQty();
    this.myForm.markAllAsTouched();
  }
  validateReceivedQty() {
    // const received_qty = this.myForm.get('return_qty');
    // // const maxQtyRecently =  this.myForm.get('ordered_qty').value;
    // received_qty.setValidators([
    //   Validators.required,
    //   Validators.min(0.001),
    //   // Validators.max(maxQtyRecently),
    //   Validators.max(0),
    // ]);
    // received_qty.updateValueAndValidity();
    // this.changeRef.detectChanges();
    // this.myForm.get('receive_qty')
    const receive_qty = this.myForm.get('receive_qty');
    const maxQtyReceive = Number(this.myForm.value.transfer_qty);
    receive_qty.setValidators([
      Validators.required,
      Validators.min(0.000),
      Validators.max(maxQtyReceive)
    ]);
    receive_qty.updateValueAndValidity();
    // this.myForm.controls['receive_qty'].valueChanges.subscribe(value => {
    //   console.log(value);
    //   this.validateReceivedQty();
    // });
  }
  ngOnInit(): void {
    this.showOK = false;
    this.AC.warehouseObserver().subscribe((warehouse_id) => {
       });
  }
  ngAfterViewInit() {
    // this.accordion.openAll();
    this.AC.warehouseObserver().subscribe((warehouse_id) => {
      this.current_warehouse_id = Number( warehouse_id)
    });
    this.getWarehouseStockProducts().then(()=>{
      if (!this.current_warehouse_id){
        alert(`Please select a warehouse first for you to proceed`);
        this.closeDialog()
      }
      }
    );
  }
  addItems() {
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

  async getWarehouses() {
    const params = {
      //action: 'getAll',
      //module: 'warehouses',
      id: Number(this.id),
    };
    const endpoint= 'warehouses/getAll';
    this.warehouses$ = await this.AC.post(params,endpoint);
    this.warehouses$.subscribe((answer: any) => {
      this.listOfWareHouses = answer.warehouses.filter((arr) => {
          if (this.action.toLowerCase().includes('add')){
            return Number(arr.id) !== Number(this.current_warehouse_id);
          }else{
            return arr.id = Number(arr.id);
          }
          // return this.isTransfer? Number(arr.id) !== Number(this.current_warehouse_id) : Number(arr.id);
        }
      );
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
    //console.log(this.listOfProducts);
    const transfer_qty = this.myForm.get('transfer_qty');
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
    transfer_qty.setValidators([
      Validators.required,
      Validators.min(0.000),
      Validators.max(maxQtyTransfer)
    ]);
    transfer_qty.updateValueAndValidity();
  }

  submit() {
    this.validateTransferQty();
    this.validateReceivedQty();
    this.myForm.markAllAsTouched();
    if (Number(this.myForm.value.new_wh_id) === 0) {
      alert('Please select new warehouse');
      return;
    };
    if (this.current_warehouse_id === this.myForm.value.new_wh_id) {
      // this.myForm.patchValue({ new_wh_id: 0 });
      this.myForm.markAllAsTouched();

    }
    this.myForm.markAllAsTouched();
    if (!this.myForm.valid) {
      return;
    }
    if (this.action.toLowerCase() !== 'edit') {
      this.myForm.patchValue({ id: null });
      this.myForm.patchValue({ receive_date: this.myForm.value.transfer_date });
    };
    const params = {
      //action: this.action === 'edit' ? 'post' : 'put',
      //module: 'wh_transfer',
      form: this.myForm.value,
    };
    const endpoint=  this.action === 'edit' ? 'wh_transfer/post' : 'wh_transfer/put';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          create_date: answer.wh_transfer.create_date,
          id: Number(answer.wh_transfer.id)
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
      //module: 'wh_transfer',
      id: Number(this.data.id),
    };
    const endpoint= 'wh_transfer/getById';
    await  this.AC.post(params,endpoint).subscribe(async (answer: any) => {
      this.myForm.patchValue(
        {
          wh_order_id: Number(answer.wh_transfer.wh_order_id),
          product_id: Number(answer.wh_transfer.product_id),
          transfer_qty: Number(answer.wh_transfer.transfer_qty),
          receive_qty: Number(answer.wh_transfer.receive_qty),
          new_wh_id: Number(answer.wh_transfer.new_wh_id),
          transfer_date: answer.wh_transfer.transfer_date,
          transfer_by: answer.wh_transfer.transfer_by,
          receive_date: answer.wh_transfer.receive_date,
          receive_by: answer?.wh_transfer?.receive_by.length == 0
            ? this.currentUserName : answer.wh_transfer.receive_by.trim(),
          notes: answer.wh_transfer.notes,
          id: Number(answer.wh_transfer.id)
        });
      this.selected_product_id = Number(answer.wh_transfer.product_id);
      this.selected_new_wh_id = Number(answer.wh_transfer.new_wh_id);
      //console.log(this.product_id.selectedItems);
      let changeData = [] = this.product_id?.selectedValues; // = {product_id: 0,available};
      // changeData["product_id"] = this.product_id.selectedValues.product_id;
      changeData["available"] = Number(answer.wh_transfer.transfer_qty);
      changeData["product_id"] = Number(answer.wh_transfer.product_id)
      // this.product_id.changeEvent.emit();
      // this.product_id.c
      this.qtyBeingEdited =  Number(answer.wh_transfer.transfer_qty);
      this.getAvailableQty(changeData);

      this.product_id.focus();
      // this.product_id.changeEvent.emit();
      // this.onAdd.emit();
      await this.getmaxToTransfer(this.current_warehouse_id, answer.wh_transfer.product_id).then((maxToTransfer) => {
        // alert(maxToTransfer);
        this.validateReceivedQty();
        this.validateTransferQty();
      });
      this.changeRef.detectChanges();
    });
  }

  async getWareHouseByID() {
    const params={
      id: Number(this.id),
    };
    const endpoint=  'wh_orders/getById';
    this.suppliers$ = await this.AC.post(params,endpoint);
    this.suppliers$.subscribe((answer) => {
      this.listOfSuppliers = answer.suppliers.map((arr) => {
        arr.id = Number(arr.id);
        this.changeRef.detectChanges();
        return arr;
      });
    });
  }
  
}
