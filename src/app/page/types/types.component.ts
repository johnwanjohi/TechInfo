import { MatSort } from '@angular/material/sort';
import { TypesData } from '../../shared/models/index';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from '../../shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteTypeComponent } from './delete-type/delete-type.component';
import { AddEditTypeComponent } from './add-edit-type/add-edit-type.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})

export class TypesComponent implements OnInit, AfterViewInit {

  user: any = '';
  types: any[];
  filter: string;
  isLoading = true;
  current_type: any;
  current_category_id: number;

  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<TypesData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_type) };


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('typesTable') typesTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Type', sortable: true, field: 'type' },
    { header: 'Category', sortable: true, field: 'categoryname' }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.types = [];
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
    this.AC.typeObserver().subscribe(type_id => {
      this.current_type = type_id;
      this.changeRef.detectChanges();
    })
  }

  ngAfterViewInit(): void {
    const params = {
      //action: 'getAll',
      //module: 'types',
    };
    this.isLoading = true;
    const typeData=localStorage.getItem('types');
    if(typeData !== undefined && typeData !== null && typeData !== ""){
        this.types = JSON.parse(typeData);
        this.dataSource.data = this.types;
        this.setType(0, 0);
        this.setTypeObserver();
        this.isLoading = false;
        this.changeRef.detectChanges();
    }else{
        const endpoint=  'types/getAll';
        this.AC.post(params,endpoint).subscribe((answer: any) => {
        localStorage.setItem('types',JSON.stringify(answer.types));
        this.types = answer.types;
        this.dataSource.data = this.types;
        this.setType(0, 0);
        this.setTypeObserver();
        this.isLoading = false;
        this.changeRef.detectChanges();
      });
    }

  }

  setTypeObserver(){

    this.AC.newTypeObserver().pipe(
      distinctUntilChanged()
    ).subscribe((type) => {
      this.types.push(type);
      if (this.current_category_id) {
        this.dataSource.data = this.types.filter(
          (type) => {
            type.category_id === this.current_category_id;
          }
        );
      } else {
        this.dataSource.data = this.types;
      }
      this.loadTypes();
    });

    this.AC.updatedTypeObserver().pipe(
      distinctUntilChanged()
    ).subscribe((type: any) => {
      this.types.forEach((current, index) => {
        if (current.id === type.id) {
          this.types[index] = type;
        }
      });
      this.dataSource.data = this.types;
      this.loadTypes();
    });


    this.AC.deletedTypeObserver().pipe(
      distinctUntilChanged()
    ).subscribe((id) => {
      const index = this.types.indexOf(
        this.types.filter((type) => type.id === id)
      );
      this.types.splice(index, 1);
      this.dataSource.data = this.types;
      this.typesTable.dataSource = this.dataSource;
      this.loadTypes();
    });


    this.AC.categoryObserver().pipe(
      distinctUntilChanged()
    ).subscribe((category_id) => {
      this.current_category_id = category_id;
      this.loadTypes();
      return;
    });

  }

  setType(type_id, category_id) {
    this.current_type = type_id;
    this.AC.setType(type_id);
    this.AC.setTypeCategory(category_id);
  }

  loadTypes() {
    if (Number(this.current_category_id) === 0) {
      this.types = [];
      this.dataSource.data = this.types;
    }
    this.isLoading = true;
    const params = {
      //action: Number(this.current_category_id) === 0 ? 'types/getAll' : 'types/getAllTypesByCategoryId',
      //module: 'types',
      category_id: Number(this.current_category_id)
    };
      const endpoint= Number(this.current_category_id) === 0 ? 'types/getAll' : 'types/getAllTypesByCategoryId';
      this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.types = answer.types;
      localStorage.setItem('types',JSON.stringify(answer.types));
      this.dataSource.data = this.types;
      this.typesTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.typesTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.filter = '';
    this.current_type = 0;
    this.current_category_id = 0;
    this.dataSource.data = this.types;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.typesTable.dataSource.paginator) {
      this.typesTable.dataSource?.paginator?.firstPage();
    }
    this.typesTable.dataSource.filter = '';
    this.typesTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.AC.setBrand(0);
    this.AC.setProduct(0);
    this.AC.setCategory(0);
    this.setType(0, 0);
    this.changeRef.detectChanges();
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
      dialogRef = this.dialog.open(AddEditTypeComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteTypeComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    }
  }

  closeMenu() {
    this.typesTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(e);
  }
}
