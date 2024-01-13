import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
/*
import { WarehousesinfoComponent } from './warehousesinfo/warehousesinfo.component';
import { WarehousesComponent } from './bk/warehouses-bk/warehouses.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { AddWarehouseComponent } from './warehouses/add-warehouse/add-warehouse.component';
import { EditWarehouseComponent } from './warehouses/edit-warehouse/edit-warehouse.component';
import { DeleteWarehouseComponent } from './warehouses/delete-warehouse/delete-warehouse.component';
import { WarehouseOrdersComponent } from './warehouse-orders/warehouse-orders.component';
import { AddWarehouseOrderComponent } from './warehouse-orders/add-warehouse-order/add-warehouse-order.component';
import { EditWarehouseOrderComponent } from './warehouse-orders/edit-warehouse-order/edit-warehouse-order.component';
import { DeleteWarehouseOrderComponent } from './warehouse-orders/delete-warehouse-order/delete-warehouse-order.component';
*/
import { InventoryComponent } from './inventory/inventory.component';
import { BrandsComponent } from './brands/brands.component';
import { DeleteBrandComponent } from './brands/delete-brand/delete-brand.component';
import { CategoriesComponent } from './categories/categories.component';
import { DeleteCategoryComponent } from './categories/delete-category/delete-category.component';
import { TypesComponent } from './types/types.component';
import { DeleteTypeComponent } from './types/delete-type/delete-type.component';
import { ProductsComponent } from './products/products.component';
// import { AddProductComponent } from './products/add-product/add-product.component';
// import { EditProductComponent } from './products/edit-product/edit-product.component';
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
import { WarehouseinfoComponent } from './warehouseinfo/warehouseinfo.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'page', component: PageComponent, data: { title: 'Page' } },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
      { path: 'accounts', component: AccountsComponent, data: { title: 'Accounts' } },
      { path: 'customers', component: CustomersComponent, data: { title: 'Customers' } },

      { path: 'customers/delete/:id', component: DeleteCustomerComponent },
      { path: 'customers/summary', component: SummaryCustomerComponent },
      { path: 'sites', component: SitesComponent, data: { title: 'Sites' } },

      { path: 'sites/delete/:id', component: DeleteSiteComponent },
      { path: 'sites/summary', component: SummarySiteComponent },
      { path: 'contacts', component: ContactsComponent, data: { title: 'Contacts' } },
      { path: 'contacts/delete/:id', component: DeleteContactComponent, },
      { path: 'contacts/summary', component: SummaryContactComponent, },
      { path: 'subsinfo', component: SubsinfoComponent, data: { title: 'Subs Info' } },
      { path: 'subs', component: SubsComponent, data: { title: 'Subs' } },
      { path: 'subs/delete/:id', component: DeleteSubComponent },
      { path: 'subs/summary', component: SummarySubComponent, },
      { path: 'subscontacts', component: SubscontactsComponent, data: { title: 'Subs Contacts' } },
      { path: 'subscontacts/delete/:id', component: DeleteSubcontactComponent, },
      { path: 'subscontacts/summary', component: SummarySubcontactComponent, },
      { path: 'warehousesinfo', component: WarehouseinfoComponent, data: { title: 'Warehouses Info' } },
      /*
      { path: 'warehouses', component: WarehousesComponent, data: { title: 'Warehouses' } },
      { path: 'warehouses/add', component: AddWarehouseComponent },
      { path: 'warehouses/edit/:id', component: EditWarehouseComponent },
      { path: 'warehouses/delete/:id', component: DeleteWarehouseComponent },
      { path: 'warehouse-orders', component: WarehouseOrdersComponent, data: { title: 'Warehouse Orders' } },
      { path: 'wh-orders/add', component: AddWarehouseOrderComponent },
      { path: 'wh-orders/edit/:id', component: EditWarehouseOrderComponent },
      { path: 'wh-orders/delete/:id', component: DeleteWarehouseOrderComponent },
      */
      { path: 'inventory', component: InventoryComponent, data: { title: 'Inventory' } },
      { path: 'brands', component: BrandsComponent, data: { title: 'Brands' } },
      { path: 'brands/delete/:id', component: DeleteBrandComponent },
      { path: 'categories', component: CategoriesComponent, data: { title: 'Categories' } },
      { path: 'categories/delete/:id', component: DeleteCategoryComponent },
      { path: 'types', component: TypesComponent, data: { title: 'Types' } },
      { path: 'types/delete/:id', component: DeleteTypeComponent },
      { path: 'products', component: ProductsComponent, data: { title: 'Products' } },
      // { path: 'products/add', component: AddProductComponent },
      // { path: 'products/edit/:id', component: EditProductComponent },
      { path: 'products/delete/:id', component: DeleteProductComponent },
      { path: 'suppliersinfo', component: SuppliersinfoComponent, data: { title: 'Suppliers Info' } },
      { path: 'suppliers', component: SuppliersComponent, data: { title: 'Suppliers' } },
      { path: 'suppliers/delete/:id', component: DeleteSupplierComponent },
      { path: 'suppliers/summary', component: SummarySupplierComponent, },
      { path: 'supplierscontacts', component: SupplierscontactsComponent, data: { title: 'Suppliers Contacts' } },
      { path: 'supplierscontacts/delete/:id', component: DeleteSuppliercontactComponent, },
      { path: 'supplierscontacts/summary', component: SummarySuppliercontactComponent, },
      { path: 'packagesinfo', component: PackagesinfoComponent, data: { title: 'Packages' } },
      { path: 'packages', component: PackagesComponent, },
      { path: 'packages/delete/:id', component: DeletePackageComponent },
      { path: 'packages/summary', component: SummaryPackageComponent, },
      { path: 'jobsinfo', component: JobsinfoComponent, data: { title: 'Jobs Info' } },
      { path: 'jobs', component: JobsComponent, },
      { path: 'jobs/delete/:id', component: DeleteJobComponent },
      { path: 'jobs/summary', component: SummaryJobComponent, },
      /* --------next to do ---------- */
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule { }
