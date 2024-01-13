import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysDevicesComponent } from './sys-devices.component';

describe('SysDevicesComponent', () => {
  let component: SysDevicesComponent;
  let fixture: ComponentFixture<SysDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
