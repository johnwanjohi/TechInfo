import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierreturnComponent } from './supplierreturn.component';

describe('SupplierreturnComponent', () => {
  let component: SupplierreturnComponent;
  let fixture: ComponentFixture<SupplierreturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierreturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
