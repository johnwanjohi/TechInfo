import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { BehaviorSubject, ReplaySubject, Observable, Subject } from 'rxjs';

import { Store } from '@ngrx/store';
import { shareReplay, takeUntil } from 'rxjs/operators';
import * as fromRoot from '../app-state';
import { Router } from '@angular/router';
import * as storage from '../app-state/state/storage';
import { environment } from '../../../environments/environment';
import { MtxGridColumn } from '@ng-matero/extensions/grid';

// export type ReadingTabs = 'EQUIPMENTS' | 'TECHNOTES' | 'SERVICES';

// export interface ITabs {
//   currentTab: ReadingTabs;
// }

export const macRegex = "^[a-fA-F0-9]{2}(?:[:-]?[a-fA-F0-9]{2}){5}(?:,[a-fA-F0-9]{2}(?:[:-]?[a-fA-F0-9]{2}){5})*$";

export const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
// tslint:disable-next-line:quotemark
export const emailRegex = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

export const ipRegex = "^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$";
// export const _macRegex = "^((([a-fA-F0-9]){1,2})\\.){5}(([a-fA-F0-9]){1,2})$";
export const _macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
// /^[a-fA-F0-9]{2}(?:[:-]?[a-fA-F0-9]{2}){5}(?:,[a-fA-F0-9]{2}(?:[:-]?[a-fA-F0-9]{2}){5})*$/

export interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  role: string;
  token: string;
  message: string;
  logged: boolean;
}

@Injectable({
  providedIn: 'root',
})

export class AccountsService {
  user_id: ReplaySubject<number>;
  userDetails = new BehaviorSubject<any>([]);
  loggedInUser = this.userDetails.asObservable();
  isLoggedIn: boolean;
  loggedInUserRole: any;
  // mainTabAreaActiveTab = new BehaviorSubject<ITabs>({ currentTab: 'EQUIPMENTS' });
  // currentActiveTab = this.mainTabAreaActiveTab.asObservable();

  public systemType: Subject<any> = new BehaviorSubject<any>(null);

  customer_id: ReplaySubject<number>;
  new_customer: ReplaySubject<object>;
  updated_customer: ReplaySubject<object>;
  deleted_customer: ReplaySubject<object>;
  site_customer_id: ReplaySubject<number>;

  site_id: ReplaySubject<number>;
  new_site: ReplaySubject<object>;
  updated_site: ReplaySubject<object>;
  deleted_site: ReplaySubject<object>;

  contact_id: ReplaySubject<number>;
  new_contact: ReplaySubject<object>;
  updated_contact: ReplaySubject<object>;
  deleted_contact: ReplaySubject<object>;

  supplier_id: ReplaySubject<number>;
  new_supplier: ReplaySubject<object>;
  updated_supplier: ReplaySubject<object>;
  deleted_supplier: ReplaySubject<object>;

  suppliercontact_id: ReplaySubject<number>;
  new_suppliercontact: ReplaySubject<object>;
  updated_suppliercontact: ReplaySubject<object>;
  deleted_suppliercontact: ReplaySubject<object>;

  brand_id: ReplaySubject<number>;
  new_brand: ReplaySubject<object>;
  updated_brand: ReplaySubject<object>;
  deleted_brand: ReplaySubject<object>;

  category_id: ReplaySubject<number>;
  new_category: ReplaySubject<object>;
  updated_category: ReplaySubject<object>;
  deleted_category: ReplaySubject<object>;

  type_id: ReplaySubject<number>;
  new_type: ReplaySubject<object>;
  updated_type: ReplaySubject<object>;
  deleted_type: ReplaySubject<object>;
  type_category_id: ReplaySubject<number>;

  product_id: ReplaySubject<number>;
  new_product: ReplaySubject<object>;
  updated_product: ReplaySubject<object>;
  deleted_product: ReplaySubject<object>;

  sub_id: ReplaySubject<number>;
  new_sub: ReplaySubject<object>;
  updated_sub: ReplaySubject<object>;
  deleted_sub: ReplaySubject<object>;

