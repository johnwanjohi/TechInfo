import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSysLicenseComponent } from './delete-sys-license.component';

describe('DeleteSysLicenseComponent', () => {
  let component: DeleteSysLicenseComponent;
  let fixture: ComponentFixture<DeleteSysLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSysLicenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSysLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
