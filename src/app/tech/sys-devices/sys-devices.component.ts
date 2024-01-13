import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { SysDevicesData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { AddEditSysDeviceComponent } from './add-edit-sys-device/add-edit-sys-device.component';
import { DeleteSysDeviceComponent } from './delete-sys-device/delete-sys-device.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sys-devices',
  templateUrl: './sys-devices.component.html',
  styleUrls: ['./sys-devices.component.scss']
})
export class SysDevicesComponent implements OnInit {

  user: any = '';
  filter: string;
  isLoading = true;
  sys_devices: any[];
  total_devices: number;
  current_device: number;
  current_site_id: number;
  current_system_type: any;

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<SysDevicesData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_device) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('devicesTable') devicesTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'System Type', sortable: true, field: 'system_type', hide: true },
    { header: 'Brand', sortable: true, field: 'brand' },
    { header: 'Device Type', sortable: true, field: 'device_type' },
    { header: 'Name', sortable: true, field: 'name' },
    { header: 'Model', sortable: true, field: 'partnumber' },
    { header: 'Serial #', sortable: true, field: 'serial_number' },
    { header: 'MAC', sortable: true, field: 'nic_mac' },
    { header: 'IP', sortable: true, field: 'nic_ip' },
    { header: 'Subnet', sortable: true, field: 'nic_subnet', hide: true },
    { header: 'Gateway', sortable: true, field: 'nic_gateway', hide: true },
    { header: 'Port', sortable: true, field: 'nic_port' },
    { header: 'Local Web Port', sortable: true, field: 'local_web_port' },
    { header: 'Remote IP', sortable: true, field: 'remote_ip' },
    { header: 'Remote Web Port', sortable: true, field: 'remote_web_port' },
    { header: 'Username', sortable: true, field: 'username' },
    { header: 'Password', sortable: true, field: 'password' },
    { header: 'Firmware Ver.', sortable: true, field: 'firmware_version' },
    { header: 'Link Name', sortable: true, field: 'link_name', hide: true },
    { header: 'Link Password', sortable: true, field: 'link_password', hide: true },
    { header: 'Location.', sortable: true, field: 'location' },
    { header: 'Notes', sortable: true, field: 'notes' },
  ];

  constructor(private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.sys_devices = [];
    this.total_devices = 0;
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
        this.loadSystemDevices(this.current_site_id);
        this.isLoading = false
      }
    });
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
  }

  setSysDevice(device_id) {
    this.current_device = device_id;
    this.AC.setSystemDevice(device_id);
  }

  loadSystemDevices(current_site = this.current_site_id, calledFrom?: any) {
    this.isLoading = true;
    const params = {
      action: Number(current_site) === 0 ? 'getAll' : 'getDevicesBySystemTypeAndSiteID',
      module: 'system_devices',
      system_type: this.current_system_type,                  // Get System Type Systeminfo Component on selected tab
      site_id: !current_site ? 0 : current_site,
    };
    if (this.current_site_id === 0) {
      return;
    }
    this.AC.get(params).subscribe((answer: any) => {
      this.sys_devices = answer.system_devices;
      this.dataSource.data = this.sys_devices;
      this.total_devices = this.sys_devices.length;
      this.devicesTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.devicesTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.loadSystemDevices(this.current_site_id)
    this.filter = '';
    this.dataSource.data = this.sys_devices;
    this.total_devices = this.sys_devices.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.devicesTable.dataSource.paginator) {
      this.devicesTable.dataSource?.paginator?.firstPage();
    }
    this.devicesTable.dataSource.filter = '';
    this.devicesTable.sort.sort({
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
      dialogRef = this.dialog.open(AddEditSysDeviceComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSystemDevices()
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSysDeviceComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSystemDevices()
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
    this.devicesTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // console.log(e);
  }

}
