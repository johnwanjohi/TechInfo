import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSysLicenseComponent } from './add-edit-sys-license.component';

describe('AddEditSysLicenseComponent', () => {
  let component: AddEditSysLicenseComponent;
  let fixture: ComponentFixture<AddEditSysLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSysLicenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSysLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
