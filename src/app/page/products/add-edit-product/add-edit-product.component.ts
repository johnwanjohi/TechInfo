
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ProductsComponent } from '../products.component';
import { Categories, Brands, Types } from 'app/shared/models/';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountsService, urlRegex } from 'app/shared/services/accounts.service';
import { Component, Inject, OnInit, Optional, AfterViewInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})

export class AddEditProductComponent implements OnInit, AfterViewInit, AfterContentChecked {

  id: any;
  action: any;
  myForm: FormGroup;
  type_id: any;
  brand_id: any;
  category_id: any;
  listOfTypes: Types[]
  listOfBrands: Brands[]
  listOfCategories: Categories[];
  types$: Observable<any>;
  brands$: Observable<any>;
  categories$: Observable<any>;
  selected_type: number;
  selected_brand: number;
  selected_category: number;
  current_type_id: number;
  current_brand_id: number;
  current_category_id: number;

  constructor(
    private AC: AccountsService,
    public dialogRef: MatDialogRef<ProductsComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.action = data.action;
    this.myForm = new FormGroup({
      id: new FormControl(0),
      brand_id: new FormControl(0, Validators.required),
      category_id: new FormControl(0, Validators.required),
      type_id: new FormControl(0, Validators.required),
      product: new FormControl('', Validators.required),
      partnumber: new FormControl('', Validators.required),
      description: new FormControl(''),
      link: new FormControl('', [Validators.pattern(urlRegex)]),
      notes: new FormControl('')
    });
  }

  ngOnInit(): void {
    if (this.action === 'edit') {
      this.getProductByID();
    }
    this.getBrands();
    this.getCategories();
    this.getTypes();
  }

  ngAfterViewInit() {
    this.AC.brandObserver().pipe(
      distinctUntilChanged()
    ).subscribe((brand_id) => {
      this.current_brand_id = brand_id;
      this.selected_brand = Number(brand_id);
      this.myForm.patchValue({
        brand_id: Number(this.current_brand_id)
      });
    })
    this.AC.categoryObserver().pipe(
      distinctUntilChanged()
    ).subscribe((category_id) => {
      this.current_category_id = category_id;
      this.selected_category = Number(category_id);
      this.myForm.patchValue({
        category_id: Number(this.current_category_id)
      })
    })
    this.AC.typeObserver().pipe(
      distinctUntilChanged()
    ).subscribe((type_id) => {
      this.current_type_id = type_id;
      this.selected_type = Number(type_id);
      this.myForm.patchValue({
        type_id: Number(this.current_type_id)
      })
    })
    this.changeDetectorRef.detectChanges();
  }

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
  }

  getProductByID() {
    this.id = this.data.id;
    const params = {
      //action: 'getById',
      //module: 'products',
      id: this.id,
    };
    const endpoint= 'products/getById' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue({
        id: Number(answer.product.id),
        brand_id: Number(answer.product.brand_id),
        category_id: Number(answer.product.category_id),
        type_id: Number(answer.product.type_id),
        product: answer.product.product,
        partnumber: answer.product.partnumber,
        description: answer.product.description,
        link: answer.product.link,
        notes: answer.product.notes,
      });
      this.selected_brand = Number(answer.product.brand_id);
      this.selected_category = Number(answer.product.category_id);
      this.selected_type = Number(answer.product.type_id);
    });
  }

  async getTypes() {
    if (this.selected_category === undefined || this.selected_category === 0) return;
    const params = {
      //action: 'getAllTypesByCategoryId',
      //module: 'types',
      category_id: Number(this.selected_category)
    };
    const endpoint=  'types/getAllTypesByCategoryId';
    await this.AC.post(params,endpoint).subscribe((answer: any) => {
      if (answer.types) {
        this.listOfTypes = answer.types.map((arr) => {
          arr.id = Number(arr.id);
          return arr;
        });
      }
    });
    this.types$ = await this.AC.get(params);
    this.types$.subscribe((answer) => {
    });
  }

  async getBrands() {
    const params = {
      id: this.id,
    };
    const endpoint= 'brands/getAll' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.listOfBrands = answer.brands.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
    });
    this.brands$ = await this.AC.get(params);
    this.brands$.subscribe((answer) => {
    });
  }

  async getCategories() {
    const params = {
      //action: 'getAll',
      //module: 'categories',
    };
    const endpoint=  'categories/getAll';
    await this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.listOfCategories = answer.categories.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
    });
    this.categories$ = await this.AC.get(params);
    this.categories$.subscribe((answer) => {
    });
  }

  convertToJSON(product: any) {
    return JSON.parse(product);
  }

  Submit() {
    if (this.action.toLowerCase() === 'add') {
      this.myForm.removeControl('id');
    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.patchValue({
        id: this.data.id
      });
    }
    const params = {
      //action: 'getById',
      //module: 'products',
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'products/put' : 'products/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewProduct(answer.product) :
        this.AC.setUpdateProduct(answer.product);
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
