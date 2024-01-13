import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDevicesComponent } from './network-devices.component';

describe('NetworkDevicesComponent', () => {
  let component: NetworkDevicesComponent;
  let fixture: ComponentFixture<NetworkDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
