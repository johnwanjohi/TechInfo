import { Observable } from 'rxjs';
import { Order_types } from 'app/shared/models/index';
import { AccountsService } from 'app/shared/services/accounts.service';
import { SubscriptionsContainer } from 'app/shared/containers/subscriptions-container';
import { TransferComponent } from '../wh-orders-types/transfer/transfer.component';
import { VanStockComponent } from '../wh-orders-types/vanstock/vanstock.component';
import { VanReturnComponent } from '../wh-orders-types/vanreturn/vanreturn.component';
import { AdjustmentComponent } from '../wh-orders-types/adjustment/adjustment.component';
import { SupplierStockComponent } from '../wh-orders-types/supplierstock/supplierstock.component';
import { SupplierReturnComponent } from '../wh-orders-types/supplierreturn/supplierreturn.component';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, AfterContentChecked } from '@angular/core';


@Component({
  selector: 'app-wh-orders-details',
  templateUrl: './wh-orders-details.component.html',
  styleUrls: ['./wh-orders-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WhOrdersDetailsComponent implements OnInit, OnDestroy, AfterContentChecked {

  id: any;
  new_wh_id: number;
  wh_order_details: any;
  current_order_id: number;
  current_warehouse_id: number;
  warehouseHasIncomingProducts: boolean;
  wh_orders$: Observable<any>;
  ordertypes$: Observable<any>;
  selected_ordertype: any = '';
  selectedOrderTypeName: any = '';
  listOfOrderTypes: Order_types[];
  subScriptions = new SubscriptionsContainer();
  displayReceive: boolean;

  @ViewChild(TransferComponent, { static: false }) wh_Transfer: TransferComponent;
  @ViewChild(VanStockComponent, { static: false }) wh_VanStock: VanStockComponent;
  @ViewChild(VanReturnComponent, { static: false }) wh_VanReturn: VanReturnComponent;
  @ViewChild(AdjustmentComponent, { static: false }) wh_Adjustment: AdjustmentComponent;
  @ViewChild(SupplierStockComponent, { static: false }) wh_SupplierStock: SupplierStockComponent;
  @ViewChild(SupplierReturnComponent, { static: false }) wh_SupplierReturn: SupplierReturnComponent;


  constructor(
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.displayReceive = false;
    this.getOrderTypes();
    this.getSelectedOrderTypeName();
    this.subScriptions.add=this.AC.whorder_id.subscribe((wh_order_id) => {
      this.current_order_id = wh_order_id;
      this.selectedOrderTypeName = '';
      if (this.current_order_id) {
        this.getSelectedOrderDetails(this.current_order_id, 'oninit').then(() => {
          // //console.log(`on init ${this.current_order_id}`);
          this.selectedOrderTypeName = this.getSelectedOrderTypeName();
          ////console.log(this.selectedOrderTypeName);
          this.changeRef.detectChanges();
        });
      }
    });
    this.subScriptions.add=this.AC.warehouseObserver().subscribe((id) => {
      this.current_warehouse_id = Number(id);
      this.checkOderType();
    });
  }
  checkOderType(){
    const params = {
      warehouse_id : this.current_warehouse_id
    };
    const endpoint='wh_orders/getAllWhOrdersByWarehouseId';
    this.AC.post(
      params,endpoint
      // {module:'warehouses',action:'getById',id: this.current_warehouse_id}
    ).subscribe((data)=>{
      // console.log(data);
      /// alert(JSON.stringify(data));
      let whData = data as any;
      if (whData.wh_orders) {
        let fOrders = whData.wh_orders.filter((d) => d?.id === this.current_order_id);

        this.warehouseHasIncomingProducts = fOrders[0]?.order_type === 'Transfer In'? true : false ;
        this.selectedOrderTypeName = fOrders[0]?.order_type;
        return this.selectedOrderTypeName;
      }
      this.new_wh_id = this.current_warehouse_id;
    });
  }
  ngAfterContentChecked() {
    this.changeRef.detectChanges();
  }
  ngOnDestroy(): void {
    this.subScriptions.dispose();
  }
  getSelectedOrderTypeName() {
    if (this.listOfOrderTypes?.length !== 0) {
      this.selectedOrderTypeName = '';
      this.selectedOrderTypeName = this.listOfOrderTypes?.find(items => items.id === Number(this.selected_ordertype))?.order_type;
    }
    this.checkOderType();
    this.changeRef.detectChanges();
    return this.selectedOrderTypeName;
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
        this.changeRef.detectChanges();
        return arr;
      })
    });
  }

  async getSelectedOrderDetails(current_order_id?, calledBy?) {
    const params = {
      //action: 'getById',
      //module: 'wh_orders',
      id: Number(current_order_id),
    };
    const endpoint=  'wh_orders/getById';
    this.wh_orders$ = await this.AC.post(params,endpoint);
    this.wh_orders$.subscribe((answer: any) => {
      if (answer) {
        this.selectedOrderTypeName = answer.wh_order.order_type;
        ////console.log(`${answer.wh_order.order_type} called by ${calledBy}`);
        this.changeRef.detectChanges();
      }
    });
  }
}
