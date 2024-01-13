import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSuppliercontactComponent } from './delete-suppliercontact.component';

describe('DeleteSuppliercontactComponent', () => {
  let component: DeleteSuppliercontactComponent;
  let fixture: ComponentFixture<DeleteSuppliercontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSuppliercontactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSuppliercontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
