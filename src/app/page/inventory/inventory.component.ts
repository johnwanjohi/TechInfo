import { Component, OnInit, ViewChild } from '@angular/core';
import { BrandsComponent } from '../brands/brands.component';
import { CategoriesComponent } from '../categories/categories.component';
import { TypesComponent } from '../types/types.component';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})

export class InventoryComponent implements OnInit {

  @ViewChild('types', { static: false }) types: TypesComponent;
  @ViewChild('brands', { static: false }) brands: BrandsComponent;
  @ViewChild('products', { static: false }) products: ProductsComponent;
  @ViewChild('categories', { static: false }) categories: CategoriesComponent;

  constructor() { }

  ngOnInit(): void { }

  resetBrands() {
    this.brands.reset();
  }

  resetCategories() {
    this.categories.reset();
  }

  resetTypes() {
    this.types.reset();
  }

  resetProducts() {
    this.products.reset();
  }
  

}
