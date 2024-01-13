import { MatSort } from '@angular/material/sort';
import { distinctUntilChanged } from 'rxjs/operators';
import { SiteNotesData } from 'app/shared/models/index';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatTableService } from 'app/shared/services/mat-table.service';
import { DeleteSitenoteComponent } from './delete-sitenote/delete-sitenote.component';
import { AddEditSitenoteComponent } from './add-edit-sitenote/add-edit-sitenote.component';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MtxGridRowClassFormatter, MtxGridComponent, MtxGridColumn } from '@ng-matero/extensions/grid';

@Component({
  selector: 'app-sitenotes',
  templateUrl: './sitenotes.component.html',
  styleUrls: ['./sitenotes.component.scss']
})

export class SitenotesComponent implements OnInit {

  user: any = '';
  filter: string;
  isLoading = true;
  site_notes: any[];
  current_note_id: any;
  current_site_id: number;
  current_system_type: any;
  note_description: any;

  columnHideable = true;
  columnMovable = true;
  columnHideableChecked: 'show' | 'hide' = 'show';
  dataSource: MatTableDataSource<SiteNotesData>;

  rowClassFormatter: MtxGridRowClassFormatter = {
    'table-active': (data) => Number(data?.id) === Number(this.current_note_id)
  };
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('sitenotesTable') sitenotesTable!: MtxGridComponent;

  displayedColumns: MtxGridColumn[] = [
    { header: 'Action', field: 'Action' },
    { header: 'ID', sortable: true, field: 'id', hide: true },
    { header: 'Site', sortable: true, field: 'site', hide: true },
    { header: 'System Type', sortable: true, field: 'systemtype' },
    { header: 'Note', sortable: true, field: 'note' },
    { header: 'Create Date', sortable: true, field: 'create_date' },
    { header: 'Create By', sortable: true, field: 'create_by', hide: true },
    { header: 'Modify Date', sortable: true, field: 'modify_date', hide: true },
    { header: 'Modify By', sortable: true, field: 'modify_by', hide: true },
    { header: 'Descripotion', sortable: true, field: 'description', hide: true }
  ];

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    private changeRef: ChangeDetectorRef,
    private matTableService: MatTableService
  ) {
    this.filter = '';
    this.site_notes = [];
    this.current_site_id = 0;
    this.current_system_type = '';
    this.note_description = '';
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
        this.loadSiteNotes(this.current_site_id);
        this.isLoading = false
      }
    });
    this.changeRef.markForCheck();
    this.changeRef.detectChanges();
  }

  setSiteNote(sitenote_id) {
    this.AC.setSiteNote(sitenote_id);
    this.current_note_id = Number(sitenote_id);
  }

  loadSiteNotes(current_site = this.current_site_id, calledFrom?: any) {
    this.isLoading = true;
    const params = {
      action: Number(current_site) === 0 ? 'getAll' : 'getAllSiteNotesBySiteId',
      module: 'site_notes',
      site_id: !current_site ? 0 : current_site,
    };
    if (this.current_site_id === 0) {
      return;
    }
    this.AC.get(params).subscribe((answer: any) => {
      this.site_notes = answer.site_notes;
      this.dataSource.data = this.site_notes;
      this.sitenotesTable.dataSource = this.dataSource;
      this.note_description = answer.site_notes.description;
      console.dir(answer);
      this.isLoading = false;
      this.changeRef.detectChanges();
    });
  }
  // Search Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.sitenotesTable.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Reset Button Function
  reset() {

    this.loadSiteNotes(this.current_site_id)
    this.filter = '';
    this.dataSource.data = this.site_notes;
    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
    if (this.sitenotesTable.dataSource.paginator) {
      this.sitenotesTable.dataSource?.paginator?.firstPage();
    }
    this.sitenotesTable.dataSource.filter = '';
    this.sitenotesTable.sort.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.changeRef.detectChanges();
  }
  // Add Edit Delete Dialog Window
  openDialog(action?: any, obj?: any) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = true;
    matDialogConfig.autoFocus = true;
    obj.action = action;
    matDialogConfig.data = obj;
    let dialogRef: any;
    if (action.toLowerCase() === 'add' || action.toLowerCase() === 'edit') {
      dialogRef = this.dialog.open(AddEditSitenoteComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSiteNotes()
      });
    } else if ('delete') {
      dialogRef = this.dialog.open(DeleteSitenoteComponent, matDialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.loadSiteNotes()
      });
    }
  }

  closeMenu() {
    this.sitenotesTable.columnMenu.menuTrigger.closeMenu();
  }

  log(_e: any) {
    // console.log(e);
  }
}
