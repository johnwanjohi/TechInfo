import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Brands, Order_types, UsersData, WarehouseOrdersData} from '../../../../shared/models';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountsService} from '../../../../shared/services/accounts.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormcontrolsService} from '../../../../shared/services/formcontrols.service';
import {VanReturnComponent} from '../vanreturn.component';

@Component({
  selector: 'app-add-edit-vanreturn',
  templateUrl: './add-edit-vanreturn.component.html',
  styleUrls: ['./add-edit-vanreturn.component.scss']
})
export class AddEditVanReturnComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(VanReturnComponent, { static: false }) vanReturnList;
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
    public dialogRef: MatDialogRef<AddEditVanReturnComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private changeRef: ChangeDetectorRef,
    private formService: FormcontrolsService
  ) {
    this.action = this.data.action;
    this.AC.loggedInUser.subscribe((userDetails) => {
      this.currentUserName = userDetails.username;
    });

    this.current_w_order_id = data?.wh_order_id;
    this.selected_branch = data?.warehouse_id;
    this.getProducts().then(() => {
      this.getListOfUsers();
    })      .then(() => {
        this.initializeForm();
      }).then(() => {
      if (this.action === 'edit') {
        this.getItemByID();
      }
    });
  }
  initializeForm() {
    this.myForm = new FormGroup({
      wh_order_id: new FormControl(Number(this.current_w_order_id), Validators.required),
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
      //action: 'getAll',
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
     // module: 'wh_vanreturn',
      form: this.myForm.value,
    };
    const endpoint= this.action === 'edit' ? 'wh_vanreturn/post' : 'wh_vanreturn/put';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          return_date: answer.wh_vanreturn.return_date,
          id: Number(answer.wh_vanreturn.id)
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
        this.closeDialog('Refresh');
      }, 50);
    });
  }
  Cancel() {
    this.closeDialog('Cancel');
    // this.router.navigate(['/warehouses']);
  }


  closeDialog(eventTask: any) {
    this.dialogRef.close({ event: eventTask });
  }

  onClose() {
    this.closeDialog('Cancel');
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
      //module: 'wh_vanreturn',
      id: Number(this.data.id),
    };
    const endpoint= 'wh_vanreturn/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          wh_order_id: Number(answer.wh_vanreturn.wh_order_id),
          product_id: Number(answer.wh_vanreturn.product_id),
          return_qty: Number(answer.wh_vanreturn.return_qty),
          return_by: answer.wh_vanreturn.return_by,
          return_date: answer.wh_vanreturn.return_date,
          van: answer.wh_vanreturn.van,
          notes: answer.wh_vanreturn.notes,
          id: Number(answer.wh_vanreturn.id)
        });
      this.selected_product_id = Number(answer.wh_vanreturn.product_id);
      setTimeout(() => {
        this.onAdd.emit();

        this.changeRef.detectChanges();
      }, 50);
    });
  }

}
