import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { ProductsData } from '../../shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from '../../shared/services/accounts.service';
import { MatTableService } from '../../shared/services/mat-table.service';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { EncryptionService } from '../../shared/services/encryption.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit, AfterViewInit {

  user: any = '';
  filter: string;
  products: any[];
  isLoading = true;
  current_product: any;
  current_type_id: number;
  current_brand_id: number;
  current_category_id: number;

  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<ProductsData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_product) };
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('productsTable') productsTable!: MtxGridComponent;
  @Output() resetBrands = new EventEmitter();
  @Output() resetCategories = new EventEmitter();
  @Output() resetTypes = new EventEmitter();

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Brand', sortable: true, field: 'brand' },
    { header: 'Category', sortable: true, field: 'category' },
    { header: 'Type', sortable: true, field: 'type' },
    { header: 'Product', sortable: true, field: 'product' },
    { header: 'Part Number', sortable: true, field: 'partnumber' },
    { header: 'Description', sortable: true, field: 'description' },
    { header: 'Link', sortable: true, field: 'link', type: 'link', class: 'link' },
    { header: 'Notes', sortable: true, field: 'notes', hide: true }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService,
    private encyption:EncryptionService,
  ) {
    this.filter = '';
    this.products = [];
    this.current_type_id = 0;
    this.current_brand_id = 0;
    this.current_category_id = 0;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
    //this.displayProducts();
  }

  ngAfterViewInit(): void {
      const params = {
        //action: 'getAll',
       // module: 'products',
      };
      const endpoint= 'products/getAll' ;
      this.AC.post(params,endpoint).subscribe((answer: any) => {
      // this.products = answer.products;
      const products= this.encyption.get(answer.products);
      this.products = products;

      this.dataSource.data = this.products;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.AC.newProductObserver().pipe(
        distinctUntilChanged()
      ).subscribe((product) => {
        this.products.push(product);
        this.displayProducts();
      });

      this.AC.updatedProductObserver().pipe(
        distinctUntilChanged()
      ).subscribe((product: any) => {
        this.products.forEach((current, index) => {
          if (current.id === product.id) {
            this.products[index] = product;
          }
        });
        this.displayProducts();
      });

      this.AC.deletedProductObserver().pipe(
        distinctUntilChanged()
      ).subscribe((id) => {
        const index = this.products.indexOf(
          this.products.filter((product) => product.id === id)
        );
        this.products.splice(index, 1);
        this.displayProducts();
      });

      this.AC.deletedTypeObserver().pipe(
        distinctUntilChanged()
      ).subscribe(() => {
        this.displayProducts();
      });

      this.AC.brandObserver().pipe(
        distinctUntilChanged()
      ).subscribe((brand_id) => {
        this.current_brand_id = brand_id;
        this.loadProductsByIDs();
      });

      this.AC.categoryObserver().pipe(
        distinctUntilChanged()
      ).subscribe((category_id) => {
        this.current_category_id = category_id;
        this.loadProductsByIDs();
      });

      this.AC.typeObserver().pipe(
        distinctUntilChanged()
      ).subscribe((type_id) => {
        this.current_type_id = type_id;
        this.loadProductsByIDs();
      });
    });
  }

  loadProducts() {
    this.isLoading = true;
    if (this.current_brand_id !== 0 || this.current_category_id !== 0 || this.current_type_id !== 0) {
      this.loadProductsByIDs();
      return;
    }
   
    const params = {
      //action: 'getAll',
     // module: 'products',
    };
    const endpoint= 'products/getAll' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      const products= this.encyption.get(answer.products);
      this.products = products;
      this.dataSource.data = this.products;
      this.productsTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  setProduct(product_id) {
    this.current_product = product_id;
    this.AC.setProduct(product_id);
  }

  loadProductsByIDs() {
    this.isLoading = true;
    const params = {
      //action: 'getByForeignIds',
      //module: 'products',
      type_id: Number(this.current_type_id),
      brand_id: Number(this.current_brand_id),
      category_id: Number(this.current_category_id)
    };
    const endpoint= 'products/getByForeignIds' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      const products= this.encyption.get(answer.products);
      this.products = products;
      this.dataSource.data = this.products;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  displayProducts() {
    if (this.current_brand_id === 0 || this.current_category_id === 0 || this.current_type_id === 0) {
      this.loadProducts();
      return;
    } else if (this.current_brand_id !== 0 && this.current_category_id === 0 && this.current_type_id === 0) {
      this.dataSource.data = this.products.filter(
        (product) => product.brand_id === this.current_brand_id
      );
    } else if (this.current_brand_id === 0 && this.current_category_id !== 0 && this.current_type_id === 0) {
      this.dataSource.data = this.products.filter(
        (product) => product.current_category_id === this.current_category_id
      );
    } else if (this.current_brand_id === 0 && this.current_category_id === 0 && this.current_type_id !== 0) {
      this.dataSource.data = this.products.filter(
        (product) => product.current_type_id === this.current_type_id
      );
    } else {
      this.loadProducts();
    }
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productsTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.productsTable.paginator) {
      this.productsTable.paginator.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.resetBrands.emit();
    this.resetCategories.emit();
    this.resetTypes.emit();
    this.filter = '';
    this.dataSource.data = this.products;
    this.dataSource.paginator = this.paginator;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.productsTable.dataSource.paginator) {
      this.productsTable.dataSource?.paginator?.firstPage();
    }
    this.productsTable.dataSource.filter = '';
    this.productsTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.setProduct(0);
    this.changeRef.detectChanges();
  }
  // Link Button Function
  goToLink(url: string) {
    this.AC.goToLink(url);
  }
  // Add Edit Delete Dialog Window
  openDialog(action: any, obj: any) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = true;
    matDialogConfig.autoFocus = true;
    obj.action = action;
    matDialogConfig.data = obj;
    let dialogRef: any;
    if (action.toLowerCase() === 'add' || action.toLowerCase() === 'edit') {
      dialogRef = this.dialog.open(AddEditProductComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadProducts();
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteProductComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadProducts();
      });
    }
  }

  closeMenu() {
    this.productsTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(e);
  }
}
