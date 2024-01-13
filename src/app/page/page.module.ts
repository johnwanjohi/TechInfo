import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MtxGridModule } from '@ng-matero/extensions/grid';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { PageRoutingModule } from './page-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ngx-custom-validators';
import { AppMaterialModule } from '../app-material/app-material.module';

import { PageComponent } from './page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountsComponent } from './accounts/accounts.component';

import { CustomersComponent } from './customers/customers.component';
import { DeleteCustomerComponent } from './customers/delete-customer/delete-customer.component';
import { SummaryCustomerComponent } from './customers/summary-customer/summary-customer.component';

import { SitesComponent } from './sites/sites.component';
import { DeleteSiteComponent } from './sites/delete-site/delete-site.component';
import { SummarySiteComponent } from './sites/summary-site/summary-site.component';

import { ContactsComponent } from './contacts/contacts.component';
import { DeleteContactComponent } from './contacts/delete-contact/delete-contact.component';
import { SummaryContactComponent } from './contacts/summary-contact/summary-contact.component';

import { SubsinfoComponent } from './subsinfo/subsinfo.component';

import { SubsComponent } from './subs/subs.component';
import { DeleteSubComponent } from './subs/delete-sub/delete-sub.component';
import { SummarySubComponent } from './subs/summary-sub/summary-sub.component';

import { SubscontactsComponent } from './subscontacts/subscontacts.component';
import { DeleteSubcontactComponent } from './subscontacts/delete-subcontact/delete-subcontact.component';
import { SummarySubcontactComponent } from './subscontacts/summary-subcontact/summary-subcontact.component';


import { InventoryComponent } from './inventory/inventory.component';

import { BrandsComponent } from './brands/brands.component';
import { DeleteBrandComponent } from './brands/delete-brand/delete-brand.component';

import { CategoriesComponent } from './categories/categories.component';
import { DeleteCategoryComponent } from './categories/delete-category/delete-category.component';

import { TypesComponent } from './types/types.component';
import { DeleteTypeComponent } from './types/delete-type/delete-type.component';

import { ProductsComponent } from './products/products.component';
import { AddEditProductComponent } from './products/add-edit-product/add-edit-product.component';
import { DeleteProductComponent } from './products/delete-product/delete-product.component';

import { SuppliersinfoComponent } from './suppliersinfo/suppliersinfo.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { DeleteSupplierComponent } from './suppliers/delete-supplier/delete-supplier.component';
import { SummarySupplierComponent } from './suppliers/summary-supplier/summary-supplier.component';

import { SupplierscontactsComponent } from './supplierscontacts/supplierscontacts.component';
import { DeleteSuppliercontactComponent } from './supplierscontacts/delete-suppliercontact/delete-suppliercontact.component';
import { SummarySuppliercontactComponent } from './supplierscontacts/summary-suppliercontact/summary-suppliercontact.component';

import { PackagesinfoComponent } from './packagesinfo/packagesinfo.component';

import { PackagesComponent } from './packages/packages.component';
import { DeletePackageComponent } from './packages/delete-package/delete-package.component';
import { SummaryPackageComponent } from './packages/summary-package/summary-package.component';

import { JobsinfoComponent } from './jobsinfo/jobsinfo.component';

import { JobsComponent } from './jobs/jobs.component';
import { DeleteJobComponent } from './jobs/delete-job/delete-job.component';
import { SummaryJobComponent } from './jobs/summary-job/summary-job.component';

import { WarehousesComponent } from './warehouses/warehouses.component';

import { BranchesComponent } from './branches/branches.component';
import { DeleteBranchComponent } from './branches/delete-branch/delete-branch.component';


import { WhOrdersDetailsComponent } from './wh-orders-details/wh-orders-details.component';

