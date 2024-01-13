import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSupplierreturnComponent } from './add-edit-supplierreturn.component';

describe('AddEditSupplierreturnComponent', () => {
  let component: AddEditSupplierreturnComponent;
  let fixture: ComponentFixture<AddEditSupplierreturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSupplierreturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSupplierreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
