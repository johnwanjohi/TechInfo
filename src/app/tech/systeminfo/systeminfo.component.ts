import { MatSort } from '@angular/material/sort';
import { SitesData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AccountsService, } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-systeminfo',
  templateUrl: './systeminfo.component.html',
  styleUrls: ['./systeminfo.component.scss']
})

export class SysteminfoComponent implements OnInit, AfterContentChecked {

  id: any;
  sites: any[];
  user: any = '';
  filter: string;
  isLoading = true;
  current_site: any;
  selected_site: any;
  active_tab: any;
  active_tabname: string = '';

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<SitesData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_site) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('sitesInfoTable') sitesInfoTable!: MtxGridComponent;
  @ViewChild('nav') activeId: NgbNavChangeEvent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Site', sortable: true, field: 'name' },
    { header: 'Address', sortable: true, field: 'address' },
    { header: 'Customer', sortable: true, field: 'customername' }
  ];

  navigationTabs: any[] =
    [
      { 'name': 'Summary' },
      { 'name': 'CCTV' },
      { 'name': 'ACCESS' },
      { 'name': 'INTRUSION' },
      { 'name': 'INTERCOM' },
      { 'name': 'NETWORK' },
      { 'name': 'OTHER' }
    ];

  constructor(
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.sites = [];
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);

    });
    this.loadSites();
    this.systemInfoSelected();
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
  }
  systemInfoSelected() {

    this.AC.systeminfo_site_id.subscribe((systeminfo_site_id) => {
      this.current_site = systeminfo_site_id;

    });
  }
  ngAfterContentChecked() {
    this.systemInfoSelected();
    this.active_tabname = this.onNavChange(this?.active_tab);
    this.AC.systemType.next(this.active_tabname);
    this.changeRef.detectChanges();
  }

  setSystenInfoSite(siteId) {
    this.current_site = siteId;
    this.AC.setSysteminfoSite(siteId);
  }

  loadSites() {
    const params = {
      //action: 'getAll',
      //module: 'sites',
    };
    this.isLoading = true;
    const endpoint= 'sites/getAll';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.sites = answer.sites;
      this.dataSource.data = this.sites;
      this.sitesInfoTable.dataSource = this.dataSource;
      this.makeAddress();
      this.setSystenInfoSite(0);
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Address concatenation
  makeAddress() {
    this.sites.forEach((site) => {
      site.address =
        site.street +
        ', ' +
        site.city +
        ', ' +
        site.state +
        ', ' +
        site.postal;
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.sitesInfoTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.filter = '';
    this.current_site = 0;
    this.dataSource.data = this.sites;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.sitesInfoTable.dataSource.paginator) {
      this.sitesInfoTable.dataSource?.paginator?.firstPage();
    }
    this.sitesInfoTable.dataSource.filter = '';
    this.sitesInfoTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.setSystenInfoSite(0);
    this.changeRef.detectChanges();
  }

  onNavChange(activeId = this.activeId) {
    if (activeId.activeId !== 0) {
      switch (this.active_tab) {
        case 1:
          this.active_tabname = 'Summary'
          break;
        case 2:
          this.active_tabname = 'CCTV'
          break;
        case 3:
          this.active_tabname = 'ACCESS'
          break;
        case 4:
          this.active_tabname = 'INTRUSION'
          break;
        case 5:
          this.active_tabname = 'INTERCOM'
          break;
        case 6:
          this.active_tabname = 'NETWORK'
          break;
        case 7:
          this.active_tabname = 'OTHER'
          break;
        default:
          console.log("NO TAB Selected");
          break;
      }
      return this.active_tabname;
    }
  }

  log(_e: any) {
    // console.log(e);
  }
}
