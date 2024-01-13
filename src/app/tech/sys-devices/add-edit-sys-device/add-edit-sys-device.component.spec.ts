import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSysDeviceComponent } from './add-edit-sys-device.component';

describe('AddEditSysDeviceComponent', () => {
  let component: AddEditSysDeviceComponent;
  let fixture: ComponentFixture<AddEditSysDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSysDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSysDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
