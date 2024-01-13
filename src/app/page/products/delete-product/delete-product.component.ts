import { ProductsComponent } from '../products.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from '../../../shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})

export class DeleteProductComponent implements OnInit {

  id: any;
  product: any;

  constructor(
    public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<ProductsComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      //action: 'getById',
     // module: 'products',
      id: this.id,
    };
    const endpoint=  'products/getById';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.product = answer.product.product;
    });
  }

  Submit() {
    const params = {
      //action: 'getById',
     // module: 'products',
      id: this.id,
    };
    const endpoint=  'products/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedProduct(this.id);
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

