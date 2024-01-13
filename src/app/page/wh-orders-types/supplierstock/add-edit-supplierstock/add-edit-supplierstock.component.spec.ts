import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSupplierStockComponent } from './add-edit-supplierstock.component';

describe('AddEditSupplierstockComponent', () => {
  let component: AddEditSupplierStockComponent;
  let fixture: ComponentFixture<AddEditSupplierStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSupplierStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSupplierStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