  subcontact_id: ReplaySubject<number>;
  new_subcontact: ReplaySubject<object>;
  updated_subcontact: ReplaySubject<object>;
  deleted_subcontact: ReplaySubject<object>;

  branch_id: ReplaySubject<number>;
  new_branch: ReplaySubject<object>;
  updated_branch: ReplaySubject<object>;
  deleted_branch: ReplaySubject<object>;

  warehouse_id: ReplaySubject<number>;
  new_warehouse: ReplaySubject<object>;
  updated_warehouse: ReplaySubject<object>;
  deleted_warehouse: ReplaySubject<object>;
  whorder_warehouse_id: ReplaySubject<number>;

  selectedOrderStatusID: ReplaySubject<number>;

  whorder_id: ReplaySubject<number>;
  new_whorder: ReplaySubject<object>;
  updated_whorder: ReplaySubject<object>;
  deleted_whorder: ReplaySubject<object>;

  wh_supplierstock_id: ReplaySubject<number>;
  new_wh_supplierstock: ReplaySubject<object>;
  updated_wh_supplierstock: ReplaySubject<object>;
  deleted_wh_supplierstock: ReplaySubject<object>;

  wh_supplierreturn_id: ReplaySubject<number>;
  new_wh_supplierreturn: ReplaySubject<object>;
  updated_wh_supplierreturn: ReplaySubject<object>;
  deleted_wh_supplierreturn: ReplaySubject<object>;

  wh_adjustment_id: ReplaySubject<number>;
  new_wh_adjustment: ReplaySubject<object>;
  updated_wh_adjustment: ReplaySubject<object>;
  deleted_wh_adjustment: ReplaySubject<object>;

  systeminfo_site_id: ReplaySubject<number>;

  systemserver_id: ReplaySubject<number>;
  new_systemserver: ReplaySubject<object>;
  updated_systemserver: ReplaySubject<object>;
  deleted_systemserver: ReplaySubject<object>;

  systemdevice_id: ReplaySubject<number>;
  new_systemdevice: ReplaySubject<object>;
  updated_systemdevice: ReplaySubject<object>;
  deleted_systemdevice: ReplaySubject<object>;

  systemdoor_id: ReplaySubject<number>;
  new_systemdoor: ReplaySubject<object>;
  updated_systemdoor: ReplaySubject<object>;
  deleted_systemdoor: ReplaySubject<object>;

  license_id: ReplaySubject<number>;
  new_license: ReplaySubject<object>;
  updated_license: ReplaySubject<object>;
  deleted_license: ReplaySubject<object>;

  remote_access_id: ReplaySubject<number>;
  new_remote_access: ReplaySubject<object>;
  updated_remote_access: ReplaySubject<object>;
  deleted_remote_access: ReplaySubject<object>;

  sitenote_id: ReplaySubject<number>;
  new_sitenote: ReplaySubject<object>;
  updated_sitenote: ReplaySubject<object>;
  deleted_sitenote: ReplaySubject<object>;

