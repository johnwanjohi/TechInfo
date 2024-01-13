import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { BrandsData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteBrandComponent } from './delete-brand/delete-brand.component';
import { AddEditBrandComponent } from './add-edit-brand/add-edit-brand.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, } from '@angular/core';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})

export class BrandsComponent implements OnInit, AfterViewInit {

  user: any = '';
  brands: any[];
  filter: string;
  isLoading = true;
  current_brand: any;

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<BrandsData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_brand) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('brandsTable') brandsTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Brand', sortable: true, field: 'brand' },
    { header: 'Link', sortable: true, field: 'link' }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService,
  ) {
    this.filter = '';
    this.brands = [];
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
    this.AC.brandObserver().subscribe((brand_id) => {
      this.current_brand = brand_id;
      this.changeRef.detectChanges();
    });
  }

  ngAfterViewInit(): void {
      const params = {
        //action: 'getAll',
        //module: 'brands',
      };
      this.isLoading = true;
      const brandData=localStorage.getItem('brands');
      if(brandData !== undefined && brandData !== null && brandData !== ""){
        this.brands = JSON.parse(brandData);
        this.dataSource.data = this.brands;
        this.setBrandObserver();
        this.isLoading = false;
        this.changeRef.detectChanges();
      }else{
        const endpoint= 'brands/getAll' ;
        this.AC.post(params,endpoint).subscribe((answer: any) => {
          localStorage.setItem('brands',JSON.stringify(answer.brands));
          this.brands = answer.brands;
          this.dataSource.data = this.brands;
          this.setBrandObserver();
          this.isLoading = false;
          this.changeRef.detectChanges();
        });       
      }
  }

  setBrandObserver(){
    this.AC.newBrandObserver().pipe(
      distinctUntilChanged()
    ).subscribe((brand) => {
      this.brands.push(brand);
      this.dataSource.data = this.brands;
      this.brandsTable.dataSource = this.dataSource;
      this.loadBrands();
    });

    this.AC.updatedBrandObserver().pipe(
      distinctUntilChanged()
    ).subscribe((brand: any) => {
      this.brands.forEach((current, index) => {
        if (current.id === brand.id) {
          this.brands[index] = brand;
        }
      });
      this.dataSource.data = this.brands;
      this.brandsTable.dataSource = this.dataSource;
      this.loadBrands();
    });

    this.AC.deletedBrandObserver().pipe(
      distinctUntilChanged()
    ).subscribe((id) => {
      const index = this.brands.indexOf(
        this.brands.filter((brand) => brand.id === id)
      );
      this.brands.splice(index, 1);
      this.dataSource.data = this.brands;
      this.brandsTable.dataSource = this.dataSource;
      this.loadBrands();
    });

  }

  setBrand(brand_id) {
    this.current_brand = Number(brand_id);
    this.AC.setBrand(Number(brand_id));
  }

  loadBrands() {
    this.isLoading = true;
    const params = {
      id: Number(this.current_brand)
    };
    const endpoint= 'brands/getAll';
   this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.brands = answer.brands;
      localStorage.setItem('brands',JSON.stringify(answer.brands));
      this.dataSource.data = this.brands;
      this.brandsTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.brandsTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.filter = '';
    this.current_brand = 0;
    this.dataSource.data = this.brands;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.brandsTable.dataSource.paginator) {
      this.brandsTable.dataSource?.paginator?.firstPage();
    }
    this.brandsTable.dataSource.filter = '';
    this.brandsTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.setBrand(0);
    this.AC.setCategory(0);
    this.AC.setType(0);
    this.AC.setProduct(0);
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
      dialogRef = this.dialog.open(AddEditBrandComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteBrandComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    }
  }

  closeMenu() {
    this.brandsTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(e);
  }
}
