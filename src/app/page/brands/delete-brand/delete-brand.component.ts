import { BrandsComponent } from '../brands.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-brand',
  templateUrl: './delete-brand.component.html',
  styleUrls: ['./delete-brand.component.scss']
})

export class DeleteBrandComponent implements OnInit {

  id: any;
  brand: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<BrandsComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    
    const params = {
      id: this.id,
    };
    const endpoint= 'brands/getById' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.brand = answer.brand.brand;
    });
  }

  Submit() {
  
    const params = {
      id: this.id,
    };
    const endpoint= 'brands/delete' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedBrand(this.id);
      this.closeDialog();
    });
  }

  Cancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}