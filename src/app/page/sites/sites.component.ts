import { MatSort } from '@angular/material/sort';
import { SitesData } from 'app/shared/models/index';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteSiteComponent } from './delete-site/delete-site.component';
import { AddEditSiteComponent } from './add-edit-site/add-edit-site.component';
import { MtxGridColumn, MtxGridComponent, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss'],
})

export class SitesComponent implements OnInit, AfterViewInit {

  sites: any[];
  user: any = '';
  filter: string;
  isLoading = true;
  current_site: any;
  total_sites: number;
  current_customer_id: number;

  columnMovable = true;
  columnHideable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<SitesData>;

  rowClassFormatter: MtxGridRowClassFormatter =
    { 'table-active': (data) => Number(data.id) === Number(this.current_site) };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('sitesTable') sitesTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Site', sortable: true, field: 'name' },
    { header: 'Address', sortable: true, field: 'address' },
    { header: 'Customer', sortable: true, field: 'customername', hide: true }
  ];

  constructor(
    private dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.sites = [];
    this.total_sites = 0;
    this.current_customer_id = 0;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
      this.displayedColumns = this.matTableService.hideShowColumns(this.user, this.displayedColumns);
    });
    this.AC.siteObserver().pipe(
      distinctUntilChanged()
    ).subscribe((site_id) => {
      this.current_site = site_id;
      this.changeRef.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    const params = {
     // action: 'getAll',
     // module: 'sites',
    };
    const endpoint= "sites/getAll";
    this.isLoading = true;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.sites = answer.sites;
      this.makeAddress();
      this.dataSource.data = this.sites;
      this.total_sites = this.sites.length;
      this.setSite(0, 0);

      this.AC.newSiteObserver().pipe(
        distinctUntilChanged()
      ).subscribe((site) => {
        this.sites.push(site);
        this.makeAddress();
        if (this.current_customer_id) {
          this.dataSource.data = this.sites.filter(
            (site) => {
              site.customer_id === this.current_customer_id
            }
          );
          this.total_sites = this.dataSource.data.length;
        } else {
          this.dataSource.data = this.sites;
          this.total_sites = this.dataSource.data.length;
        }
        this.loadSites();
      });

      this.AC.updatedSiteObserver().pipe(
        distinctUntilChanged()
      ).subscribe((site: any) => {
        this.sites.forEach((current, index) => {
          if (current.id === site.id) {
            this.sites[index] = site;
          }
        });
        this.makeAddress();
        this.dataSource.data = this.sites;
        this.total_sites = this.dataSource.data.length;
        this.sitesTable.dataSource = this.dataSource;
        this.loadSites();
      });

      this.AC.deletedSiteObserver().pipe(
        distinctUntilChanged()
      ).subscribe((id) => {
        const index = this.sites.indexOf(
          this.sites.filter((site) => site.id === id)
        );
        this.sites.splice(index, 1);
        this.dataSource.data = this.sites;
        this.total_sites = this.dataSource.data.length;
        this.sitesTable.dataSource = this.dataSource;
        this.loadSites();
      });

      this.AC.customerObserver().pipe(
        distinctUntilChanged()
      ).subscribe((customer_id) => {
        this.current_customer_id = customer_id;
        this.loadSites();
        return;
      });
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }

  setSite(site_id, customer_id) {
    this.current_site = site_id;
    this.AC.setSite(site_id);
    this.AC.setSiteCustomer(customer_id);
  }

  loadSites() {
    if (Number(this.current_customer_id) === 0) {
      this.sites = [];
      this.total_sites = 0;
      this.dataSource.data = this.sites;
    }
    this.isLoading = true;
    const params = {
     // action: Number(this.current_customer_id) === 0 ? 'getAll' : 'getAllSitesByCustomerId',
     // module: 'sites',
      customer_id: Number(this.current_customer_id)
    };
    const endpoint= Number(this.current_customer_id) === 0 ? 'sites/getAll' : 'sites/getAllSitesByCustomerId';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.sites = answer.sites;
      this.dataSource.data = this.sites;
      this.total_sites = this.sites.length;
      this.sitesTable.dataSource = this.dataSource;
      this.makeAddress();
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
    this.sitesTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {
    this.filter = '';
    this.current_site = 0;
    this.current_customer_id = 0;
    this.dataSource.data = this.sites;
    this.total_sites = this.sites.length;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.sitesTable.dataSource.paginator) {
      this.sitesTable.dataSource?.paginator?.firstPage();
    }
    this.sitesTable.dataSource.filter = '';
    this.sitesTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.AC.setCustomer(0);
    this.setSite(0, 0);
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
      dialogRef = this.dialog.open(AddEditSiteComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSiteComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
      });
    }
  }

  closeMenu() {
    this.sitesTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // //console.log(e);
  }
}
