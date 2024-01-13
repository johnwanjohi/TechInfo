import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { AccountsService } from 'src/app/services/accounts.service';
import { AccountsService } from '../../../shared/services/accounts.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-branch',
  templateUrl: './delete-branch.component.html',
  styleUrls: ['./delete-branch.component.less']
})
export class DeleteBranchComponent implements OnInit {
  id: any;
  name: any;
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private AC: AccountsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteBranchComponent>,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((keys) => {
      this.id = this.data.id; // keys['id'];
      const params = {
        action: 'getById',
        module: 'branches',
        id: this.id,
      };
      this.AC.get(params).subscribe((answer: any) => {
        this.name = answer.branch.name;
      });
    });
  }
  submit() {
    const params = {
     // action: 'delete',
     // module: 'branches',
      id: this.id,
    };
     const endpoint= 'branches/delete' ;
     this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedBranch(this.id);
      // this.router.navigate(['/warehouses']);
      this.dialogRef.close();
    });
  }
  Cancel() {
    // this.router.navigate(['/warehouses']);
    this.dialogRef.close();
  }
}
