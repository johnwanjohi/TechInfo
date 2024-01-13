import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSuppliercontactComponent } from './add-edit-suppliercontact.component';

describe('AddEditSuppliercontactComponent', () => {
  let component: AddEditSuppliercontactComponent;
  let fixture: ComponentFixture<AddEditSuppliercontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSuppliercontactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSuppliercontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
