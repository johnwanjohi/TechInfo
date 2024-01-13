import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { SysServersData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { AddEditSysServerComponent } from './add-edit-sys-server/add-edit-sys-server.component';
import { DeleteSysServerComponent } from './delete-sys-server/delete-sys-server.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sys-servers',
  templateUrl: './sys-servers.component.html',
  styleUrls: ['./sys-servers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SysServersComponent implements OnInit {

  user: any = '';
  filter: string;
  isLoading = true;
  sys_servers: any[];
  total_servers: number;
  current_server: number;
  current_site_id: number;
  current_system_type: any;

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<SysServersData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_server) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('serversTable') serversTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'System Type', sortable: true, field: 'system_type', hide: true },
    { header: 'Brand', sortable: true, field: 'brand' },
    { header: 'Server Type', sortable: true, field: 'server_type' },
    { header: 'Name', sortable: true, field: 'name' },
    { header: 'Model', sortable: true, field: 'partnumber' },
    { header: 'Serial #', sortable: true, field: 'serial_number' },
    { header: 'Service Tag', sortable: true, field: 'service_tag' },
    { header: 'iDRAC MAC', sortable: true, field: 'nic0_mac' },
    { header: 'iDRAC IP', sortable: true, field: 'nic0_ip' },
    { header: 'iDRAC Subnet', sortable: true, field: 'nic0_subnet', hide: true },
    { header: 'iDRAC Gateway', sortable: true, field: 'nic0_gateway', hide: true },
    { header: 'iDRAC Port', sortable: true, field: 'nic0_port' },
    { header: 'NIC-1 MAC', sortable: true, field: 'nic1_mac' },
    { header: 'NIC-1 IP', sortable: true, field: 'nic1_ip' },
    { header: 'NIC-1 Subnet', sortable: true, field: 'nic1_subnet', hide: true },
    { header: 'NIC-1 Gatewy', sortable: true, field: 'nic1_gateway', hide: true },
    { header: 'NIC-1 Port', sortable: true, field: 'nic1_port' },
    { header: 'NIC-2 MAC', sortable: true, field: 'nic2_mac' },
    { header: 'NIC-2 IP', sortable: true, field: 'nic2_ip' },
    { header: 'NIC-2 Subnet', sortable: true, field: 'nic2_subnet', hide: true },
    { header: 'NIC-2 Gateway', sortable: true, field: 'nic2_gateway', hide: true },
    { header: 'NIC-2 Port', sortable: true, field: 'nic2_port' },
    { header: 'Remote IP', sortable: true, field: 'remote_ip' },
    { header: 'OS (Windows) Ver.', sortable: true, field: 'os_version' },
    { header: 'OS (Windows) Login', sortable: true, field: 'os_login' },
    { header: 'OS (Windows) Password', sortable: true, field: 'os_password' },
    { header: 'Server (Software) Ver.', sortable: true, field: 'server_version' },
    { header: 'Server (Software) Login', sortable: true, field: 'server_login' },
    { header: 'Server (Software) Password', sortable: true, field: 'server_password' },
    { header: 'Location.', sortable: true, field: 'location' },
    { header: 'Notes', sortable: true, field: 'notes' },
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.sys_servers = [];
    this.total_servers = 0;
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
        this.loadSystemServers(this.current_site_id);
        this.isLoading = false
      }
    });
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
  }

  // ngAfterViewInit(): void {
  //   const params = {
  //     action: 'getServersBySystemTypeAndSiteID',
  //     module: 'system_servers',
  //   };
  //   this.isLoading = true;
  //   this.AC.get(params).subscribe((answer: any) => {
  //     this.sys_servers = answer.system_servers;
  //     this.dataSource.data = this.sys_servers;
  //     this.total_servers = this.sys_servers.length;

  //     this.AC.newSystemServerObserver().pipe(
  //       distinctUntilChanged()
  //     ).subscribe((server) => {
  //       this.sys_servers.push(server);
  //       this.dataSource.data = this.sys_servers;
  //       this.total_servers = this.dataSource.data.length;
  //       this.serversTable.dataSource = this.dataSource;
  //       this.loadSystemServers(this.current_site_id);
  //     });

  //     this.AC.updatedSystemServerObserver().pipe(
  //       distinctUntilChanged()
  //     ).subscribe((server: any) => {
  //       this.sys_servers.forEach((current, index) => {
  //         if (current.id === server.id) {
  //           this.sys_servers[index] = server;
  //         }
  //       });
  //       this.dataSource.data = this.sys_servers;
  //       this.total_servers = this.sys_servers.length;
  //       this.serversTable.dataSource = this.dataSource;
  //       this.loadSystemServers(this.current_site_id);
  //     });

  //     this.AC.deletedSystemServerObserver().pipe(
  //       distinctUntilChanged()
  //     ).subscribe((id) => {
  //       const index = this.sys_servers.indexOf(
  //         this.sys_servers.filter((server) => server.id === id)
  //       );
  //       this.sys_servers.splice(index, 1);
  //       this.dataSource.data = this.sys_servers;
  //       this.total_servers = this.dataSource.data.length;
  //       this.serversTable.dataSource = this.dataSource;
  //       this.loadSystemServers(this.current_site_id);
  //     });
  //     // this.AC.systeminfoSiteObserver().pipe(
  //     //   distinctUntilChanged()
  //     // ).subscribe((systeminfo_site_id) => {
  //     //   this.current_site_id = systeminfo_site_id;
  //     //   this.changeRef.detectChanges();
  //     //   this.loadSystemServers(this.current_site_id);
  //     //   console.log('Called from SystemServer AfterViewInit', this.current_site_id)
  //     // });
  //     this.isLoading = false;
  //     this.changeRef.detectChanges();
  //   });
  // }

  setSysServer(server_id) {
    this.current_server = server_id;
    this.AC.setSystemServer(server_id);
  }

  loadSystemServers(current_site = this.current_site_id, calledFrom?: any) {
    this.isLoading = true;
    const params = {
     // action: Number(current_site) === 0 ? 'getAll' : 'getServersBySystemTypeAndSiteID',
      //module: 'system_servers',
      system_type: this.current_system_type,                  // Get System Type Systeminfo Component on selected tab
      site_id: !current_site ? 0 : current_site,
    };
    if (this.current_site_id === 0) {
      return;
    }
    const endpoint= Number(current_site) === 0 ? 'system_servers/getAll' : 'system_servers/getServersBySystemTypeAndSiteID';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.sys_servers = answer.system_servers;
      this.dataSource.data = this.sys_servers;
      this.total_servers = this.sys_servers.length;
      this.serversTable.dataSource = this.dataSource;
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serversTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.loadSystemServers(this.current_site_id)
    this.filter = '';
    // this.current_server = 0;
    // this.current_site_id = 0;
    this.dataSource.data = this.sys_servers;
    this.total_servers = this.sys_servers.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.serversTable.dataSource.paginator) {
      this.serversTable.dataSource?.paginator?.firstPage();
    }
    this.serversTable.dataSource.filter = '';
    this.serversTable.sort.sort({
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
      dialogRef = this.dialog.open(AddEditSysServerComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSystemServers()
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSysServerComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSystemServers()
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
    this.serversTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // console.log(e);
  }

}
