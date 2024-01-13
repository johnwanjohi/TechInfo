import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AccountsService } from '../../shared/services/accounts.service';
import { DeleteBranchComponent } from './delete-branch/delete-branch.component';

export interface UserData {
  id: string;
  name: string;
  address: string;
}

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchesComponent implements OnInit, AfterViewInit {
  branches: any[];
  dataSource: MatTableDataSource<UserData>;
  displayedColumns: string[] = ['edit', 'delete', 'id', 'name', 'address'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filter: string;
  current_branch: any;
  user: any;
  constructor(
    private router: Router,
    private AC: AccountsService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
    this.AC.loggedInUser.subscribe((user) => {
      this.user = user;
    });
    this.branches = [];
    this.dataSource = new MatTableDataSource();
    this.filter = '';
    this.setBranchDetails();


  }

  ngOnInit(): void {
    this.AC.branchObserver().subscribe((warehouse_id) => {
      if (warehouse_id) {
        this.current_branch = warehouse_id;
      }
      this.ref.detectChanges();
    });

  }
  loadBranches() {
    const params = {
     // action: 'getAll',
      //module: 'branches',
    };
    const endpoint= 'branches/getAll' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.branches = answer.branches;
      this.reset();
    });
  }
  makeAddress() {
    this.branches.forEach((branches) => {
      branches['address'] =
        branches['street'] +
        ', ' +
        branches['city'] +
        ', ' +
        branches['state'] +
        ', ' +
        branches['postal'];
    });
  }
  ngAfterViewInit(): void {

  }
  setBranchDetails() {
    const params = {
      action: 'getAll',
      module: 'branches',
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.branches = answer.branches;
      this.makeAddress();
      this.dataSource.data = this.branches;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.setBranch(0);
      this.AC.deletedBranchObserver().subscribe((id) => {
        const index = this.branches.indexOf(
          this.branches.filter((stock) => stock.id === id)
        );
        this.branches.splice(index, 1);
        this.dataSource.data = this.branches;
        this.AC.setBranch(0);
      });
      this.AC.updatedBranchObserver().subscribe((branch: any) => {
        this.branches.forEach((current, index) => {
          if (current.id === branch.id) {
            this.branches[index] = branch;
          }
        });
        this.makeAddress();
        this.dataSource.data = this.branches;
      });
      this.AC.newBranchObserver().subscribe((branch) => {
        this.branches.push(branch);
        this.makeAddress();
        this.dataSource.data = this.branches;
      });
    });
  }
  reset() {
    this.filter = '';
    this.makeAddress();
    this.dataSource.data = this.branches;
    this.dataSource?.paginator?.firstPage();
    this.dataSource.sort = this.sort;
    this.dataSource.filter = '';
    this.dataSource?.sort?.sort({
      id: '',
      start: 'desc',
      disableClear: false,
    });
    this.setBranch(0);
    // this.router.navigate(['warehouses']);
  }
  setBranch(branchId) {
    this.current_branch = branchId;
    this.AC.setSite(branchId);
    this.AC.setBranch(branchId)
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource?.paginator?.firstPage();
    }
  }
  // Add Button Function
  onAdd(obj?: any) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = true;
    matDialogConfig.autoFocus = true;
    // tslint:disable-next-line:no-unused-expression
    matDialogConfig.scrollStrategy;
    let dialogRef: any;
    // dialogRef = this.dialog.open(AddBranchComponent, matDialogConfig)
  }
  // Edit Button Function
  onEdit(obj?: any) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = true;
    matDialogConfig.autoFocus = true;
    matDialogConfig.data = obj;
    let dialogRef: any;
    // console.dir(obj)
    // dialogRef = this.dialog.open(EditBranchComponent, matDialogConfig)
  }
  // Delete Button Function
  onDelete(obj?: any) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.disableClose = true;
    matDialogConfig.autoFocus = true;
    matDialogConfig.data = obj;
    let dialogRef: any;
    dialogRef = this.dialog.open(DeleteBranchComponent, matDialogConfig)
  }
}
