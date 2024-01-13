import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { CategoriesData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent implements OnInit, AfterViewInit {

  user: any = '';
  filter: string;
  categories: any[];
  isLoading = true;
  current_category: any;

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<CategoriesData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_category) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('categoriesTable') categoriesTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Category', sortable: true, field: 'category' }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService,
  ) {
    this.filter = '';
    this.categories = [];
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
  }

  ngAfterViewInit(): void {
    const params = {
      //action: 'getAll',
      //module: 'categories',
    };
    this.isLoading = true;
    const endpoint=  'categories/getAll';
    const categoryData=localStorage.getItem('categories');
    if(categoryData !== undefined && categoryData !== null && categoryData !== ""){
        this.categories = JSON.parse(categoryData);
        this.dataSource.data = this.categories;
        this.setCategoryObserver();
        this.isLoading = false;
        this.changeRef.detectChanges();
    }else{
        this.AC.post(params,endpoint).subscribe((answer: any) => {
          localStorage.setItem('categories',JSON.stringify(answer.categories));
          this.categories = answer.categories;
          this.dataSource.data = this.categories;
          this.setCategoryObserver();
          this.isLoading = false;
          this.changeRef.detectChanges();
        });
    }
  }

 setCategoryObserver(){
      this.AC.newCategoryObserver().pipe(
        distinctUntilChanged()
      ).subscribe((category) => {
        this.categories.push(category);
        this.dataSource.data = this.categories;
        this.categoriesTable.dataSource = this.dataSource;
        this.loadCategories();
      });

      this.AC.updatedCategoryObserver().pipe(
        distinctUntilChanged()
      ).subscribe((category: any) => {
        this.categories.forEach((current, index) => {
          if (current.id === category.id) {
            this.categories[index] = category;
          }
        });
        this.dataSource.data = this.categories;
        this.categoriesTable.dataSource = this.dataSource;
        this.loadCategories();
      });

      this.AC.deletedCategoryObserver().pipe(
        distinctUntilChanged()
      ).subscribe((id) => {
        const index = this.categories.indexOf(
          this.categories.filter((category) => category.id === id)
        );
        this.categories.splice(index, 1);
        this.dataSource.data = this.categories;
        this.categoriesTable.dataSource = this.dataSource;
        this.loadCategories();
        this.AC.setType(0);
      });

      this.AC.typeCategoryObserver().pipe(
        distinctUntilChanged()
      ).subscribe((category_id) => {
        if (category_id == 0) this.dataSource.data = this.categories;
        else
          this.dataSource.data = this.categories.filter(
            (category) => category.id == category_id
          );
      });
 }

  setCategory(category_id) {
    this.current_category = Number(category_id);
    this.AC.setCategory(Number(category_id));
    this.AC.setType(0);
  }

  loadCategories() {
    this.isLoading = true;
    const params = {
      //action: 'getAll',
      //module: 'categories',
      id: Number(this.current_category)
    };
     const endpoint=  'categories/getAll';
     this.AC.post(params,endpoint).subscribe((answer: any) => {
      localStorage.setItem('categories',JSON.stringify(answer.categories));
      this.categories = answer.categories;
      this.dataSource.data = this.categories;
      this.categoriesTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.categoriesTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {

    this.filter = '';
    this.current_category = 0;
    this.dataSource.data = this.categories;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.categoriesTable.dataSource.paginator) {
      this.categoriesTable.dataSource?.paginator?.firstPage();
    }
    this.categoriesTable.dataSource.filter = '';
    this.categoriesTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.setCategory(0);
    this.AC.setBrand(0);
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
      dialogRef = this.dialog.open(AddEditCategoryComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteCategoryComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    }
  }

  closeMenu() {
    this.categoriesTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(e);
  }
}
