import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSysDeviceComponent } from './delete-sys-device.component';

describe('DeleteSysDeviceComponent', () => {
  let component: DeleteSysDeviceComponent;
  let fixture: ComponentFixture<DeleteSysDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSysDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSysDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
