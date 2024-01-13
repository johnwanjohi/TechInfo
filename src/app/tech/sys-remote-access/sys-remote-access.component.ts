import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { RemoteAccessData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { AddEditSysRemoteAccessComponent } from './add-edit-sys-remote-access/add-edit-sys-remote-access.component';
import { DeleteSysRemoteAccessComponent } from './delete-sys-remote-access/delete-sys-remote-access.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sys-remote-access',
  templateUrl: './sys-remote-access.component.html',
  styleUrls: ['./sys-remote-access.component.scss']
})
export class SysRemoteAccessComponent implements OnInit {

  user: any = '';
  filter: string;
  isLoading = true;
  remote_access: any[];
  total_remote_access: number;
  current_r_access: number;
  current_site_id: number;
  current_system_type: any;

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<RemoteAccessData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_r_access) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('remoteAccessTable') remoteAccessTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'System Type', sortable: true, field: 'system_type', hide: true },
    { header: 'Type', sortable: true, field: 'remote_type' },
    { header: 'Name', sortable: true, field: 'remote_name' },
    { header: 'Remote ID', sortable: true, field: 'remote_id' },
    { header: 'Login', sortable: true, field: 'remote_login' },
    { header: 'Password', sortable: true, field: 'remote_password' },
    { header: 'Notes', sortable: true, field: 'notes' },
  ];
  constructor(private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.remote_access = [];
    this.total_remote_access = 0;
    this.current_site_id = 0;
    this.current_system_type = '';
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
    this.getSystemTypes();
    this.AC.systeminfoSiteObserver().pipe(
      distinctUntilChanged()
    ).subscribe((systeminfo_site_id) => {
      this.current_site_id = systeminfo_site_id;
      if (this.current_site_id === 0) {
        this.isLoading = false
        return
      } else {
        this.loadRemoteAccesss(this.current_site_id);
        this.isLoading = false
      }
    });
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
  }

  setRemoteAccess(r_access_id) {
    this.current_r_access = r_access_id;
    this.AC.setRemoteAccess(r_access_id);
  }

  loadRemoteAccesss(current_site = this.current_site_id, calledFrom?: any) {
    this.isLoading = true;
    const params = {
      action: Number(current_site) === 0 ? 'getAll' : 'getRemoteAccessBySystemTypeAndSiteID',
      module: 'remote_access',
      system_type: this.current_system_type,                  // Get System Type Systeminfo Component on selected tab
      site_id: !current_site ? 0 : current_site,
    };
    if (this.current_site_id === 0) {
      return;
    };
    console.dir(params);
    this.AC.get(params).subscribe((answer: any) => {
      this.remote_access = answer.remote_access;
      this.dataSource.data = this.remote_access;
      this.total_remote_access = this.remote_access.length;
      this.remoteAccessTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.remoteAccessTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.loadRemoteAccesss(this.current_site_id)
    this.filter = '';
    this.dataSource.data = this.remote_access;
    this.total_remote_access = this.remote_access.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.remoteAccessTable.dataSource.paginator) {
      this.remoteAccessTable.dataSource?.paginator?.firstPage();
    }
    this.remoteAccessTable.dataSource.filter = '';
    this.remoteAccessTable.sort.sort({
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
      dialogRef = this.dialog.open(AddEditSysRemoteAccessComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadRemoteAccesss()
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSysRemoteAccessComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadRemoteAccesss()
      });
    }
  }

  async getSystemTypes() {
    this.AC.systemType.pipe(
      distinctUntilChanged()
    ).subscribe(system_type => {
      this.current_system_type = system_type;
    });
  }

  closeMenu() {
    this.remoteAccessTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // console.log(e);
  }

}
