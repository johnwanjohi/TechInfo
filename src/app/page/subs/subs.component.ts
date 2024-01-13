import { MatSort } from '@angular/material/sort';
import { SubsData } from 'app/shared/models/index';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteSubComponent } from './delete-sub/delete-sub.component';
import { AddEditSubComponent } from './add-edit-sub/add-edit-sub.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, } from '@angular/core';

@Component({
  selector: 'app-subs',
  templateUrl: './subs.component.html',
  styleUrls: ['./subs.component.scss']
})

export class SubsComponent implements OnInit, AfterViewInit {

  subs: any[];
  user: any = '';
  filter: string;
  isLoading = true;
  total_subs: number;
  current_sub: number;

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<SubsData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_sub) };


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('subsTable') subsTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Sub', sortable: true, field: 'name' },
    { header: 'Address', sortable: true, field: 'address' }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService,
  ) {
    this.filter = '';
    this.subs = [];
    this.total_subs = 0;
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
      //module: 'subs',
    };
    this.isLoading = true;
    const endpoint= "subs/getAll";
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.subs = answer.subs;
      this.makeAddress();
      this.dataSource.data = this.subs;
      this.total_subs = this.subs.length;

      this.AC.newSubObserver().pipe(
        distinctUntilChanged()
      ).subscribe((sub) => {
        this.subs.push(sub);
        this.makeAddress();
        this.dataSource.data = this.subs;
        this.total_subs = this.dataSource.data.length;
        this.subsTable.dataSource = this.dataSource;
        this.loadSubs();
      });

      this.AC.updatedSubObserver().pipe(
        distinctUntilChanged()
      ).subscribe((sub: any) => {
        this.subs.forEach((current, index) => {
          if (current.id == sub.id) {
            this.subs[index] = sub;
          }
        });
        this.makeAddress();
        this.dataSource.data = this.subs;
        this.total_subs = this.dataSource.data.length;
        this.subsTable.dataSource = this.dataSource;
        this.loadSubs();
      });

      this.AC.deletedSubObserver().pipe(
        distinctUntilChanged()
      ).subscribe((id) => {
        let index = this.subs.indexOf(
          this.subs.filter((sub) => sub.id == id)
        );
        this.subs.splice(index, 1);
        this.dataSource.data = this.subs;
        this.total_subs = this.dataSource.data.length;
        this.subsTable.dataSource = this.dataSource;
        this.loadSubs();
      });
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  setSub(sub_id) {
    this.current_sub = sub_id;
    this.AC.setSub(Number(sub_id));
  }

  loadSubs() {
    this.isLoading = true;
    const params = {
      //action: 'getAll',
      //module: 'subs',
      id: Number(this.current_sub)
    };
    const endpoint= "subs/getAll";
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.subs = answer.subs;
      this.dataSource.data = this.subs;
      this.total_subs = this.dataSource.data.length;
      this.subsTable.dataSource = this.dataSource;
      this.makeAddress();
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Address concatenation
  makeAddress() {
    this.subs.forEach((sub) => {
      sub.address =
        sub.street +
        ', ' +
        sub.city +
        ', ' +
        sub.state +
        ', ' +
        sub.postal;
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.subsTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.filter = '';
    this.current_sub = 0;
    this.dataSource.data = this.subs;
    this.total_subs = this.subs.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.subsTable.dataSource.paginator) {
      this.subsTable.dataSource?.paginator?.firstPage();
    }
    this.subsTable.dataSource.filter = '';
    this.subsTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.setSub(0);
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
      dialogRef = this.dialog.open(AddEditSubComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSubComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    }
  }

  closeMenu() {
    this.subsTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(e);
  }
}

