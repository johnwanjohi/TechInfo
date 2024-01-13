import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSupplierreturnComponent } from './delete-supplierreturn.component';

describe('DeleteSupplierreturnComponent', () => {
  let component: DeleteSupplierreturnComponent;
  let fixture: ComponentFixture<DeleteSupplierreturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSupplierreturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSupplierreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
