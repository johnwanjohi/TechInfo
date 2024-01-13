import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { LicensesData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { AddEditSysLicenseComponent } from './add-edit-sys-license/add-edit-sys-license.component';
import { DeleteSysLicenseComponent } from './delete-sys-license/delete-sys-license.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sys-licenses',
  templateUrl: './sys-licenses.component.html',
  styleUrls: ['./sys-licenses.component.scss']
})
export class SysLicensesComponent implements OnInit {

  user: any = '';
  filter: string;
  isLoading = true;
  licenses: any[];
  total_licenses: number;
  current_license: number;
  current_site_id: number;
  current_system_type: any;

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<LicensesData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_license) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('licensesTable') licensesTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'System Type', sortable: true, field: 'system_type', hide: true },
    { header: 'Brand', sortable: true, field: 'brand' },
    { header: 'Type', sortable: true, field: 'type' },
    { header: 'License', sortable: true, field: 'license' },
    { header: 'Devices Qty', sortable: true, field: 'devices_qty' },
    { header: 'Activation Date', sortable: true, field: 'activation_date' },
    { header: 'Notes', sortable: true, field: 'notes' },
  ];
  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.licenses = [];
    this.total_licenses = 0;
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
        this.loadLicenses(this.current_site_id);
        this.isLoading = false
      }
    });
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
  }

  setLicense(license_id) {
    this.current_license = license_id;
    this.AC.setLicense(license_id);
  }

  loadLicenses(current_site = this.current_site_id, calledFrom?: any) {
    this.isLoading = true;
    const params = {
      action: Number(current_site) === 0 ? 'getAll' : 'getLicensesBySystemTypeAndSiteID',
      module: 'licenses',
      system_type: this.current_system_type,                  // Get System Type Systeminfo Component on selected tab
      site_id: !current_site ? 0 : current_site,
    };
    if (this.current_site_id === 0) {
      return;
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.licenses = answer.licenses;
      this.dataSource.data = this.licenses;
      this.total_licenses = this.licenses.length;
      this.licensesTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.licensesTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.loadLicenses(this.current_site_id)
    this.filter = '';
    this.dataSource.data = this.licenses;
    this.total_licenses = this.licenses.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.licensesTable.dataSource.paginator) {
      this.licensesTable.dataSource?.paginator?.firstPage();
    }
    this.licensesTable.dataSource.filter = '';
    this.licensesTable.sort.sort({
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
      dialogRef = this.dialog.open(AddEditSysLicenseComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadLicenses()
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSysLicenseComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadLicenses()
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
    this.licensesTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // console.log(e);
  }

}