import { AddEditWarehouseComponent } from './warehouses/add-edit-warehouse/add-edit-warehouse.component';
import { DeleteWarehouseComponent } from './warehouses/delete-warehouse/delete-warehouse.component';
import { AddEditCustomerComponent } from './customers/add-edit-customer/add-edit-customer.component';
import { AddEditSiteComponent } from './sites/add-edit-site/add-edit-site.component';
import { AddEditContactComponent } from './contacts/add-edit-contact/add-edit-contact.component';
import { AddEditSubComponent } from './subs/add-edit-sub/add-edit-sub.component';
import { AddEditSubcontactComponent } from './subscontacts/add-edit-subcontact/add-edit-subcontact.component';
import { AddEditSupplierComponent } from './suppliers/add-edit-supplier/add-edit-supplier.component';
import { AddEditSuppliercontactComponent } from './supplierscontacts/add-edit-suppliercontact/add-edit-suppliercontact.component';
import { AddEditBrandComponent } from './brands/add-edit-brand/add-edit-brand.component';
import { AddEditCategoryComponent } from './categories/add-edit-category/add-edit-category.component';
import { AddEditTypeComponent } from './types/add-edit-type/add-edit-type.component';
import { WarehouseinfoComponent } from './warehouseinfo/warehouseinfo.component';
import { WhStockComponent } from './wh-stock/wh-stock.component';
import { SupplierStockComponent } from './wh-orders-types/supplierstock/supplierstock.component';
import { AddEditSupplierStockComponent } from './wh-orders-types/supplierstock/add-edit-supplierstock/add-edit-supplierstock.component';
import { DeleteSupplierStockComponent } from './wh-orders-types/supplierstock/delete-supplierstock/delete-supplierstock.component';
import { SupplierReturnComponent } from './wh-orders-types/supplierreturn/supplierreturn.component';
import { AddEditSupplierReturnComponent } from './wh-orders-types/supplierreturn/add-edit-supplierreturn/add-edit-supplierreturn.component';
import { DeleteSupplierReturnComponent } from './wh-orders-types/supplierreturn/delete-supplierreturn/delete-supplierreturn.component';
import { VanStockComponent } from './wh-orders-types/vanstock/vanstock.component';
import { AddEditVanStockComponent } from './wh-orders-types/vanstock/add-edit-vanstock/add-edit-vanstock.component';
import { DeleteVanStockComponent } from './wh-orders-types/vanstock/delete-vanstock/delete-vanstock.component';
import { VanReturnComponent } from './wh-orders-types/vanreturn/vanreturn.component';
import { AddEditVanReturnComponent } from './wh-orders-types/vanreturn/add-edit-vanreturn/add-edit-vanreturn.component';
import { DeleteVanReturnComponent } from './wh-orders-types/vanreturn/delete-vanreturn/delete-vanreturn.component';
import { TransferComponent } from './wh-orders-types/transfer/transfer.component';
import { AddEditTransferComponent } from './wh-orders-types/transfer/add-edit-transfer/add-edit-transfer.component';
import { DeleteTransferComponent } from './wh-orders-types/transfer/delete-transfer/delete-transfer.component';
import { AdjustmentComponent } from './wh-orders-types/adjustment/adjustment.component';
import { AddEditAdjustmentComponent } from './wh-orders-types/adjustment/add-edit-adjustment/add-edit-adjustment.component';
import { DeleteAdjustmentComponent } from './wh-orders-types/adjustment/delete-adjustment/delete-adjustment.component';
import {WhOrdersComponent} from './wh-orders/wh-orders.component';
import {AddEditWhOrderComponent} from './wh-orders/add-edit-wh-order/add-edit-wh-order.component';
import {DeleteWhOrderComponent} from './wh-orders/delete-wh-order/delete-wh-order.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  imports: [
    CommonModule,
    PageRoutingModule,
    NgbModule,
    NgxMaskModule.forRoot(maskConfig),
    CustomFormsModule,
    AppMaterialModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    MtxGridModule
  ],
  exports: [],
  declarations: [
    PageComponent,
    DashboardComponent,
    AccountsComponent,
    CustomersComponent,
    DeleteCustomerComponent,
    SummaryCustomerComponent,
    SitesComponent,
    DeleteSiteComponent,
    SummarySiteComponent,
    ContactsComponent,
    DeleteContactComponent,
    SummaryContactComponent,
    SubsinfoComponent,
    SubsComponent,
    DeleteSubComponent,
    SummarySubComponent,
    SubscontactsComponent,
    DeleteSubcontactComponent,
    SummarySubcontactComponent,
    DeleteBranchComponent,
    InventoryComponent,
    BrandsComponent,
    DeleteBrandComponent,
    CategoriesComponent,
    DeleteCategoryComponent,
    TypesComponent,
    DeleteTypeComponent,
    ProductsComponent,
    DeleteProductComponent,
    SuppliersinfoComponent,
    SuppliersComponent,
    DeleteSupplierComponent,
    SummarySupplierComponent,
    SupplierscontactsComponent,
    DeleteSuppliercontactComponent,
    SummarySuppliercontactComponent,
    PackagesinfoComponent,
    PackagesComponent,
    DeletePackageComponent,
    SummaryPackageComponent,
    JobsinfoComponent,
    JobsComponent,
    DeleteJobComponent,
    SummaryJobComponent,
    WarehousesComponent,
    BranchesComponent,
    WhOrdersDetailsComponent,
    AddEditWarehouseComponent,
    DeleteWarehouseComponent,
    AddEditProductComponent,
    AddEditCustomerComponent,
    AddEditSiteComponent,
    AddEditContactComponent,
    AddEditSubComponent,
    AddEditSubcontactComponent,
    AddEditSupplierComponent,
    AddEditSuppliercontactComponent,
    AddEditBrandComponent,
    AddEditCategoryComponent,
    AddEditTypeComponent,
    WarehouseinfoComponent,
    WhStockComponent,
    SupplierStockComponent,
    AddEditSupplierStockComponent,
    DeleteSupplierStockComponent,
    SupplierReturnComponent,
    AddEditSupplierReturnComponent,
    DeleteSupplierReturnComponent,
    VanStockComponent,
    AddEditVanStockComponent,
    DeleteVanStockComponent,
    VanReturnComponent,
    AddEditVanReturnComponent,
    DeleteVanReturnComponent,
    TransferComponent,
    AddEditTransferComponent,
    DeleteTransferComponent,
    AdjustmentComponent,
    AddEditAdjustmentComponent,
    DeleteAdjustmentComponent,
    WhOrdersComponent,
    AddEditWhOrderComponent,
    DeleteWhOrderComponent
  ],
  providers: [],

})
export class PageModule { }