  path: string;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient, private store: Store, private router: Router) {

    // this.path = 'http://10.10.10.30:8888/Inventory_v5.0/inventory/init.php';

    this.path = environment.path;

    this.user_id = new ReplaySubject(1);

    this.customer_id = new ReplaySubject(1);
    this.site_customer_id = new ReplaySubject(1);
    this.updated_customer = new ReplaySubject(1);
    this.new_customer = new ReplaySubject(1);
    this.deleted_customer = new ReplaySubject(1);

    this.site_id = new ReplaySubject(1);
    this.updated_site = new ReplaySubject(1);
    this.new_site = new ReplaySubject(1);
    this.deleted_site = new ReplaySubject(1);

    this.contact_id = new ReplaySubject(1);
    this.updated_contact = new ReplaySubject(1);
    this.new_contact = new ReplaySubject(1);
    this.deleted_contact = new ReplaySubject(1);

    this.supplier_id = new ReplaySubject(1);
    this.updated_supplier = new ReplaySubject(1);
    this.new_supplier = new ReplaySubject(1);
    this.deleted_supplier = new ReplaySubject(1);

    this.suppliercontact_id = new ReplaySubject(1);
    this.updated_suppliercontact = new ReplaySubject(1);
    this.new_suppliercontact = new ReplaySubject(1);
    this.deleted_suppliercontact = new ReplaySubject(1);

    this.brand_id = new ReplaySubject(1);
    this.updated_brand = new ReplaySubject(1);
    this.new_brand = new ReplaySubject(1);
    this.deleted_brand = new ReplaySubject(1);

    this.category_id = new ReplaySubject(1);
    this.updated_category = new ReplaySubject(1);
    this.new_category = new ReplaySubject(1);
    this.deleted_category = new ReplaySubject(1);

    this.type_id = new ReplaySubject(1);
    this.type_category_id = new ReplaySubject(1);
    this.updated_type = new ReplaySubject(1);
    this.new_type = new ReplaySubject(1);
    this.deleted_type = new ReplaySubject(1);

    this.product_id = new ReplaySubject(1);
    this.updated_product = new ReplaySubject(1);
    this.new_product = new ReplaySubject(1);
    this.deleted_product = new ReplaySubject(1);

    this.sub_id = new ReplaySubject(1);
    this.updated_sub = new ReplaySubject(1);
    this.new_sub = new ReplaySubject(1);
    this.deleted_sub = new ReplaySubject(1);

    this.subcontact_id = new ReplaySubject(1);
    this.updated_subcontact = new ReplaySubject(1);
    this.new_subcontact = new ReplaySubject(1);
    this.deleted_subcontact = new ReplaySubject(1);

    this.branch_id = new ReplaySubject(1);
    this.updated_branch = new ReplaySubject(1);
    this.new_branch = new ReplaySubject(1);
    this.deleted_branch = new ReplaySubject(1);

    this.warehouse_id = new ReplaySubject(1);
    this.whorder_warehouse_id = new ReplaySubject(1);
    this.updated_warehouse = new ReplaySubject(1);
    this.new_warehouse = new ReplaySubject(1);
    this.deleted_warehouse = new ReplaySubject(1);

    this.whorder_id = new ReplaySubject(1);
    this.updated_whorder = new ReplaySubject(1);
    this.new_whorder = new ReplaySubject(1);
    this.deleted_whorder = new ReplaySubject(1);

    this.wh_supplierstock_id = new ReplaySubject(1);
    this.updated_wh_supplierstock = new ReplaySubject(1);
    this.new_wh_supplierstock = new ReplaySubject(1);
    this.deleted_wh_supplierstock = new ReplaySubject(1);

    this.wh_supplierreturn_id = new ReplaySubject(1);
    this.updated_wh_supplierreturn = new ReplaySubject(1);
    this.new_wh_supplierreturn = new ReplaySubject(1);
    this.deleted_wh_supplierreturn = new ReplaySubject(1);

    this.wh_adjustment_id = new ReplaySubject(1);
    this.updated_wh_adjustment = new ReplaySubject(1);
    this.new_wh_adjustment = new ReplaySubject(1);
    this.deleted_wh_adjustment = new ReplaySubject(1);
    this.systeminfo_site_id = new ReplaySubject(1);

    this.systemserver_id = new ReplaySubject(1);
    this.updated_systemserver = new ReplaySubject(1);
    this.new_systemserver = new ReplaySubject(1);
    this.deleted_systemserver = new ReplaySubject(1);

    this.systemdevice_id = new ReplaySubject(1);
    this.updated_systemdevice = new ReplaySubject(1);
    this.new_systemdevice = new ReplaySubject(1);
    this.deleted_systemdevice = new ReplaySubject(1);

    this.systemdoor_id = new ReplaySubject(1);
    this.updated_systemdoor = new ReplaySubject(1);
    this.new_systemdoor = new ReplaySubject(1);
    this.deleted_systemdoor = new ReplaySubject(1);

    this.license_id = new ReplaySubject(1);
    this.updated_license = new ReplaySubject(1);
    this.new_license = new ReplaySubject(1);
    this.deleted_license = new ReplaySubject(1);

    this.remote_access_id = new ReplaySubject(1);
    this.updated_remote_access = new ReplaySubject(1);
    this.new_remote_access = new ReplaySubject(1);
    this.deleted_remote_access = new ReplaySubject(1);

    this.sitenote_id = new ReplaySubject(1);
    this.updated_sitenote = new ReplaySubject(1);
    this.new_sitenote = new ReplaySubject(1);
    this.deleted_sitenote = new ReplaySubject(1);
  }
  post(params,endPoint="") {
    // const headers = new Headers({
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'Authorization': 'Bearer ' + this.Auth['user']['token']
    // });
    // const options = new RequestOptions({headers: headers});
    // return this.http.get(getPostApi, {headers: headers});

    return this.http.post(this.path+endPoint, params, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  window.localStorage.getItem('token')
      },
    }).pipe(
      shareReplay()
    );
  }
  get(params,endPoint="") {
    return this.http.get(this.path+endPoint, {
      params: params,
    }).pipe(
      shareReplay()
    );
  }
  // Functions for Login
  login(loginData) {
    console.log(loginData);
    return this.http.post(this.path+"login", loginData);
  }
  checkIfLoggedIn() {
    this.store.select(fromRoot.userLogin).pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      if (data.isLoadingSuccess && data.result?.users?.length !== 0) {
        window.localStorage.setItem('token', data.result?.users?.token);

        this.router.navigate(['/dashboard']);
      }
    });
  }
  setLoggedIn(status: boolean) {
    this.isLoggedIn = status;
  }
  getUsers() {
    return this.http.get(this.path);
  }
  getUserById(user_id) {
    return this.http.get(this.path, user_id);
  }

  // setCurrentTab(tab: ITabs) {
  //   this.mainTabAreaActiveTab.next({ currentTab: tab.currentTab });
  // }

  // Functions for Customers
  setCustomer(customer_id) {
    this.customer_id.next(customer_id);
  }
  customerObserver() {
    return this.customer_id;
  }
  setSiteCustomer(customer_id) {
    this.site_customer_id.next(customer_id);
  }
  siteCustomerObserver() {
    return this.site_customer_id;
  }
  setUpdateCustomer(customer) {
    this.updated_customer.next(customer);
  }
  updatedCustomerObserver() {
    return this.updated_customer;
  }
  setNewCustomer(customer_id) {
    this.new_customer.next(customer_id);
  }
  newCustomerObserver() {
    return this.new_customer;
  }
  setDeletedCustomer(customer_id) {
    this.deleted_customer.next(customer_id);
  }
  deletedCustomerObserver() {
    return this.deleted_customer;
  }

  // Functions for Sites
  setSite(site_id) {
    this.site_id.next(site_id);
  }
  siteObserver() {
    return this.site_id;
  }
  setUpdateSite(site_id) {
    this.updated_site.next(site_id);
  }
  updatedSiteObserver() {
    return this.updated_site;
  }
  setNewSite(site) {
    this.new_site.next(site);
  }
  newSiteObserver() {
    return this.new_site;
  }
  setDeletedSite(site_id) {
    this.deleted_site.next(site_id);
  }
  deletedSiteObserver() {
    return this.deleted_site;
  }

  // Functions for Contacts
  setContact(contact_id) {
    this.site_id.next(contact_id);
  }
  contactObserver() {
    return this.contact_id;
  }
  setNewContact(contact) {
    this.new_contact.next(contact);
  }
  newContactObserver() {
    return this.new_contact;
  }
  setUpdatedContact(contact) {
    this.updated_contact.next(contact);
  }
  updatedContactObserver() {
    return this.updated_contact;
  }
  setDeletedContact(contact_id) {
    this.deleted_contact.next(contact_id);
  }
  deletedContactObserver() {
    return this.deleted_contact;
  }

  // Functions for Suppliers
  setSupplier(supplier_id) {
    this.supplier_id.next(supplier_id);
  }
  supplierObserver() {
    return this.supplier_id;
  }
  setUpdateSupplier(supplier) {
    this.updated_supplier.next(supplier);
  }
  updatedSupplierObserver() {
    return this.updated_supplier;
  }
  setNewSupplier(supplier_id) {
    this.new_supplier.next(supplier_id);
  }
  newSupplierObserver() {
    return this.new_supplier;
  }
  setDeletedSupplier(supplier_id) {
    this.deleted_supplier.next(supplier_id);
  }
  deletedSupplierObserver() {
    return this.deleted_supplier;
  }

  // Functions for SuppliersContacts
  setSuppliersContact(suppliercontact_id) {
    this.site_id.next(suppliercontact_id);
  }
  SuppliersContactObserver() {
    return this.suppliercontact_id;
  }
  setNewSuppliersContact(contact) {
    this.new_suppliercontact.next(contact);
  }
  newSuppliersContactObserver() {
    return this.new_suppliercontact;
  }
  setUpdatedSuppliersContact(contact) {
    this.updated_suppliercontact.next(contact);
  }
  updatedSuppliersContactObserver() {
    return this.updated_suppliercontact;
  }
  setDeletedSuppliersContact(contact_id) {
    this.deleted_suppliercontact.next(contact_id);
  }
  deletedSuppliersContactObserver() {
    return this.deleted_suppliercontact;
  }

  // Functions for Brands
  setBrand(brand_id) {
    this.brand_id.next(brand_id);
  }
  brandObserver() {
    return this.brand_id;
  }
  setUpdateBrand(brand) {
    this.updated_brand.next(brand);
  }
  updatedBrandObserver() {
    return this.updated_brand;
  }
  setNewBrand(brand_id) {
    this.new_brand.next(brand_id);
  }
  newBrandObserver() {
    return this.new_brand;
  }
  setDeletedBrand(brand_id) {
    this.deleted_brand.next(brand_id);
  }
  deletedBrandObserver() {
    return this.deleted_brand;
  }

  // Functions for Categories
  setCategory(category_id) {
    this.category_id.next(category_id);
  }
  categoryObserver() {
    return this.category_id;
  }
  setTypeCategory(category_id) {
    this.type_category_id.next(category_id);
  }
  typeCategoryObserver() {
    return this.type_category_id;
  }
  setUpdateCategory(category) {
    this.updated_category.next(category);
  }
  updatedCategoryObserver() {
    return this.updated_category;
  }
  setNewCategory(category_id) {
    this.new_category.next(category_id);
  }
  newCategoryObserver() {
    return this.new_category;
  }
  setDeletedCategory(category_id) {
    this.deleted_category.next(category_id);
  }
  deletedCategoryObserver() {
    return this.deleted_category;
  }

  // Functions for Types
  setType(type_id) {
    this.type_id.next(type_id);
  }
  typeObserver() {
    return this.type_id;
  }
  setUpdateType(type) {
    this.updated_type.next(type);
  }
  updatedTypeObserver() {
    return this.updated_type;
  }
  setNewType(type_id) {
    this.new_type.next(type_id);
  }
  newTypeObserver() {
    return this.new_type;
  }
  setDeletedType(type_id) {
    this.deleted_type.next(type_id);
  }
  deletedTypeObserver() {
    return this.deleted_type;
  }

  // Functions for Products
  setProduct(product_id) {
    this.product_id.next(product_id);
  }
  productObserver() {
    return this.product_id;
  }
  setUpdateProduct(product) {
    this.updated_product.next(product);
  }
  updatedProductObserver() {
    return this.updated_product;
  }
  setNewProduct(product_id) {
    this.new_product.next(product_id);
  }
  newProductObserver() {
    return this.new_product;
  }
  setDeletedProduct(product_id) {
    this.deleted_product.next(product_id);
  }
  deletedProductObserver() {
    return this.deleted_product;
  }

  // Functions for Subs
  setSub(sub_id) {
    this.sub_id.next(sub_id);
  }
  subObserver() {
    return this.sub_id;
  }
  setUpdateSub(sub) {
    this.updated_sub.next(sub);
  }
  updatedSubObserver() {
    return this.updated_sub;
  }
  setNewSub(sub_id) {
    this.new_sub.next(sub_id);
  }
  newSubObserver() {
    return this.new_sub;
  }
  setDeletedSub(sub_id) {
    this.deleted_sub.next(sub_id);
  }
  deletedSubObserver() {
    return this.deleted_sub;
  }

  // Functions for SubsContacts
  setSubsContact(suppliercontact_id) {
    this.site_id.next(suppliercontact_id);
  }
  SubsContactObserver() {
    return this.suppliercontact_id;
  }
  setNewSubsContact(contact) {
    this.new_suppliercontact.next(contact);
  }
  newSubsContactObserver() {
    return this.new_suppliercontact;
  }
  setUpdatedSubsContact(contact) {
    this.updated_suppliercontact.next(contact);
  }
  updatedSubsContactObserver() {
    return this.updated_suppliercontact;
  }
  setDeletedSubsContact(contact_id) {
    this.deleted_suppliercontact.next(contact_id);
  }
  deletedSubsContactObserver() {
    return this.deleted_suppliercontact;
  }

  // Functions for Branches
  setBranch(branch_id) {
    this.branch_id.next(branch_id);
  }
  branchObserver() {
    return this.branch_id;
  }
  setUpdateBranch(branch_id) {
    this.updated_branch.next(branch_id);
  }
  updatedBranchObserver() {
    return this.updated_branch;
  }
  setNewBranch(branch) {
    this.new_branch.next(branch);
  }
  newBranchObserver() {
    return this.new_branch;
  }
  setDeletedBranch(branch_id) {
    this.deleted_branch.next(branch_id);
  }
  deletedBranchObserver() {
    return this.deleted_branch;
  }

  // Functions for Warehouses
  setWarehouse(warehouse_id) {
    this.warehouse_id.next(warehouse_id);
  }
  warehouseObserver() {
    return this.warehouse_id;
  }
  setWhOrderWarehouse(warehouse_id) {
    this.whorder_warehouse_id.next(warehouse_id);
  }
  whorderWarehouseObserver() {
    return this.whorder_warehouse_id;
  }
  setUpdateWarehouse(warehouse_id) {
    this.updated_warehouse.next(warehouse_id);
  }
  updatedWarehouseObserver() {
    return this.updated_warehouse;
  }
  setNewWarehouse(warehouse) {
    this.new_warehouse.next(warehouse);
  }
  newWarehouseObserver() {
    return this.new_warehouse;
  }
  setDeletedWarehouse(warehouse_id) {
    this.deleted_warehouse.next(warehouse_id);
  }
  deletedWarehouseObserver() {
    return this.deleted_warehouse;
  }

  // Functions for WhOrders
  setWhOrder(whorder_id) {
    this.whorder_id.next(whorder_id);
  }
  whOrderObserver() {
    return this.whorder_id;
  }
  setUpdateWhOrder(whorder_id) {
    this.updated_whorder.next(whorder_id);
  }
  updatedWhOrderObserver() {
    return this.updated_whorder;
  }
  setNewWhOrder(whorder) {
    this.new_whorder.next(whorder);
  }
  newWhOrderObserver() {
    return this.new_whorder;
  }
  setDeletedWhOrder(whorder_id) {
    this.deleted_whorder.next(whorder_id);
  }
  deletedWhOrderObserver() {
    return this.deleted_whorder;
  }

  // Functions for WhSupplierStock
  setWhSupplierStock(wh_supplierstock_id) {
    this.wh_supplierstock_id.next(wh_supplierstock_id);
  }
  whSupplierStockObserver() {
    return this.wh_supplierstock_id;
  }
  setUpdateWhSupplierStock(wh_supplierstock_id) {
    this.updated_wh_supplierstock.next(wh_supplierstock_id);
  }
  updatedWhSupplierStock() {
    return this.updated_wh_supplierstock;
  }
  setNewWhSupplierStock(wh_supplierstock) {
    this.new_whorder.next(wh_supplierstock);
  }
  newWhSupplierStockObserver() {
    return this.new_wh_supplierstock;
  }
  setDeletedWhSupplierStock(wh_supplierstock_id) {
    this.deleted_wh_supplierstock.next(wh_supplierstock_id);
  }
  deletedWhSupplierStockObserver() {
    return this.deleted_wh_supplierstock;
  }

  // Functions for WhSupplierReturn
  setWhSupplierReturn(wh_supplierreturn_id) {
    this.wh_supplierreturn_id.next(wh_supplierreturn_id);
  }
  whSupplierReturnObserver() {
    return this.wh_supplierreturn_id;
  }
  setUpdateWhSupplierReturn(wh_supplierreturn_id) {
    this.updated_wh_supplierreturn.next(wh_supplierreturn_id);
  }
  updatedWhSupplierReturn() {
    return this.updated_wh_supplierreturn;
  }
  setNewWhSupplierReturn(wh_supplierreturn) {
    this.new_whorder.next(wh_supplierreturn);
  }
  newWhSupplierReturnObserver() {
    return this.new_wh_supplierreturn;
  }
  setDeletedWhSupplierReturn(wh_supplierreturn_id) {
    this.deleted_wh_supplierreturn.next(wh_supplierreturn_id);
  }
  deletedWhSupplierReturnObserver() {
    return this.deleted_wh_supplierreturn;
  }

  // Functions for WhAdjustment
  setWhAdjustment(wh_adjustment_id) {
    this.wh_adjustment_id.next(wh_adjustment_id);
  }
  whAdjustmentObserver() {
    return this.wh_adjustment_id;
  }
  setUpdateWhAdjustment(wh_adjustment_id) {
    this.updated_wh_adjustment.next(wh_adjustment_id);
  }
  updatedWhAdjustment() {
    return this.updated_wh_adjustment;
  }
  setNewWhAdjustment(wh_adjustment) {
    this.new_whorder.next(wh_adjustment);
  }
  newWhAdjustmentObserver() {
    return this.new_wh_adjustment;
  }
  setDeletedWhAdjustment(wh_adjustment_id) {
    this.deleted_wh_adjustment.next(wh_adjustment_id);
  }
  deletedWhAdjustmentObserver() {
    return this.deleted_wh_adjustment;
  }


  // Functions for System Info
  setSysteminfoSite(systeminfo_site_id) {
    this.systeminfo_site_id.next(systeminfo_site_id);
  }
  systeminfoSiteObserver() {
    return this.systeminfo_site_id;
  }

  // Functions for SystemServers
  setSystemServer(systemserver_id) {
    this.systemserver_id.next(systemserver_id);
  }
  systemServerObserver() {
    return this.systemserver_id;
  }
  setNewSystemServer(systemserver) {
    this.new_systemserver.next(systemserver);
  }
  newSystemServerObserver() {
    return this.new_systemserver;
  }
  setUpdatedSystemServer(systemserver) {
    this.updated_systemserver.next(systemserver);
  }
  updatedSystemServerObserver() {
    return this.updated_systemserver;
  }
  setDeletedSystemServer(systemserver_id) {
    this.deleted_systemserver.next(systemserver_id);
  }
  deletedSystemServerObserver() {
    return this.deleted_systemserver;
  }

  // Functions for SystemDevices
  setSystemDevice(systemdevice_id) {
    this.systemdevice_id.next(systemdevice_id);
  }
  systemDeviceObserver() {
    return this.systemdevice_id;
  }
  setNewSystemDevice(systemdevice) {
    this.new_systemdevice.next(systemdevice);
  }
  newSystemDeviceObserver() {
    return this.new_systemdevice;
  }
  setUpdatedSystemDevice(systemdevice) {
    this.updated_systemdevice.next(systemdevice);
  }
  updatedSystemDeviceObserver() {
    return this.updated_systemdevice;
  }
  setDeletedSystemDevice(systemdevice_id) {
    this.deleted_systemdevice.next(systemdevice_id);
  }
  deletedSystemDeviceObserver() {
    return this.deleted_systemdevice;
  }

  // Functions for SystemDoors
  setSystemDoor(systemdoor_id) {
    this.systemdoor_id.next(systemdoor_id);
  }
  systemDoorObserver() {
    return this.systemdoor_id;
  }
  setNewSystemDoor(systemdoor) {
    this.new_systemdoor.next(systemdoor);
  }
  newSystemDoorObserver() {
    return this.new_systemdoor;
  }
  setUpdatedSystemDoor(systemdoor) {
    this.updated_systemdoor.next(systemdoor);
  }
  updatedSystemDoorObserver() {
    return this.updated_systemdoor;
  }
  setDeletedSystemDoor(systemdoor_id) {
    this.deleted_systemdoor.next(systemdoor_id);
  }
  deletedSystemDoorObserver() {
    return this.deleted_systemdoor;
  }

  // Functions for Licenses
  setLicense(license_id) {
    this.license_id.next(license_id);
  }
  licenseObserver() {
    return this.license_id;
  }
  setNewLicense(license) {
    this.new_license.next(license);
  }
  newLicenseObserver() {
    return this.new_license;
  }
  setUpdatedLicense(license) {
    this.updated_license.next(license);
  }
  updatedLicenseObserver() {
    return this.updated_license;
  }
  setDeletedLicense(license_id) {
    this.deleted_license.next(license_id);
  }
  deletedLicenseObserver() {
    return this.deleted_license;
  }

  // Functions for Remote Access
  setRemoteAccess(remote_access_id) {
    this.remote_access_id.next(remote_access_id);
  }
  remoteAccessObserver() {
    return this.remote_access_id;
  }
  setNewRemoteAccess(remote_access) {
    this.new_remote_access.next(remote_access);
  }
  newRemoteAccessObserver() {
    return this.new_remote_access;
  }
  setUpdatedRemoteAccess(remote_access) {
    this.updated_remote_access.next(remote_access);
  }
  updatedRemoteAccessObserver() {
    return this.updated_remote_access;
  }
  setDeletedRemoteAccess(remote_access_id) {
    this.deleted_remote_access.next(remote_access_id);
  }
  deletedRemoteAccessObserver() {
    return this.deleted_remote_access;
  }

  // Functions for Sitenotes
  setSiteNote(sitenote_id) {
    this.sitenote_id.next(sitenote_id);
  }
  siteNoteObserver() {
    return this.sitenote_id;
  }
  setUpdatedSiteNote(sitenote_id) {
    this.updated_sitenote.next(sitenote_id);
  }
  updatedSiteNoteObserver() {
    return this.updated_sitenote;
  }
  setNewSiteNote(sitenote) {
    this.new_sitenote.next(sitenote);
  }
  newSiteNoteObserver() {
    return this.new_sitenote;
  }
  setDeletedSiteNote(sitenote_id) {
    this.deleted_sitenote.next(sitenote_id);
  }
  deletedSiteNoteObserver() {
    return this.deleted_sitenote;
  }

  goToLink(urlToOpen: string) {
    // tslint:disable-next-line:no-inferrable-types
    let url: string = '';
    if (!/^http[s]?:\/\//.test(urlToOpen)) {
      url += 'http://';
    }
    url += urlToOpen;
    window.open(url, '_blank');
  }
  logout() {
    this.userDetails.next('');
    window.localStorage.clear();
    storage.clearStorage();
    this.router.navigate(['pages/login']).then(() => {
      window.location.reload();
    });
  }
  buttonItemName(selectedOrderTypeName) {
    switch (selectedOrderTypeName) {
      case 'Supplier Stock':
        return 'Supplier Stock';
      case 'Supplier Return':
        return 'Return Item';
      case 'Transfer':
        return 'Transfer Item';
      case 'Van Stock':
        return 'Van Stock Item';
      case 'Van Return':
        return 'Van Return Item';
      case 'Adjustment':
        return 'Adjustment Item';
      default:
        return 'Add Item';
    }
  }

}
