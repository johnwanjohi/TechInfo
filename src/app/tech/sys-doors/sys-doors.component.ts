import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { SysDoorsData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { AddEditSysDoorComponent } from './add-edit-sys-door/add-edit-sys-door.component';
import { DeleteSysDoorComponent } from './delete-sys-door/delete-sys-door.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sys-doors',
  templateUrl: './sys-doors.component.html',
  styleUrls: ['./sys-doors.component.scss']
})
export class SysDoorsComponent implements OnInit {

  user: any = '';
  filter: string;
  isLoading = true;
  sys_doors: any[];
  total_doors: number;
  current_door: number;
  current_site_id: number;
  current_system_type: any;

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<SysDoorsData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_door) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('doorsTable') doorsTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Name', sortable: true, field: 'name' },
    { header: 'Panel', sortable: true, field: 'panel' },
    { header: 'Label', sortable: true, field: 'label' },
    { header: 'Notes', sortable: true, field: 'notes' },
  ];

  constructor(private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.sys_doors = [];
    this.total_doors = 0;
    this.current_site_id = 0;
    this.current_system_type = '';
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
    this.AC.systeminfoSiteObserver().pipe(
      distinctUntilChanged()
    ).subscribe((systeminfo_site_id) => {
      this.current_site_id = systeminfo_site_id;
      if (this.current_site_id === 0) {
        this.isLoading = false
        return
      } else {
        this.loadSystemDoors(this.current_site_id);
        this.isLoading = false
      }
    });
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
  }

  setSysDoor(door_id) {
    this.current_door = door_id;
    this.AC.setSystemDoor(door_id);
  }

  loadSystemDoors(current_site = this.current_site_id, calledFrom?: any) {
    this.isLoading = true;
    const params = {
      action: Number(current_site) === 0 ? 'getAll' : 'getDoorsBySiteID',
      module: 'system_doors',
      site_id: !current_site ? 0 : current_site,
    };
    if (this.current_site_id === 0) {
      return;
    }
    this.AC.get(params).subscribe((answer: any) => {
      this.sys_doors = answer.system_doors;
      this.dataSource.data = this.sys_doors;
      this.total_doors = this.sys_doors.length;
      this.doorsTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.doorsTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.loadSystemDoors(this.current_site_id)
    this.filter = '';
    this.dataSource.data = this.sys_doors;
    this.total_doors = this.sys_doors.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.doorsTable.dataSource.paginator) {
      this.doorsTable.dataSource?.paginator?.firstPage();
    }
    this.doorsTable.dataSource.filter = '';
    this.doorsTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
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
      dialogRef = this.dialog.open(AddEditSysDoorComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSystemDoors()
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSysDoorComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSystemDoors()
      });
    }
  }

  closeMenu() {
    this.doorsTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // console.log(e);
  }

}
